/**
 * Module dependencies
 */

var util = require('util')
var _ = require('lodash')

/**
 * 200 (OK) Response
 *
 * Usage:
 * return res.ok();
 * return res.ok(data);
 *
 * @param  {JSON?} data
 */

module.exports = function ok(data) {
  // Get access to `req` and `res`
  var req = this.req
  var res = this.res

  // Get access to `sails`
  var sails = req._sails

  // Set status code
  res.status(200)

  // Extreme edge case (very rare to pass an Error into res.ok() -- but still, just in case)
  // If the data is an Error instance and it doesn't have a custom .toJSON(),
  // then util.inspect() it instead (otherwise res.json() will turn it into an empty dictionary).
  // > Note that we don't do this in production, since (depending on your Node.js version) inspecting
  // > the Error might reveal the `stack`.  And since `res.ok()` could certainly be used in
  // > production, and it could inadvertently be passed an Error instance, we censor the stack trace
  // > as a simple failsafe.
  if (_.isError(data)) {
    if (!_.isFunction(data.toJSON)) {
      if (process.env.NODE_ENV === 'production') {
        return res.sendStatus(200)
      }
      // No need to JSON stringify (it's already a string).
      return res.send(util.inspect(data))
    }
  }

  // total
  if (data.total || data.total===0 ) {
    return res.json({
      success: true,
      total: data.total,
      data: data.data
    })
  }

  return res.json({
    success: true,
    data: data
  })
}
