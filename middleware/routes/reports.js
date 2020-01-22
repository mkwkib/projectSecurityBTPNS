var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var axios = require('axios')
var env = require('dotenv')
env.config()
var reportAPI = process.env.SERVICE_REPORT

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
          message: "Data Berhasil Ditambahkan"
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
})
//-----------------------------------------GET REPORT ALL-------------------------------
router.get('/all',function (req, res, next) {
  axios.get(reportAPI+'v0.0.1/report/all')
    .then(function (result) {
      res.status(200).json(result.data)
    })
    .catch(function (err) {
      res.status(400).json({
        status: "400 - Bad Request",
        message: "DATA TIDAK DITEMUKAN"
      })
    })
})
//-----------------------------------------GET REPORT POSTED BY ALL-------------------------------
router.get('/by_co/all',function (req, res, next) {
  axios.get(reportAPI+'v0.0.1/report/postby')
    .then(function (result) {
      res.status(200).json(result.data)
    })
    .catch(function (err) {
      res.status(400).json({
        status: "400 - Bad Request",
        message: "DATA TIDAK DITEMUKAN"
      })
    })
})
//-----------------------------------------GET REPORT POSTED BY CO-------------------------------\
router.get('/by_co/:coNumber',function (req, res, next) {
  axios.get(reportAPI+'v0.0.1/report/postby/'+req.params.coNumber)
    .then(function (result) {
      res.status(200).json(result.data)
    })
    .catch(function (err) {
      res.status(400).json({
        status: "400 - Bad Request",
        message: "DATA TIDAK DITEMUKAN"
      })
    })
})
//-----------------------------------------GET REPORT POSTED BY NASABAH-------------------------------
router.get('/by_account/:accountNumber',function (req, res, next) {
  axios.get(reportAPI+'v0.0.1/report/acno/'+req.params.accountNumber)
    .then(function (result) {
      res.status(200).json(result.data)
    })
    .catch(function (err) {
      res.status(400).json({
        status: "400 - Bad Request",
        message: "DATA TIDAK DITEMUKAN"
      })
    })
})
module.exports=router