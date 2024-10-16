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
    const schemaPath = path.join(__dirname, 'fhir_schema', `${fhirVersion}.json`);
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
      const [resourceType, ...fhirPathParts] = target.split('.');
      const fhirPath = fhirPathParts.join('.');

      // 如果該 Resource 還沒有資料，創建一個新的
      if (!resourceEntries[resourceType]) {
        const id = uuid.v4();
        resourceEntries[resourceType] = {
          fullUrl: `${config.config.fhirServerBaseUrl}/${resourceType}/${id}`,
          resource: {
            resourceType,
            id,
            ..._.cloneDeep(config.globalResource[resourceType])
          },
          request: {
            method: 'PUT',
            url: `/${resourceType}/${id}`
          }
        };
      }

      // 運行 beforeConvert hook 函數（如果存在）
      // 欄位資料預處理器：在轉換前對欄位資料進行處理
      const preprocessedData = beforeConvert ? beforeConvert(data[field]) : data[field];
      if (preprocessedData === null) continue;

      // 檢查 schema 中是否存在該字段的定義
      if (!this.schema.definitions[resourceType] || !this.schema.definitions[resourceType].properties[fhirPath]) {
        console.warn(`警告: 在 schema 中找不到 ${resourceType}.${fhirPath} 的定義`);
        continue;
      }

      const propertyType = this.schema.definitions[resourceType].properties[fhirPath].type;

      // 根據屬性類型設置或添加數據
      if (propertyType === 'array') {
        objectPath.push(resourceEntries[resourceType].resource, fhirPath, preprocessedData);
      } else {
        objectPath.set(resourceEntries[resourceType].resource, fhirPath, preprocessedData);
      }

      this.resourceIdList[resourceType] = resourceEntries[resourceType].resource.id;
    }

    // 將所有創建的 resource 添加到 bundle 中
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

    // 處理 reference
    const references = jp.nodes(this.bundle.entry, '$..reference');
    for (const reference of references) {
      if (reference.value.startsWith('#')) {
        const resourceType = reference.value.substring(1);
        const resourceIndex = reference.path[1];
        const resourceId = this.resourceIdList[resourceType];
        objectPath.set(this.bundle.entry[resourceIndex], reference.path.slice(2).join('.'), `${resourceType}/${resourceId}`);
      }
    }

    const config = this.configs[this.useConfig];

    // 運行 afterProcess hook 函數（如果存在）
    if (config.afterProcess) {
      this.bundle = config.afterProcess(this.bundle);
    }

    // 根據配置決定返回結果或上傳到 FHIR server
    if (config.config.action === 'return') {
      return this.bundle;
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

        return result.data;
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
}

module.exports.Convert = Convert;
