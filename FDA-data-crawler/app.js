const Crawler = require("js-crawler");

// https://www.npmjs.com/package/js-crawler
new Crawler().configure({ depth: 1 })
  .crawl("https://info.fda.gov.tw/mlms/H0001D.aspx?Type=Lic&LicId=02025486", function onSuccess(page) {

    let html = page.body.toString();
    // console.log(html);

    let medicationChineseNameIndex = html.indexOf("<span id=\"lblChName\">");
    console.log("index:" + medicationChineseNameIndex);

    let medicationChineseName = "";
    for (let i = medicationChineseNameIndex + 21; i < medicationChineseNameIndex + 21 + 60; i++) {
      medicationChineseName += html[i];
    }
    medicationChineseName = medicationChineseName.split("</span>")[0];// 根據HTML TAG分割字串
    if (medicationChineseName != "")
      console.log("藥物中文名稱:" + medicationChineseName);

  });