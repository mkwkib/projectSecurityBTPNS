var express = require('express');
var router = express.Router();
var axios = require('axios');
var env = require('dotenv');
env.config();
var reportAPI = process.env.SERVICE_REPORT;
var financingAPI = process.env.SERVICE_FINANCING;
var jwt = require('jsonwebtoken');

async function authAdmin(req, res, next) {
  try {
    let token = req.headers.authorization;
    jwt.verify(token, process.env.ADMIN, (err) => {
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
//-----------------------------------------INPUT REPORT-------------------------------
router.post('/report/input', function (req, res, next) {
  if(
    req.body.trxId && req.body.accountNo && req.body.accountName && req.body.installmentNo &&
    req.body.plafon && req.body.postedAmount && req.body.postedDate && req.body.postedBy && req.body.ket
  ){
    axios.post(reportAPI+'v0.0.1/report/insert', req.body)
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
//-----------------------------------------GET REPORT ALL-------------------------------
router.get('/all',authAdmin, function (req, res, next) {
  page = 1;
  if (req.query.page) {page = req.query.page}
  axios.get(reportAPI+'v0.0.1/report/all?page='+page)
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
//-----------------------------------------GET REPORT POSTED BY CO ALL-------------------------------
router.get('/by_co/all',function (req, res, next) {
  axios.get(reportAPI+'v0.0.1/report/postby')
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
//-----------------------------------------GET REPORT POSTED BY CO-------------------------------
router.get('/by_co/:coNumber',function (req, res, next) {
  axios.get(reportAPI+'v0.0.1/report/postby/'+req.params.coNumber)
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
//-----------------------------------------GET REPORT POSTED BY NASABAH-------------------------------
router.get('/by_account/:accountNumber',function (req, res, next) {
  axios.get(reportAPI+'v0.0.1/report/acno/'+req.params.accountNumber)
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
//-----------------------------------------GET NASABAH BY CO-------------------------------
router.get('/customers/:accountNumber',function (req, res, next) {
  axios.get(reportAPI+'v0.0.1/report/customers/'+req.params.accountNumber)
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
//-----------------------------------------GET NASABAH BY KET-------------------------------
router.get('/:ket',function (req, res, next) {
  page = 1;
  if (req.query.page) {req.query.page}
  axios.get(reportAPI+'v0.0.1/report/ket/'+req.params.ket+'?page='+req.query.page)
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