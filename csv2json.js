// https://stackoverflow.com/questions/27979002/convert-csv-data-into-json-format-using-javascript

function csv2json(csvText) {
    var lines = csvText.split("\n");

    var resultJSON = [];

    var headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
        var obj = {};
        var currentLine = lines[i].split(",");

        for (let j = 0; j < currentLine.length; j++) {
            if (currentLine[j] == "");// ignore blank value
            else obj[headers[j]] = currentLine[j];
        }
        resultJSON.push(obj);
    }

    return JSON.stringify(resultJSON);
}