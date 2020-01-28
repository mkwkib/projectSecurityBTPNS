var express = require('express');
var router = express.Router();
var axios = require('axios');
var env = require('dotenv');
env.config();
var loginAPI = process.env.SERVICE_SECURITY;
let jwt = require('jsonwebtoken');
/* GET users listing. */

async function authAdmin(req, res, next) {
  try {
    let token = req.headers.authorization;
    jwt.verify(token, process.env.ADMIN, (err) => {
      if (err) {
        res.status(400).json({
          status: 'Invalid Token',
          message: 'Token Salah atau Telah Kdaluarsa'
        })
      }
    })
  } catch (err) {
    return next(err)
  }
  next();
}
//-----------------------------------------GET TOKEN-------------------------------
router.post('/login', function(req, res, next) {
  if(req.body.username && req.body.password){
    axios.post(loginAPI+'users/gettoken', req.body)
      .then(function (result) {
        res.status(200).json(result.data)
      })
      .catch(function () {
        res.status(400).json({
          status: "400 - Bad Request",
          message: "Username atau Password Salah"
        })
      })
  } else res.status(400).json({
    status: "400 - Bad Request",
    message: "Tidak Dapat Menghubungi Server"
  })
});
//-----------------------------------------REGISTER USER-------------------------------
router.post('/register',authAdmin, function(req, res, next) {
  if(req.body.username && req.body.password && req.body.role_id && req.body.name){
    axios.post(loginAPI+'users/register', req.body)
      .then(function (result) {
        res.status(200).json({
          status: "200",
          message: result.data
        })
      })
      .catch(function () {
        res.status(400).json({
          status: "400 - Bad Request",
          message: "Username Sudah Digunakan"
        })
      })
  } else res.status(400).json({
    status: "400 - Bad Request",
    message: "Tidak Dapat Menghubungi Server"
  })
});

module.exports = router;
