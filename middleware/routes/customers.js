var express = require('express');
var router = express.Router();
var axios = require('axios');
var env = require('dotenv');
env.config();
var customerAPI = process.env.SERVICE_CUSTOMER;
var jwt = require('jsonwebtoken');

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

//-----------------------------------------INPUT CUSTOMER-------------------------------
router.post('/register', function (req, res, next) {
  if(req.body.name && req.body.email && req.body.phone && req.body.address && req.body.customer_nik){
    axios.post(customerAPI+'customer', req.body)
      .then(function (result) {
        res.status(200).json(result.data)
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
  page = 0;
  if (req.query.page) {req.query.page}
  axios.get(customerAPI+'customers?page='+req.query.page)
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
//-----------------------------------------GET CUSTOMER BY NIK-------------------------------
router.get('/:nik',function (req, res, next) {
  axios.get(customerAPI+'customer/nik/'+req.params.nik)
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
//-----------------------------------------UPDATE CUSTOMER BY NIK-------------------------------
router.put('/edit/:idcustomer', function (req, res, next) {
  if(req.body.name && req.body.email && req.body.phone && req.body.address && req.body.customer_nik){
    axios.put(customerAPI+'customer/'+req.params.idcustomer, req.body)
      .then(function (result) {
        res.status(200).json(result.data)
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
//-----------------------------------------GET CUSTOMER BY NAME-------------------------------
router.get('/:name',function (req, res, next) {
  axios.get(customerAPI+'customer/name/'+req.params.name)
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