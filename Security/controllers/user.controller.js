const bcrypt = require('bcrypt')
const saltRounds = 10
const {roles, users} = require('../models')
const jwt = require('jsonwebtoken')



module.exports = {
  list: function (res) {
    users.findAll()
      .then(function (users) {
        let dataUser = users.map((data) => {
          return {
            username: data.username,
            name: data.name,
            role: data.role_id,
          }
        })
        res.status(200).json({
          status: "BERHASIL",
          data: dataUser
        })
      })
      .catch(function (err) {
        res.status(400).json({
          status: "ERROR",
          message: err.message
        })
      })
  },

  register: function (req, res) {
    var password =req.body.password
    bcrypt.hash(password, saltRounds, function (err, hashPassword) {
        if (!err){
          users.create({
            username: req.body.username,
            role_id: req.body.role_id,
            name: req.body.name,
            password: hashPassword
          })
            .then(function (user) {
              res.status(200).json({
                status: "DATA TELAH DIBUAT",
                data:[{
                  'username': user.username,
                  'name': user.name,
                  'role_id': user.role_id
                }]
              })
            })
            .catch(function (err) {
              res.status(400).json({
                status: "ERROR",
                message: err.message
              })
            })
        }
      }
    )},
  gettoken: function (req, res) {
    console.log("================================", req.body)
    users.findOne({
      where:{
        username: req.body.username
      }
    })
      .then(function (users) {
        if(users){
          password = req.body.password
          bcrypt.compare(password, users.password, function (err, result) {
            var token = jwt.sign({
              id: users.id,
              role_id: users.role_id
            }, process.env.SECRET);
            res.status(200).json({
              message: "Anda Telah Mendapatkan Token",
              token: token
            })
          })
        }else {
          res.status(400).json({
            status: "Tidak Dapat Masuk!",
            messages: "Email atau Password Salah"
          })
        }

      })

  }

}