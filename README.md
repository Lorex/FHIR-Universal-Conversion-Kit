# FHIR Universal Conversion Kit (Project F.U.C.K)

FHIR Universal Conversion Kit (F.U.C.K.) is a powerful and flexible toolkit designed to convert arbitrary data to HL7 FHIR format.

## Features
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
    // Define global resource templates here
}

module.exports.fields = [
    // Define field mappings here
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
The toolkit provides detailed error messages, including:
- Server response status
- Response headers
- Response body

This information is crucial for debugging and understanding FHIR server responses.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

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

For more details, please refer to the LICENSE file.

對於台灣地區（中華民國境內）使用者：
本著作係採用創用 CC 姓名標示-非商業性-相同方式分享 3.0 台灣 授權條款授權。

您可自由：
- 分享 — 以任何媒介或格式重製及散布本素材
- 修改 — 重混、轉換本素材、及依本素材建立新素材

惟需遵照下列條件：
- 姓名標示 — 您必須給予適當表彰、提供指向本授權條款的連結，以及指出（本作品的原始版本）是否已被變更。您可以任何合理方式為前述表彰，但不得以任何方式暗示授權人為您或您的使用方式背書。
- 非商業性 — 您不得將本素材進行商業目的之使用。
- 相同方式分享 — 若您重混、轉換本素材或依本素材建立新素材，您必須依本素材的授權條款來散布您的貢獻物。

詳細資訊請參考 LICENSE 文件。

© 2023 Lorex and Sitatech Information Services Co., Ltd. All Rights Reserved.
