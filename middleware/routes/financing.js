var express = require('express');
var router = express.Router();
var axios = require('axios');
var env = require('dotenv');
env.config();
var financingAPI = process.env.SERVICE_FINANCING;
var jwt = require('jsonwebtoken')

async function authCO(req, res, next) {
  try {
    let token = req.headers.authorization;
    jwt.verify(token, process.env.CO, (err) => {
      if (err) {
        res.status(400).json({
          status: 'Invalid Token',
          message: 'Token Salah atau Telah Kadaluarsa'
        })
      }
    })
  } catch (err) {
    return next(err)
  }
  next();
}

//-----------------------------------------GET LIST ACCOUNT ALL-------------------------------
router.get('/account/all',function (req, res, next) {
  axios.get(financingAPI+'financing_account/list')
    .then(function (result) {
      res.status(200).json(result.data)
    })
    .catch(function () {
      res.status(400).json({
        status: "400 - Bad Request",
        message: "Data yang Anda Masukkan Salah"
      })
    })
});
//-----------------------------------------ADD LIST ACCOUNT-------------------------------
router.post('/account/input',authCO, function (req, res, next) {
  if(req.body.customerId && req.body.plafon && req.body.disbursementDate){
    axios.post(financingAPI+'financing_account/registration', req.body)
      .then(function (result) {
        res.status(200).json({
          status: "200 - OK",
          message: result.data
        })
      })
      .catch(function (err) {
        res.status(400).json({
          status: "400 - Bad Request",
          message: "Data yang Anda Masukkan Salah",
          data: err
        })
      })
  } else res.status(400).json({
    status: "400 - Bad Request",
    message: "Tidak Dapat Menghubungi Server"
  })
});
//-----------------------------GET Financing Account By Id---------------------------------
router.get('/account/:accountNumber',function (req, res, next) {
  axios.get(financingAPI+'financing_account/'+req.params.accountNumber)
    .then(function (result) {
      res.status(200).json(result.data)
    })
    .catch(function () {
      res.status(400).json({
        status: "400 - Bad Request",
        message: "Data yang Anda Masukkan Salah"
      })
    })
});
//-----------------------------PUT Financing Payment by trxId---------------------------------
router.put('/schedule/:trxId', function (req, res, next) {
    axios.put(financingAPI+'financing_schedule/payment/'+req.params.trxId)
      .then(function (result) {
        res.status(200).json(result.data)
      })
      .catch(function () {
        res.status(409).json({
          status: "409 - Conflict",
          message: "Data yang Anda Masukkan Salah"
        })
      })
});

module.exports = router;

