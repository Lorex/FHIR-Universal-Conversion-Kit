/*
 * Copyright (c) 2023 Lorex and Sitatech Information Services Co., Ltd.
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
 */

'use strict';

// 引入模組
const resources = require('./resources');
const objectPath = require('object-path');
const jp = require('jsonpath');
const uuid = require('uuid');
const axios = require('axios');
const path = require('path');
const _ = require('lodash');  // 用於 deep copy
const fs = require('fs');
const { validateResource } = require('./validator');

// 動態載入 config
const _configs = {};
const configPath = '../config';
const configFiles = fs.readdirSync(path.join(__dirname, configPath));
configFiles.forEach(file => {
  if (path.extname(file) === '.json' || path.extname(file) === '.js') {
    const config = require(path.join(__dirname, configPath, file));
    _configs[config.config.name] = config;
  }
});

// 轉換 class
class Convert {
  constructor(useConfig) {
    this.useConfig = useConfig;
    this.resourceIdList = {};
    this.configs = _.cloneDeep(_configs);
    if (!this.configs[this.useConfig]) {
      throw new Error(`Config "${this.useConfig}" not found.`);
    }
    this.bundle = _.cloneDeep(resources.Bundle(useConfig));

    // 根據設定檔中的 fhir_version 載入對應的 schema，如果未指定則默認使用 R4
    const fhirVersion = this.configs[this.useConfig].config.fhir_version || 'R4';
    const schemaPath = path.join(__dirname, 'fhir_packages', fhirVersion, 'fhir.schema.json');
    try {
      this.schema = require(schemaPath);
    } catch (error) {
      throw new Error(`無法載入 FHIR schema 檔案：${schemaPath}。錯誤：${error.message}`);
    }
  }

  // 轉換單筆資料
  async convertSingle(src) {
    let data = _.cloneDeep(src);
    let config = this.configs[this.useConfig];

    // 運行 beforeProcess hook函數（如果存在）
    data = config.beforeProcess ? config.beforeProcess(data) : data;

    const resourceEntries = {};

    // 遍歷數據的每個欄位
    for (const field in data) {
      const targetField = config.fields.find(f => f.source === field);
      if (!targetField) continue;

      const { target, beforeConvert } = targetField;
      const { templateName, fhirPath: rawFhirPath } = (() => {
        const [tmpl, ...restParts] = target.split('.');
        return { templateName: tmpl, fhirPath: restParts.join('.') };
      })();

      // 正規化路徑，把如 component[0].value 轉為 component.0.value，便於 object-path 處理
      const fhirPath = rawFhirPath.replace(/\[(\d+)\]/g, '.$1');

      // 從 globalResource 取得模板定義，判斷實際的 resourceType
      const templateDefinition = config.globalResource[templateName] || {};
      const baseResourceType = templateDefinition.resourceType || templateName;

      // 如果該 Template 還沒有資料，創建一個新的
      if (!resourceEntries[templateName]) {
        const id = uuid.v4();
        const clonedTemplate = _.omit(_.cloneDeep(templateDefinition), ['resourceType', 'id']);
        resourceEntries[templateName] = {
          fullUrl: `${config.config.fhirServerBaseUrl}/${baseResourceType}/${id}`,
          resource: {
            resourceType: baseResourceType,
            ...clonedTemplate,
            id
          },
          request: {
            method: 'PUT',
            url: `/${baseResourceType}/${id}`
          }
        };
      }

      // 運行 beforeConvert hook 函數（如果存在）
      // 欄位資料預處理器：在轉換前對欄位資料進行處理
      const preprocessedData = beforeConvert ? beforeConvert(data[field]) : data[field];
      if (preprocessedData === null) continue;

      // 取得頂層屬性名稱，並移除索引
      const topLevelKey = fhirPath.split('.')[0].replace(/\d+/, '');

      // 檢查 schema 中是否存在該字段的定義
      if (!this.schema.definitions[baseResourceType] || !this.schema.definitions[baseResourceType].properties[topLevelKey]) {
        console.warn(`警告: 在 schema 中找不到 ${baseResourceType}.${topLevelKey} 的定義`);
        continue;
      }

      const propertyType = this.schema.definitions[baseResourceType].properties[topLevelKey].type;

      const targetResource = resourceEntries[templateName].resource;

      // 根據屬性類型及路徑是否包含索引決定 push 或 set
      if (propertyType === 'array' && !fhirPath.includes('.0') && !/\.\d+\./.test(fhirPath)) {
        // 對於陣列且未指定索引的情況，使用 push
        objectPath.push(targetResource, fhirPath, preprocessedData);
      } else {
        // 否則直接 set（覆蓋或創建指定索引）
        if (propertyType === 'array' && !targetResource[topLevelKey]) {
          targetResource[topLevelKey] = [];
        }
        objectPath.set(targetResource, fhirPath, preprocessedData);
      }

      // 保存 id 供 reference 轉換使用，以實際的 FHIR 資源類型為 key
      this.resourceIdList[baseResourceType] = resourceEntries[templateName].resource.id;
    }

    // 在合併進入 bundle 之前，先解析此 batch 內部的 inline references
    const localIdMap = {};
    Object.values(resourceEntries).forEach(entry => {
      if (entry.resource && entry.resource.resourceType) {
        localIdMap[entry.resource.resourceType] = entry.resource.id;
      }
    });

    // 解析 local reference (僅限於此 batch)
    Object.values(resourceEntries).forEach(entry => {
      const refs = jp.nodes(entry.resource, '$..reference');
      refs.forEach(r => {
        if (typeof r.value === 'string' && r.value.startsWith('#')) {
          const refType = r.value.substring(1);
          const refId = localIdMap[refType];
          if (refId) {
            objectPath.set(entry.resource, r.path.slice(1).join('.'), `${refType}/${refId}`);
          }
        }
      });
    });

    // 將所創建的 resource 添加到 bundle 中
    Object.values(resourceEntries).forEach(entry => {
      this.bundle.entry.push(entry);
    });
  }

  // 轉換 data array
  async convert(dataArray) {
    this.displayTargetFHIRVersion();  // 在轉換開始前顯示目標 FHIR 版本

    // 遍歷並轉換每個數據項
    for (const item of dataArray) {
      await this.convertSingle(item);
    }

    const config = this.configs[this.useConfig];

    // 運行 afterProcess hook 函數（如果存在）
    if (config.afterProcess) {
      this.bundle = config.afterProcess(this.bundle);
    }

    // 更新 resourceIdList 以包含 afterProcess 新增的資源
    this.bundle.entry.forEach(entry => {
      if (entry.resource && entry.resource.resourceType && entry.resource.id) {
        this.resourceIdList[entry.resource.resourceType] = entry.resource.id;
      }
    });

    // 解析 inline reference
    this.resolveInlineReferences();

    // 只有在 config.config.validate 為 true 時才進行驗證
    let validationResults = null;
    if (config.config.validate === true) {
      validationResults = await this.validateResources();
    }

    // 根據配置決定返回結果或上傳到 FHIR server
    if (config.config.action === 'return') {
      return {
        bundle: this.bundle,
        validationResults: validationResults
      };
    }

    if (config.config.action === 'upload') {
      const headers = config.config.token ? { Authorization: `Bearer ${config.config.token}` } : {};
      try {
        const result = await axios.post(config.config.fhirServerBaseUrl, this.bundle, { headers });
        console.log('上傳成功！');
        // 解析 Bundle transaction-response
        if (result.data.resourceType === 'Bundle' && result.data.type === 'transaction-response') {
          console.log('資源上傳狀態：');
          result.data.entry.forEach((entry, index) => {
            const resource = this.bundle.entry[index].resource;
            const status = entry.response.status;
            const location = entry.response.location;
            const id = location ? location.split('/')[1] : 'Unknown';
            console.log(`${resource.resourceType} ${id} 上傳狀態: ${status}`);
          });
        }

        return {
          uploadResult: result.data,
          validationResults: validationResults
        };
      } catch (err) {
        if (err.response) {
          // 服務器回應了一個超出 2xx 範圍的狀態碼
          console.error('上傳到 FHIR 服務器時發生錯誤:');
          console.error(`狀態碼: ${err.response.status}`);
          console.error('回應頭:', err.response.headers);
          console.error('回應內容:', err.response.data);
          throw new Error(`FHIR 服務器錯誤 (${err.response.status}): ${JSON.stringify(err.response.data)}`);
        } else if (err.request) {
          // 請求已經發出，但沒有收到回應
          console.error('未收到 FHIR 服務器的回應');
          throw new Error('未收到 FHIR 服務器的回應');
        } else {
          // 在設置請求時發生了一些錯誤
          console.error('發送請求時發生錯誤:', err.message);
          throw new Error(`發送請求時發生錯誤: ${err.message}`);
        }
      }
    }
  }

  // 新增一個方法來顯示目標 FHIR 版本
  displayTargetFHIRVersion() {
    const fhirVersion = this.configs[this.useConfig].config.fhir_version || 'R4';
    console.log(`目標 FHIR 版本：${fhirVersion}`);
  }

  async validateResources() {
    const fhirVersion = this.configs[this.useConfig].config.fhir_version || 'R4';
    const validationResults = [];

    console.log('開始驗證資源...');
    for (const entry of this.bundle.entry) {
      const result = await validateResource(entry.resource, fhirVersion);
      validationResults.push({
        resourceType: entry.resource.resourceType,
        id: entry.resource.id,
        ...result
      });
    }

    console.log('驗證結果：');
    validationResults.forEach(result => {
      console.log(`${result.resourceType} ${result.id}: ${result.valid ? '通過' : '未通過'}`);
      if (!result.valid) {
        result.issues.forEach(issue => {
          console.log(`  ${issue.severity}: ${issue.details} (${issue.location})`);
        });
      }
    });

    return validationResults;
  }

  resolveInlineReferences() {
    const references = jp.nodes(this.bundle.entry, '$..reference');
    for (const reference of references) {
      if (typeof reference.value === 'string' && reference.value.startsWith('#')) {
        const refType = reference.value.substring(1);
        const resourceIndex = reference.path[1]; // entry index in bundle
        const targetId = this.resourceIdList[refType];
        let resolvedId = targetId;
        if (!resolvedId) {
          // 嘗試從 bundle 中尋找資源並補上 id
          const targetEntry = this.bundle.entry.find(e => e.resource && e.resource.resourceType === refType);
          if (targetEntry) {
            if (!targetEntry.resource.id) {
              targetEntry.resource.id = uuid.v4();
            }
            resolvedId = targetEntry.resource.id;
            this.resourceIdList[refType] = resolvedId;
          }
        }

        if (resolvedId) {
          const newRef = `${refType}/${resolvedId}`;
          console.log('Updating reference', reference.path, '=>', newRef);
          objectPath.set(
            this.bundle.entry[resourceIndex],
            reference.path.slice(2).join('.'),
            newRef
          );
        } else {
          console.warn(`無法解析 reference：未找到 ${refType} 的資源 ID`);
        }
      }
    }
  }
}

// 將 validateResource 函數作為模組的一部分導出
module.exports = {
  Convert,
  validateResource
};
