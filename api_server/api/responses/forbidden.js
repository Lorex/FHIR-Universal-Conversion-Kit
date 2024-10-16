/**
 * Module dependencies
 */

// n/a



/**
 * 403 (Forbidden) Handler
 *
 * Usage:
 * return res.forbidden();
 *
 * e.g.:
 * ```
 * return res.forbidden();
 * ```
 */

module.exports = function forbidden () {

  // Get access to `res`
  var res = this.res

  // Send status code and "Forbidden" message
  res.status(403).send({
    success: false,
    code: 997,
    message: '拒絕存取',
    detail: '您沒有足夠的權限存取該 API'
  })

}
