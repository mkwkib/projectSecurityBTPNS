var express = require('express');
var router = express.Router();
var rolesController = require('../controllers/role.controller')



/* GET users listing. */
router.get('/', function (req, res, next) {
  rolesController.list(res)
});
router.post('/register', function(req, res, next) {
  rolesController.register(req, res);
});


module.exports = router;
