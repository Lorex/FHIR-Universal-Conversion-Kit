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

function csv2json_organizationMS(csvText) {
    // 根據不同FHIR profile來自定義csv轉換JSON的轉換邏輯
    var lines = csvText.split("\n");

    var resultJSON = [];

    var headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
        var obj = {};
        var currentLine = lines[i].split(",");

        for (let j = 0; j < currentLine.length; j++) {
            if (headers[j] == "text") {// 組合text Object
                let textObj = {};
                if (currentLine[j + 1] != "")// ignore blank value
                    textObj["status"] = currentLine[j + 1];
                if (currentLine[j + 2] != "")// ignore blank value
                    textObj["div"] = currentLine[j + 2];

                obj[headers[j]] = textObj;// export "text" object

                j += 2;// pass the values that already converted
            }
            else if (headers[j] == "identifier") {// 組合identifier Object
                let identifierObj = {};
                if (currentLine[j + 1] != "")
                    identifierObj["use"] = currentLine[j + 1];

                let typeObj = {};
                let codingObj = {};
                if (currentLine[j + 4] != "")
                    codingObj["system"] = currentLine[j + 4];
                if (currentLine[j + 5] != "")
                    codingObj["code"] = currentLine[j + 5];
                if (currentLine[j + 6] != "")
                    codingObj["display"] = currentLine[j + 6];

                typeObj["coding"] = codingObj;
                if (currentLine[j + 7] != "")
                    typeObj["text"] = currentLine[j + 7];

                identifierObj["type"] = typeObj;
                if (currentLine[j + 8] != "")
                    identifierObj["system"] = currentLine[j + 8];
                if (currentLine[j + 9] != "")
                    identifierObj["value"] = currentLine[j + 9];

                obj[headers[j]] = identifierObj;// export "identifiter" object

                j += 9;// pass the values that already converted
            }

            else if (currentLine[j] == "");// ignore blank value

            else obj[headers[j]] = currentLine[j];
            // handle the rest of the top level keys for OrganizationMS Profile
        }
        resultJSON.push(obj);
    }

    return JSON.stringify(resultJSON);
}