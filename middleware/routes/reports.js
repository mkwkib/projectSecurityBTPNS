var express = require('express');
var router = express.Router();
var axios = require('axios');
var env = require('dotenv');
env.config();
var reportAPI = process.env.SERVICE_REPORT;
var financingAPI = process.env.SERVICE_FINANCING;



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
router.get('/all', function (req, res, next) {
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
//-----------------------------------------POST REPORT GET BY FINANCING-------------------------------
router.post('/financing/add', function (req,res, next) {
  if(req.body.accountNo && req.body.customerId && req.body.plafon && req.body.disbursementDate) {
    axios.post(financingAPI + 'financingAccont/registration')
      .then(function (result) {
        res.status(200).json({
          status: "200 - OK",
          message: result.data
        });
        axios.get(financingAPI + 'financingAccount/list')
          .then(function (result) {
            if (result.status(200) && result.data.trxId && result.data.accountNo && result.data.accountName && result.data.installmentNo &&
              result.data.plafon && result.data.postedAmount && result.data.postedDate && result.data.postedBy && result.data.ket) {
              axios.post(reportAPI + 'v0.0.1/report/insert', result.data)
                .then(function (dataresult) {
                  res.status(200).json(dataresult.data)
                })
                .catch(function () {
                  res.status(400).json({
                    status: "400 - Bad Request",
                    message: "DATA TIDAK DAPAT DIMASUKKAN"
                  })
                })
            } else res.status(400).json({
              status: "400 - Bad Request",
              message: "DATA TIDAK DITEMUKAN"
            });
          }).catch(function () {
          res.status(400).json({
            status: "400 - Bad Request",
            message: "DATA TIDAK DAPAT DIMASUKKAN"
          })
        });
      }).catch(function () {
      res.status(400).json({
        status: "400 - Bad Request",
        message: "TIDAK DAPAT MENERIMA DATA"
      })

    });
  }
});
module.exports=router;