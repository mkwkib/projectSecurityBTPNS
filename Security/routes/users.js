var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller')


/* GET users listing. */
router.get('/', function (req, res, next) {
  userController.list(res)
});
router.post('/register', function(req, res, next) {
  userController.register(req, res)
});
router.post('/gettoken', function (req,res,next) {
  userController.gettoken(req,res)
})

module.exports = router;
