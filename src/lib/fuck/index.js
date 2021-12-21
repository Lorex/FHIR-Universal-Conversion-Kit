'use strict';

const fhir = require('../../../fhirconfig');
const resources = Object.assign({},require('./resources'));
const objectPath = require('object-path');
const jp = require('jsonpath');
const uuid = require('uuid');
const schema = require('./fhir_schema/schema.json');


class Convert {
  constructor(src) {
    this.data = src;
    this.bundle = JSON.parse(JSON.stringify(resources.Bundle));
    this.resourceIdList = {};
    this.fhir = JSON.parse(JSON.stringify(fhir));
    
  }

  async convert() {
    // iterate through each field in the data
    const data = this.data;
    
    let bundle = JSON.parse(JSON.stringify(this.bundle));
    let resourceIdList = JSON.parse(JSON.stringify(this.resourceIdList));
    let fhir = JSON.parse(JSON.stringify(this.fhir));

    for (const field in data){
      // find target field in the config
      let targetField = fhir.fields.find(f => {
        return (f.source === field)
      });
      const target = targetField.target;
      
      // get the resource type
      let resourceType = target.split('.')[0];

      // find resource in the bundle
      let resource = bundle.entry.find(entry => entry.resource.resourceType === resourceType);

      // if resource does not exist, create it
      if (!resource) {
        const id = uuid.v4();
        bundle.entry.push({
          fullUrl: `${fhir.config.fhirServerBaseUrl}/${resourceType}/${id}`,
          resource: {
            resourceType: resourceType,
            id: id,
            ...fhir.globalResource[resourceType]
          },
          request: {
            method: 'PUT',
            url: `/${resourceType}/${id}`
          }
        });
      }

      // get resource index in the bundle
      let resourceIndex = bundle.entry.findIndex(entry => entry.resource.resourceType === resourceType);


      // get fhir path in the target
      let fhirPath = target.split('.').slice(1).join('.');

      // run beforeConvert function if it exists
      let preprocessedData = targetField.beforeConvert ? targetField.beforeConvert(data[field]) : data[field];

      // write the resource to the bundle
      switch (schema.definitions[resourceType].properties[fhirPath].type) {
        case 'array':
          objectPath.push(bundle.entry[resourceIndex].resource, fhirPath, preprocessedData);
          break;
        default:
          objectPath.set(bundle.entry[resourceIndex].resource, fhirPath, preprocessedData);
          break;
      }
    }
    // build id list
    resourceIdList = {};
    for (let i = 0; i < bundle.entry.length; i++) {
      resourceIdList[bundle.entry[i].resource.resourceType] = bundle.entry[i].resource.id;
    }

    const references = jp.nodes(bundle.entry, '$..reference');
    for (let i = 0; i < references.length; i++) {

      const reference = references[i];

      if (reference.value.startsWith('#')) {
        const resourceType = reference.value.substring(1);
        const resourceIndex = reference.path[1];
        const resourceId = resourceIdList[resourceType];
        
        objectPath.set(bundle.entry[resourceIndex], reference.path.slice(2).join('.'), `${resourceType}/${resourceId}`);
      }
    }
    return bundle;
  }
}

module.exports.Convert = Convert;