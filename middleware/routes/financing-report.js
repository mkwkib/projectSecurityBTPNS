var express = require('express');
var router = express.Router();
var axios = require('axios');
var env = require('dotenv');
env.config();
var financingAPI = process.env.SERVICE_FINANCING;
var reportAPI = process.env.SERVICE_REPORT;

//----------------------------------------REPORT SCHEDULE-----------------------------------
router.put('/pay/:trxId', function (req,res, next) {
  axios.put(financingAPI+'financing_schedule/payment/'+req.params.trxId)
      .then(function (result) {
        res.status(200).json(result.data);
        if (result.status==202)
        {
          listData = [];
          itemData = {trxId:null, accountNo: null, accountName: null, installmentNo: null,
                      plafon: null, postedAmount: null, postedDate: null,postedBy:null, ket: null};
          item =result.data.data;
            itemDataTemp = itemData;
            itemDataTemp.trxId = item.trxId;
            itemDataTemp.accountNo = item.accountId;
            itemDataTemp.accountName = req.body.accountName;
            itemDataTemp.installmentNo = item.installmentNo;
            itemDataTemp.plafon = parseFloat(item.principal)*12;
            itemDataTemp.postedAmount = parseFloat(item.principal)+parseFloat(item.profitShare);
            itemDataTemp.postedDate = item.paymentDate;
            itemDataTemp.postedBy = req.body.nik;
            itemDataTemp.ket = item.paymentStatement;
            listData.push(itemDataTemp);

          axios.post(reportAPI + 'v0.0.1/report/insert', listData)
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
        message: "TIDAK DAPAT MENERIMA DATA"
      })
    });
});

module.exports = router;