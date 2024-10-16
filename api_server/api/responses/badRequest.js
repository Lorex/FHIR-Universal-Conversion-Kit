/**
 * Module dependencies
 */

var util = require('util')
var _ = require('lodash')



/**
 * 400 (Bad Request) Handler
 *
 * Usage:
 * return res.badRequest();
 * return res.badRequest(data);
 *
 * e.g.:
 * ```
 * return res.badRequest(
 *   'Please choose a valid `password` (6-12 characters)',
 *   'trial/signup'
 * );
 * ```
 */

module.exports = function badRequest(data) {

  // Get access to `req` and `res`
  var req = this.req
  var res = this.res

  // Get access to `sails`
  var sails = req._sails

  // Set status code
  res.status(400)

  // 檢查是否欄位有缺項
  if(data.code === 'E_MISSING_OR_INVALID_PARAMS') {
    return res.json({
      success: false,
      code: 998,
      msg: '無效請求',
      detail: data.problems
    })
  }


  return res.json({
    success: false,
    code: 998,
    msg: '無效請求',
    detail: data
  })

}
