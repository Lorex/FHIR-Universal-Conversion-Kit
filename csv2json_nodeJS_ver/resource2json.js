const csv2json = require('csvtojson');
const fs = require('fs');

csv2json().fromFile('./csvFiles/test.csv')
    .then(results => {
        console.log(results);
        fs.writeFile(
            './output/output.json',
            JSON.stringify(results, null, 2),
            (err) => { if (err) throw err; }
        )
    });