const bcrypt = require('bcrypt')
const saltRounds = 10
const {roles, users} = require('../models')



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
}