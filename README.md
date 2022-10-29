# FHIR Universal Conversion Kit (Project F.U.C.K)

FHIR Universal Conversion Kit (F.U.C.K.) is a super awesome and sexy kit that can convert albitary data to HL7 FHIR data. 

## TODO for RedpandaV2(2022 MI-TW FHIR Creator Task)
- [x] Create Medication F.U.C.K convert profile
- [x] Create MedicationRequest F.U.C.K convert profile
- [x] Create Observation F.U.C.K convert profile
- [x] Create Patient F.U.C.K convert profile
- [x] Create Practitioner F.U.C.K convert profile
- [x] Create Procedure F.U.C.K convert profile
- [x] Create Location F.U.C.K convert profile

- [x] Validate Condition converted FHIR JSON
- [x] Validate Encounter converted FHIR JSON
- [x] Validate Medication converted FHIR JSON
- [x] Validate MedicationRequest converted FHIR JSON
- [x] Validate Observation converted FHIR JSON
- [x] Validate Organization converted FHIR JSON
- [x] Validate Patient converted FHIR JSON
- [x] Validate Practitioner converted FHIR JSON
- [x] Validate Procedure converted FHIR JSON

- [x] Update FHIR Resources with References
- [x] Validate Condition converted FHIR JSON with TW Core IG FHIR Validator
- [ ] Validate Encounter converted FHIR JSON with TW Core IG FHIR Validator
- [x] Validate Medication converted FHIR JSON with TW Core IG FHIR Validator
- [x] Validate MedicationRequest converted FHIR JSON with TW Core IG FHIR Validator
- [x] Validate Observation converted FHIR JSON with TW Core IG FHIR Validator
- [x] Validate Organization converted FHIR JSON with TW Core IG FHIR Validator
- [x] Validate Patient converted FHIR JSON with TW Core IG FHIR Validator
- [x] Validate Practitioner converted FHIR JSON with TW Core IG FHIR Validator
- [x] Validate Procedure converted FHIR JSON with TW Core IG FHIR Validator
- [x] Validate Location converted FHIR JSON with TW Core IG FHIR Validator

- [x] Upload Condition converted FHIR JSON to CyLab FHIR Server
- [ ] Upload Encounter converted FHIR JSON to CyLab FHIR Server
- [x] Upload Medication converted FHIR JSON to CyLab FHIR Server
- [ ] Upload MedicationRequest converted FHIR JSON to CyLab FHIR Server
- [x] Upload Observation converted FHIR JSON to CyLab FHIR Server
- [x] Upload Organization converted FHIR JSON to CyLab FHIR Server
- [x] Upload Patient converted FHIR JSON to CyLab FHIR Server
- [x] Upload Practitioner converted FHIR JSON to CyLab FHIR Server
- [x] Upload Procedure converted FHIR JSON to CyLab FHIR Server
- [x] Upload Location converted FHIR JSON to CyLab FHIR Server

## TODO
- :white_check_mark: Core Engine
- :white_check_mark: Multipule Profile (Config File) Support
- :white_check_mark: Data Preprocessor
- :white_check_mark: FHIR Data Uploader
- :arrow_right: FHIR Profile Validator

## Requirements
- node.js 16.8.0

## Installation
Clone this repository to your computer
```bash
$ git clone https://github.com/Lorex/FHIR-Universal-Conversion-Kit.git
```

Install npm packages
```bash
$ cd src
$ npm install
```

Install npm packages
```bash
$ cd src
$ npm install
```

Run Service
```bash
$ chmod +x ./start_server
$ ./start_server
```

## API

Server will default listen on port 1337.

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


## Profile

If you have many different data source formats, you can create separate profiles (also known as config files) for each of them.
Each profile can define different data sources, source fields, conversion rules, and preprocessors.

**ATTENTION: The 'Profile' in this section is NOT FHIR Profile**

Every source data will be processed and converted as the following workflow: 

![workflow](https://i.imgur.com/6JwsLXC.png)

To define a profile, just create `<profileName>.js` in the `profile` folder simply, the server should automatically load all profiles at the start.

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
