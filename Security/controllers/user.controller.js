const bcrypt = require('bcrypt');
const saltRounds = 10;
const {roles, users} = require('../models');
const jwt = require('jsonwebtoken');



module.exports = {
  list: function (res) {
    users.findAll()
      .then(function (users) {
        let dataUser = users.map((data) => {
          return {
            username: data.username,
            nik: data.nik,
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
    var password = req.body.password
    bcrypt.hash(password, saltRounds, function (err, hashPassword) {
        if (!err) {
          users.create({
            username: req.body.username,
            role_id: req.body.role_id,
            nik: req.body.nik,
            name: req.body.name,
            password: hashPassword
          })
            .then(function (user) {
              res.status(200).json({
                status: "DATA TELAH DIBUAT",
                data: [{
                  'NIK': user.nik,
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
    )
  },

  gettoken: function (req, res, next) {
    try {
      users.findOne({
        where: {
          username: req.body.username
        }
      })
        .then(function (users) {
          if (users) {
            password = req.body.password
            bcrypt.compare(password, users.password, function (err, result) {
              if (result) {
                let secret = process.env.ADMIN
                if(users.role_id==2)
                {secret = process.env.CO}
                var token = jwt.sign({
                  id: users.id,
                  name: users.name,
                  role_id: users.role_id,
                  nik: users.nik
                }, secret.trim(),{ expiresIn: '12h' });
                res.status(200).json({
                  message: "sukses",
                  token: token
                })
              } else {
                res.status(400).json({
                  status: "Tidak Dapat Masuk!",
                  messages: "Email atau Password Salah"
                })
              }
            })
          }else {
            res.status(400).json({
              status: "Tidak Dapat Masuk!",
              messages: "Password Salah"
            })
          }
        })
    } catch (err) {
      return res.status(400).json({
        status: "Tidak Dapat Masuk!",
        messages: "Email Tidak Terdaftar"
      })
    }
  }
}