var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var axios = require('axios').default

/* GET users listing. */
const App = express()


App.use(function (req,res,next) {
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
})

router.get('/login', function(req, res, next) {
  axios.get('localhost:3001/login')
    .then(function (res, req, next) {

    })
});

module.exports = router;
