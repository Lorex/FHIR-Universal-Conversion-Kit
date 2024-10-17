const fs = require('fs');
const path = require('path');
const { validateResource } = require('../src');

// Generate an example FHIR Patient resource
const examplePatient = {
  resourceType: 'Patient',
  id: 'example',
  meta: {
    profile: [
      'http://hl7.org/fhir/StructureDefinition/Patient'
    ]
  },
  text: {
    status: 'generated',
    div: '<div xmlns="http://www.w3.org/1999/xhtml"><p>John Doe</p></div>'
  },
  identifier: [
    {
      system: 'http://example.org/fhir/sid/mrn',
      value: '12345'
    }
  ],
  name: [
    {
      use: 'official',
      family: 'Doe',
      given: ['John']
    }
  ],
  gender: 'male',
  birthDate: '1970-01-01'
};

// Execute validation
async function validateExample() {
  try {
    console.log('Starting validation of example Patient resource...');
    const validationResult = await validateResource(examplePatient, 'R4');
    
    console.log('Validation result:');
    console.log(`Patient ${examplePatient.id}: ${validationResult.valid ? 'Passed' : 'Failed'}`);
    if (!validationResult.valid) {
      validationResult.issues.forEach(issue => {
        console.log(`  ${issue.severity}: ${issue.details} (${issue.location})`);
      });
    }

    // Write validation result to file
    const outputPath = path.join(__dirname, 'validation_result.json');
    fs.writeFileSync(outputPath, JSON.stringify(validationResult, null, 2));
    console.log(`Validation result has been written to: ${outputPath}`);

  } catch (error) {
    console.error('An error occurred during the validation process:', error);
  }
}

// Execute validation
validateExample();
