var express = require('express');
var router = express.Router();
var axios = require('axios');
var env = require('dotenv');
env.config();
var employeeAPI = process.env.SERVICE_EMPLOYEE;
var jwt = require('jsonwebtoken')

async function authAdmin(req, res, next) {
  try {
    let token = req.headers.authorization;
    jwt.verify(token, process.env.ADMIN, (err) => {
      if (err) {
        console.log(token)
        res.status(400).json({
          status: 'Invalid Token',
          message: 'Token Salah atau Token Telah Berubah'
        })
      }
    })
  } catch (err) {
    return next(err)
  }
  next();
}
async function authCO(req, res, next) {
  try {
    let token = req.headers.authorization;
    jwt.verify(token, process.env.CO, (err) => {
      if (err) {
        res.status(400).json({
          status: 'Invalid Token',
          message: 'Token Salah atau Token Telah Berubah'
        })
      }
    })
  } catch (err) {
    return next(err)
  }
  next();
}

module.exports =router;
//-------------------------------GET ALL EMPLOYEE-------------------------------
router.get('/all',authAdmin,function (req, res, next) {
  axios.get(employeeAPI+'employee/all')
    .then(function (result) {
      res.status(200).json(result.data)
    })
    .catch(function () {
      res.status(400).json({
        status: "400 - Bad Request",
        message: "DATA TIDAK DITEMUKAN"
      })
    })
});
//-------------------------------REGISTER EMPLOYEE-------------------------------
router.post('/register',authAdmin, function(req, res, next) {
  if(req.body.nik && req.body.name && req.body.email && req.body.address){
    axios.post(employeeAPI+'employee/register', req.body)
      .then(function (result) {
        res.status(200).json({
          status: "200 - OK",
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
