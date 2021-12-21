module.exports.errcode = {
  code: {
    //- 100: 裝置相關
    100: {
      msg: '在 FHIR Server 上查無此裝置',
      status: 404,
    },
    101: {
      msg: '更新失敗，不正確的 cron 表示式',
      status: 400,
    },

    //- 900: 操作相關
    991: {
      msg: '資料格式錯誤',
      status: 400,
    },
    992: {
      msg: '權限不足，拒絕存取',
      status: 403,
    },
    993: {
      msg: 'AppSecret 錯誤',
      status: 401,
    },
    994: {
      msg: '資料庫寫入失敗',
      status: 500,
    },
    995: {
      msg: '登入階段已過期（Session Expired）',
      status: 440,
    },
    996: {
      msg: '找不到有效的 Token 或是 Token 錯誤',
      status: 401,
    },
    997: {
      msg: '找不到該項設定',
      status: 401,
    },
  }
};
