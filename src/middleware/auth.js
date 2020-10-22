const jwt = require('jsonwebtoken')
const helper = require('../helper/index')

module.exports = {
  authorization: (req, res, next) => {
    let token = req.header.authorization
    if(token) {
      token = token.split(' ')[1];
      jwt.verify(token, process.env.JWT_KEY, (err, data) => {
        if (err && err.name === "JsonWebTokenError")  (err && err.name === "TokenExpiredError") {
          return helper.response(res, 403, err.message)
        } else {
          req.token = data;
          next();
        }
      })
    } else {
      return helper.response(res, 400, 'PLEASE LOGIN FIRST!')
    }
  },
};