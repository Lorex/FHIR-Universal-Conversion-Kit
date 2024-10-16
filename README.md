<p align="center">
  <img src="fuck-logo.png" alt="FHIR Universal Conversion Kit Logo" width="200" height="271">
</p>

# FHIR Universal Conversion Kit (Project F.U.C.K)

FHIR Universal Conversion Kit (F.U.C.K.) is an awesome and sexy tool that can convert arbitrary medical data into HL7 FHIR format and supports uploading to FHIR Server.

繁體中文說明文件請參考 [README_zh-TW.md](README_zh-TW.md)

## Development Progress
- :white_check_mark: Core Conversion Engine
- :white_check_mark: Multiple Configuration File Support
- :white_check_mark: Data Preprocessor
- :white_check_mark: FHIR Data Uploader
- :white_check_mark: Detailed Error Handling
- :arrow_right: FHIR Profile Validator (Coming Soon)

## Requirements
- Node.js 20.18.0 or higher

## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/Lorex/FHIR-Universal-Conversion-Kit.git
   ```

2. Install dependencies:
   ```bash
   cd FHIR-Universal-Conversion-Kit
   npm install
   ```

## Usage

### As a Library

You can use F.U.C.K. directly in your Node.js application:

```javascript
const { Convert } = require('path/to/fuck');

const config = 'your_config_name';
const data = [/* your data array */];

async function convertData() {
  const convert = new Convert(config);
  const result = await convert.convert(data);
  console.log(result);
}

convertData();
```

### As an API

To deploy F.U.C.K. as an API:

1. Start the server:
   ```bash
   npm start
   ```

2. Make a POST request to the API endpoint:
   ```
   POST http://your-server-url/api/convert
   ```

   With the following JSON payload:
   ```json
   {
     "config": "your_config_name",
     "data": [/* your data array */]
   }
   ```

### Running the Example Conversion
To run a conversion using the example script:

```bash
node example/example_convert.js
```

## Configuration Files
Configuration files are located in the `config` folder. Each configuration file defines:
- Data source format
- Conversion rules
- Pre-processing and post-processing hooks

To create a new configuration, add a new `.js` file in the `config` folder.

## Conversion Process
The conversion process follows this workflow:
1. Load configuration
2. Pre-process data (if defined)
3. Convert individual fields
4. Post-process data (if defined)
5. Return or upload the resulting FHIR Bundle

## Configuration File Structure

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

## Error Handling
This tool provides detailed error messages, including:
- Server response status
- Response headers
- Response body

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
