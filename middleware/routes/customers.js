var express = require('express');
var router = express.Router();
var axios = require('axios');
var env = require('dotenv');
env.config();
var customerAPI = process.env.SERVICE_CUSTOMER;

//-----------------------------------------INPUT CUSTOMER-------------------------------
router.post('/add', function (req, res, next) {
  if(req.body.name && req.body.email && req.body.phone && req.body.address && req.body.customer_nik){
    axios.post(customerAPI+'customers', req.body)
      .then(function (result) {
        res.status(200).json({
          status: "200 - OK",
          message: result.data
        })
      })
      .catch(function () {
        res.status(400).json({
          status: "400 - Bad Request",
          message: "Data yang Anda Masukkan Salah"
        })
      })
  } else res.status(400).json({
    status: "400 - Bad Request",
    message: "Tidak Dapat Menghubungi Server"
  })
});
//-----------------------------------------GET CUSTOMER-------------------------------
router.get('/all',function (req, res, next) {
  axios.get(customerAPI+'customer')
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
module.exports=router;