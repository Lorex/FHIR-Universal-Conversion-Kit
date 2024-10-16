const e = sails.config.errcode.code

module.exports = function err(params) {
  // Get access to `req` and `res`
  const req = this.req
  const res = this.res
  // Define the status code to send in the response.
  const statusCodeToSet = 400

  let optionalData
  // 過度時期處理...
  if (typeof params === 'object') {
    optionalData = params
  } else if (typeof params === 'number') {
    optionalData = { code: params }
  } else {
    sails.log.info('Ran custom response: res.err()')
    return res.sendStatus(statusCodeToSet)
  }

  const errCode = e[optionalData.code]

  if (errCode === undefined) {
    sails.log.info(
      'Custom response `res.err()` called with an Error: Error code not exists.'
    )
    return res.status(statusCodeToSet)
  }

  const resData = {
    status: errCode.status,
    code: optionalData.code,
    msg: errCode.msg,
    detail: optionalData.detail || ''
  }

  // Set status code and send response data.

  return res.status(resData.status).send({
    success: false,
    code: resData.code,
    msg: resData.msg,
    detail: resData.detail
  })
}
