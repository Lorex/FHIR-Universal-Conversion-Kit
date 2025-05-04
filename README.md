<p align="center">
  <img src="fuck-logo.png" alt="FHIR Universal Conversion Kit Logo" width="200" height="271">
</p>

# FHIR Universal Conversion Kit (Project F.U.C.K)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com) [![npm version](https://badge.fury.io/js/@fhir-uck%2Ffhir-converter-core.svg)](https://badge.fury.io/js/@fhir-uck%2Ffhir-converter-core) [![HitCount](https://hits.dwyl.com/Lorex/FHIR-Universal-Conversion-Kit.svg?style=flat-square)](http://hits.dwyl.com/Lorex/FHIR-Universal-Conversion-Kit)

[![NPM](https://nodei.co/npm/@fhir-uck%2Ffhir-converter-core.png)](https://nodei.co/npm/@fhir-uck%2Ffhir-converter-core/)

FHIR Universal Conversion Kit (F.U.C.K.) is an awesome and sexy tool that can convert arbitrary medical data into HL7 FHIR format and supports uploading to FHIR Server.

For Chinese documentation, please refer to [README_zh-TW.md](README_zh-TW.md)

## Disclaimer 專案聲明

[不要點我 Don't Click Me](itri-do-better.md)

## Introduction

### What the F.U.C.K.?

F.U.C.K. is a tool designed to convert various medical data into FHIR format and supports uploading to FHIR Server. Traditional medical data integration between different systems often requires writing a conversion program for each data format, which can be burdensome for developers. F.U.C.K. offers a Low-Code or even No-Code solution, allowing users to simply write a configuration file to convert various data into FHIR format. Subsequently, the FHIR format can be used for cross-hospital or cross-system data exchange.


### Why is it called F.U.C.K.?

F.U.C.K. stands for "FHIR Universal Conversion Kit", so the middle dot should not be omitted. :P

### Why should I F.U.C.K.?

- **Multi-FHIR Version Support**: Supports multiple FHIR versions, ensuring broad compatibility.
- **Data Validation**: Converts and validates data, then automatically uploads to FHIR Server.
- **Data Pre/Post-processor**: Offers options for pre-processing and post-processing of data.
- **Auto Uploader**: Converts and validates data, then automatically uploads to FHIR Server.
- **Less Coding**: Provides a GUI for creating configuration files without writing code.
- **Efficiency**: Save your ass and NEVER write code to convert medical data again!


## Development Progress
- :white_check_mark: Core Conversion Engine
- :white_check_mark: Multiple Configuration File Support
- :white_check_mark: Data Preprocessor
- :white_check_mark: FHIR Data Uploader
- :white_check_mark: Detailed Error Handling
- :white_check_mark: FHIR Resource Validator
- :white_check_mark: GUI Configuration Builder
- :arrow_right: Multi-source Data Support
- :arrow_right: TW Core IG Built-in Support

## How to get F.U.C.K.ed?

### Requirements
- Node.js 20.18.0 or higher

### Installation
Install F.U.C.K. using npm:

```bash
npm install @fhir-uck/fhir-converter-core
```

## Go F.U.C.K. yourself!

### As a Library

You can use F.U.C.K. directly in your Node.js application. You may pass either a config name (string) or a config object:

```javascript
const { Convert } = require('@fhir-uck/fhir-converter-core');

// Option 1: Use config name (string)
const configName = 'your_config_name';
const convert1 = new Convert(configName);

// Option 2: Use config object
const configObject = require('./config/your_config_name');
const convert2 = new Convert(configObject);

const data = [/* your data array */];

async function convertData() {
  // Use either convert1 or convert2
  const result = await convert1.convert(data);
  // If validation is enabled in config, result will include validationResults
  // Otherwise, result will only have the bundle field
  console.log(result);
}

convertData();
```

### As an API

To deploy F.U.C.K. as an API, you'll need to create a server application. Here's a basic example using Express:

1. Install Express:
   ```bash
   npm install express
   ```

2. Create a server file (e.g., `server.js`):
   ```javascript
   const express = require('express');
   const { Convert, Validator } = require('@fhir-uck/fhir-converter-core');

   const app = express();
   app.use(express.json());

   app.post('/api/convert', async (req, res) => {
     const { config, data, validate } = req.body;
     
     try {
       const convert = new Convert(config);
       const result = await convert.convert(data);
       
       if (validate) {
         const validator = new Validator();
         const validationResult = await validator.validate(result);
         res.json({ result, validationResult });
       } else {
         res.json({ result });
       }
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. Make a POST request to the API endpoint:
   ```
   POST http://localhost:3000/api/convert
   ```

   With the following JSON payload:
   ```json
   {
     "config": "your_config_name",
     "data": [/* your data array */],
     "validate": true  // Set to true if you want to validate the converted data
   }
   ```

### Running the Example Conversion
To run a conversion using an example script, create a new file (e.g., `example_convert.js`) with the following content:

```javascript
const { Convert, Validator } = require('@fhir-uck/fhir-converter-core');

const config = 'example_config'; // Replace with your config name
const data = [/* your example data */];

async function exampleConvert() {
  const convert = new Convert(config);
  const result = await convert.convert(data);
  
  const validator = new Validator();
  const validationResult = await validator.validate(result);
  
  console.log('Conversion result:', result);
  console.log('Validation result:', validationResult);
}

exampleConvert();
```

Then run the script:

```bash
node example_convert.js
```

## Configuration Files
Configuration files are located in the `config` folder. Each configuration file defines:
- Data source format
- Conversion rules
- Pre-processing and post-processing hooks
- Validation rules

You can create new configuration files by adding `.js` files to the `config` folder, or use the GUI builder to create configuration files.

### Conversion Process
The conversion process follows this workflow:
1. Load configuration
2. Pre-process data (if defined)
3. Convert individual fields
4. Post-process data (if defined)
5. Validate the resulting FHIR Bundle (if enabled)
6. Return or upload the resulting FHIR Bundle

### Using the GUI Configuration Builder

F.U.C.K. provides a user-friendly GUI for creating and editing configuration files. To use the GUI:

1. Open the `config_builder/index.html` file in your web browser.
2. Use the interface to set up your configuration, including field mappings, preprocessors, and postprocessors.
3. Click the "Download Config" button to save your configuration file.
4. Place the downloaded configuration file in the `config` folder of your F.U.C.K. installation.


### Configuration File Structure

Here's an example of a configuration file:

```javascript
const uuid = require('uuid');

const organizationId = uuid.v4();

module.exports.config = {
    name: 'example_config',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.org/baseR4',
    action: 'upload', // 'upload' or 'return'
}

module.exports.globalResource = {
    // Define global FHIR Resource templates here
    // You can customize FHIR Resource Template, if not defined, it will use FHIR default Resource Template
}

module.exports.fields = [
    // Define field mappings here
    {
      source: 'source field name',
      target: 'target FHIR field name, using FHIR Path',
      beforeConvert: (data) => {
        // Process the data field before conversion
        return data;
      }
    }
]

module.exports.beforeProcess = (data) => {
    // Pre-processing logic
    return data;
}

module.exports.afterProcess = (bundle) => {
    // Post-processing logic
    return bundle;
}
```

## FHIR Resource Validator

F.U.C.K. includes a built-in FHIR Resource Validator, which can be used to validate whether the converted FHIR resources comply with FHIR specifications. The validator checks:

- The accuracy of resource structure
- Mandatory fields
- Data type consistency
- Value set regulations

The validator has two operating modes:

### 1. Automatic Validation in Configuration File

You can enable automatic validation in the configuration file. This way, every conversion will automatically include validation:

```javascript
module.exports.config = {
    name: 'example_config',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.org/baseR4',
    action: 'upload',
    validate: true  // Enable automatic validation
}
```

When `validate` is set to `true`, the conversion process will automatically include validation steps. If validation fails, the conversion result will include validation error information. If validation is not enabled, the result will only contain the bundle field and will not include validationResults.

### 2. Independent Use

You can also use the validator independently, allowing you to manually validate when needed:

```javascript
const { Validator } = require('path/to/src');

const validator = new Validator();
const validationResult = await validator.validate(fhirBundle);

if (validationResult.valid) {
  console.log('FHIR resource is valid');
} else {
  console.log('Validation errors:', validationResult.errors);
}
```

> Note: Standalone validation returns only validation info (such as valid, errors), not the bundle. In the main conversion process, validationResults is only present if validation is enabled; otherwise, only bundle is returned.

## Error Handling
F.U.C.K. provides detailed error messages, including:
- Server response status
- Response body
- Validation errors

If the conversion fails, it will return an error message with an error code for easy debugging.

## Contributing
If you have any new ideas, feel free to submit an Issue or Pull Request.

## License

For users outside Taiwan:
This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0).

You are free to:
- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material

Under the following terms:
- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- NonCommercial — You may not use the material for commercial purposes.
- ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

For more details, please refer to the [LICENSE](LICENSE) file.

© 2023 Lorex and Sitatech Information Services Co., Ltd. All Rights Reserved.
