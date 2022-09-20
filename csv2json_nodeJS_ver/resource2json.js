const csv2json = require('csvtojson');
const fs = require('fs');

csv2json().fromFile('./csvFiles/test.csv')
    .then(users => {
        console.log(users);
        fs.writeFile(
            './output/output.json',
            JSON.stringify(users, null, 2),
            (err) => { if (err) throw err; }
        )
    });