var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var axios = require('axios')

/* GET users listing. */

async function addToken(req,res,next) {
  try {
    let token = req.headers.authorization;
    jwt.verify(token, process.env.SECRET, (err) => {
      if (err) {
        res.status(400).json({
          status: 'Invalid Token',
          message: 'Token Salah atau Token Telah Berubah'
        })
      }
    })
  }
  catch (err){
    return next(err)
  }
      next()
}


router.post('/login', function(req, res, next) {
  if(req.body.username && req.body.password){
    axios.post('http://localhost:3001/users/gettoken', req.body)
      .then(function (result) {
        res.status(200).json({
          status: "Berhasil",
          message: "Anda Berhasil Mendapatkan Token"
        })
      })
      .catch(function (err) {
        res.status(400).json(err)
      })
  } else res.sendStatus(404)
});

module.exports = router;
