var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app.js');
var assert = chai.assert;
var models =require('../models');
var jwt = require('jsonwebtoken');

chai.use(chaiHttp);
var requester = chai.request(app).keepOpen()

var token = ''
var userId = ''

describe('users', function () {
  //hooks untuk dummy
  beforeEach(function (done) {
    models.users.destroy({
      where: {}
    }).then(function () {
      models.users.create({
        role_id: '1',
        username: 'dummy',
        password: 'dummy',
        name: 'dummy name',
        nik: '1234'

      })
        //generate token
        .then(function (user) {
          userId = user.id
          token = jwt.sign({
            id: user.id,
            role_id: user.role_id
          }, process.env.ADMIN);

          done()
        })
    })
  })

  describe('GET /users', function () {
    it('will return all user data', function (done) {
      requester
        .get('/users')
        .set("authorization", token)
        .end(function (err, res) {
          //check res status
          assert.equal(res.status, 200)
          //check tipe data
          assert.typeOf(res.body, 'array')
          //expect properties
          assert.property(res.body[0], 'role_id')
          assert.property(res.body[0], 'username')
          assert.property(res.body[0], 'password')
          assert.property(res.body[0], 'name')
          assert.property(res.body[0], 'nik')
          //expect isi
          assert.equal(res.body[0].username, 'dummy')
          assert.equal(res.body[0].password, 'dummy')
          assert.equal(res.body[0].name, 'dummy name')
          assert.equal(res.body[0].nik, '1234')

          done()
        })
    })
  })





})