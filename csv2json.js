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

            else if (headers[j] == "type") {// 組合type Object
                let typeObj = {};
                let codingObj = {};
                if (currentLine[j + 2] != "")
                    codingObj["system"] = currentLine[j + 2];
                if (currentLine[j + 3] != "")
                    codingObj["code"] = currentLine[j + 3];
                if (currentLine[j + 4] != "")
                    codingObj["display"] = currentLine[j + 4];

                typeObj["coding"] = codingObj;
                if (currentLine[j + 5] != "")
                    typeObj["text"] = currentLine[j + 5];

                obj[headers[j]] = typeObj;// export "type" object

                j += 5;// pass the values that already converted
            }

            else if (headers[j] == "telecom") {
                let telecomObj = {}
                if (currentLine[j + 1] != "")
                    telecomObj["system"] = currentLine[j + 1];
                if (currentLine[j + 2] != "")
                    telecomObj["value"] = currentLine[j + 2];

                obj[headers[j]] = telecomObj;// export "telecom" object

                j += 2; // pass the values that alreay converted
            }

            else if (headers[j].includes("address")) {
                // https://www.w3schools.com/jsref/jsref_includes.asp
                let addressObj = {};

                while (headers[j].includes("address")) {
                    if (currentLine[j] != "") {
                        let keyValue = headers[j].replace("address.", "");
                        // https://www.w3schools.com/jsref/jsref_replace.asp

                        addressObj[keyValue] = currentLine[j];
                    }
                    if (j < currentLine.length) j++;
                }

                obj["address"] = addressObj;
            }

            else if (headers[j] == "active") {
                if (currentLine[j] != "") {
                    let bool = (currentLine[j].toLowerCase() === 'true');
                    // https://stackoverflow.com/questions/263965/how-can-i-convert-a-string-to-boolean-in-javascript
                    obj[headers[j]] = bool;
                }
            }

            else if (currentLine[j] == "");// ignore blank value

            else obj[headers[j]] = currentLine[j];
            // handle the rest of the top level keys for OrganizationMS Profile
        }
        resultJSON.push(obj);
    }

    return JSON.stringify(resultJSON);
}