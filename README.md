# FHIR Universal Conversion Kit (Project F.U.C.K)

FHIR Universal Conversion Kit (F.U.C.K.) is a super awesome and sexy kit that can convert albitary data to HL7 FHIR data. 

## Installation & Usage Overview
### 1. Make sure your system enviroment already meet the [Requirements](#requirements)

### 2. Follow the [Installation Steps](#installation) to install this Kit on your local machine

### 3. See [API Usage](#api) and test with [API Usage Example](#usage-example)

### 4. You can [Learn about F.U.C.K Profile](#profile) and start to [Create your FHIR Convert Profile](#how-to-create-your-fhir-convert-profile)

### 5. [Learn How to convert CSV file to Payload JSON](#how-to-convert-csv-to-payload-json)

### 6. We provide [TWcore 10 Basic FHIR Resources Convert Profile and Excel format template](#twcore-10-basic-fhir-resources)

---

## Requirements
- node.js 16.8.0
- Any Restful API Client Tools
  * [Postman](https://www.postman.com/downloads/)
  * VScode Extension: [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

## Installation
### Step1.Clone this repository to your computer
```bash
$ git clone https://github.com/Lorex/FHIR-Universal-Conversion-Kit.git
```

### Step2.Install npm packages
```bash
$ cd src
$ npm install
```

### Step3.Run Service
#### Method 1 (Make sure you're in the project's root folder)
```bash
$ chmod +x ./start_server
$ ./start_server
```

#### Method 2 (Make sure you're in the `src` folder)
```bash
$ node app.js
```

## API

Server will default listen on port 1337.

### Usage Guide
API Endpoint
```
POST <serverurl>
```

Payload
```json
{
    "profile": "<Profile Name>",
    "data": [
        "Source Data",
    ]
}
```

Response
```json
{
    "success": true,
    "data": [
        "Response Data"
    ]
}
```

### Usage Example
API Endpoint
```
POST http://localhost:1337
```

Payload
```json
{
  "profile": "dental",
  "data": [
    {
      "doctor_id": "6"
    },
    {
      "doctor_id": "69"
    },
  ]
}
```

Response
<details>

```json
{
  "success": true,
  "data": [
    {
      "resourceType": "Bundle",
      "type": "transaction",
      "entry": [
        {
          "fullUrl": "https://hapi.fhir.tw/fhir/Practitioner/prac-6",
          "resource": {
            "resourceType": "Practitioner",
            "id": "prac-6"
          },
          "request": {
            "method": "PUT",
            "url": "/Practitioner/prac-6"
          }
        }
      ]
    },
    {
      "resourceType": "Bundle",
      "type": "transaction",
      "entry": [
        {
          "fullUrl": "https://hapi.fhir.tw/fhir/Practitioner/prac-69",
          "resource": {
            "resourceType": "Practitioner",
            "id": "prac-69"
          },
          "request": {
            "method": "PUT",
            "url": "/Practitioner/prac-69"
          }
        }
      ]
    }
  ]
}
```

</details>

## Profile

### Basic Knowledge

If you have many different data source formats, you can create separate profiles (also known as config files) for each of them.
Each profile can define different data sources, source fields, conversion rules, and preprocessors.

**ATTENTION: The 'Profile' in this section is NOT FHIR Profile**

Every source data will be processed and converted as the following workflow: 

![workflow](https://i.imgur.com/6JwsLXC.png)

### How to create your FHIR convert Profile

To define a profile, just create `<profileName>.js` in the `profile` folder simply, the server should automatically load all profiles at the start.

**ATTENTION: The 'Profile' in this section is NOT FHIR Profile**

This is an example of the profile:
```javascript
module.exports.profile = {
    // Name of the profile
    name: 'example',

    // version of the profile
    version: '1.0.0',

    // The base URL of the FHIR server, this field will affect the 'fullUrl' element in the generated bundle.
    fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',     // 

    // Whether should we do after conversion?
    // 'upload': Upload the converted data to the FHIR server and return the server response.
    // 'return': Don't upload, just return the converted data.
    action: 'upload',
    token: 'your-token-string' // You can add your token~
}

module.exports.globalResource = {
    // Should be resource name
    Patient: {
        // Defile resource template here
        active: true
        
        // If you want to reference to other resource of this bundle automatically, use '{ reference: #<ResourceType> }'
        managingOrganization: {
            reference: '#Organization',
        }
    },
    Practitioner: {
        active: true,
    },
}

// Global Preprocessor Hook
// Data will run the following function before we iterate each fields
module.exports.beforeProcess = (data) => {
    // Do something
    return data
}

// Define your fields and conversion rules here
module.exports.fields = [
    {
        // Field name of the source data
        source: 'pname',

        // Target element of FHIR resource which source data will converted to
        target: 'Patient.id',

        // Field preprocessor hook before we convert the source data
        beforeConvert: (data) => {
            return `pat-test2-${data}`
        }
    }
]

```

## How to convert csv to payload json

### 1. Open `csv2json_HTML_ver` folder
### 2. Open `csv2json.html` with your browser
### 3. Copy your CSV file content as text
### 4. Paste your CSV text in input box
![](https://i.imgur.com/q4vdPf3.png)
### 5. Copy your converted Payload JSON from output textbox and paste into your REST Client 😄

## TWcore 10 Basic FHIR Resources
### What is TWcore
+ https://twcore.mohw.gov.tw/ig/

### List of supported FHIR Resources
| **FHIR Resource Type** | **Corresponding F.U.C.K convert Profile** |
|------------------------|-------------------------------------------|
| Condition              | conditionMS.js                            |
| Encounter              | encounterMS.js                            |
| Location               | location.js                               |
| Medication             | medication-TWCore.js                      |
| MedicationRequest      | medicationRequestMS.js                    |
| Observation            | observationMS.js                          |
| Organization           | organizationMS.js                         |
| Patient                | patientMS.js                              |
| Practitioner           | practitionerMS.js                         |
| Procedure              | procedureMS.js                            |

### Excel format template Usage
All files are located in `twcore` folder

See the documentation for [How To Use TWcore Excel Format](./Excel-templates/twcore/how-to-use-twcore.md#excel範例格式使用說明)

### Convert Profile Usage Example
See the documentation for [How To Use TWcore Convert Profiles](./Excel-templates/twcore/how-to-use-twcore.md#fuck-profile使用範例)

## Special Thanks
🎉🎉🎉
### Fork from [Lorex L. Yang's Github](https://github.com/Lorex)
🥇🥇🥇
### Original Repo: [FHIR Universal Conversion Kit (Project F.U.C.K)](https://github.com/Lorex/FHIR-Universal-Conversion-Kit)
👍👍👍

## TODO List
- [x] 完善TWcore使用手冊