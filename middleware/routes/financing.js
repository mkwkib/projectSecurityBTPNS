var express = require('express');
var router = express.Router();
var axios = require('axios');
var env = require('dotenv');
env.config();
var financingAPI = process.env.SERVICE_FINANCING;
//-----------------------------------------GET LIST ACCOUNT ALL-------------------------------
router.get('/account/all',function (req, res, next) {
  axios.get(financingAPI+'financingAccount/list')
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
router.post('/account/input', function (req, res, next) {
  if(req.body.accountNo && req.body.customerId && req.body.plafon && req.body.disbursementDate){
    axios.post(financingAPI+'financingAccount/registration', req.body)
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
module.exports = router;

