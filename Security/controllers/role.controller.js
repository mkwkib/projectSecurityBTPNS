const {roles, users} = require('../models')



module.exports = {
  list: function (res) {
    roles.findAll()
      .then(function (roles) {
        let dataRole = roles.map((data) => {
          return {
            code: data.code,
            name: data.name,
            description: data.description
          }
        })
        res.status(200).json({
          status: "BERHASIL",
          data: dataRole
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
          roles.create({
            role_id: req.body.role_id,
            code: req.body.code,
            name: req.body.name,
            description: req.body.description
          })
            .then(function (role) {
              res.status(200).json({
                status: "DATA TELAH DIBUAT",
                data:[{
                  'role_id': role.role_id,
                  'code': role.code,
                  'name': role.name,
                  'description': role.description
                }]
              })
            })
            .catch(function (err) {
              res.status(400).json({
                status: "ERROR",
                message: err.message
              })
            })
  },
}