'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
      username: {
        type: DataTypes.STRING,
        validate: {
          isUnique: function (value, next) {
            users.findOne({
              where: {username: value},
              attributes: ['username']
            })
              .done(function (err) {
                if (err)
                  return next('Username Sudah Digunakan');
                next();
              });
          }
        }
      },

      password: DataTypes.STRING,

      name: {
        type: DataTypes.STRING,
        validate: {
          is: {
            args:["^[a-z ]+$",'i'],
            msg: "Nama Harus Diisi Dengan Huruf"
          }
        }
      },

      role_id: {
        type: DataTypes.STRING,
        validate:{
          isNumeric: {
            args: true,
            msg: "Role ID Harus Diisi Dengan Angka"
          }
        }
      },

      nik:{
       type: DataTypes.STRING,
       validate:{
         isNumeric:{
           args: true,
           msg: "NIK Harus Diisi Dengan Angka"
         },
         isUniqueNIK: function (value, next) {
           users.findOne({
             where: {nik: value},
             attributes: ['nik']
           })
             .done(function (error) {
               if (error)
                 return next('NIK Sudah Digunakan');
               next();
             })
         }
       }
      }
    },
    {});

  users.associate = function(models) {
    // users.belongsTo(models.roles.role_id, { as: "roles" });
  };
  return users;
};