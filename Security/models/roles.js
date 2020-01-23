'use strict';
module.exports = (sequelize, DataTypes) => {
  const roles = sequelize.define('roles', {
      role_id: {
        type: DataTypes.STRING,
        validate: {
          isNumeric: {
            args: true,
            msg: "Role ID Harus Diisi Dengan Angka"
          }
        }
      },

      code: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [['AD', 'CO']],
            msg: "Code Harus Diisi Dengan AD / CO"
          }
        }
      },

      name: {
        type: DataTypes.STRING,
        validate: {
          is: {
            args: ["^[a-z ]+$", 'i'],
            msg: "Nama Harus Diisi Dengan Huruf"
          }
        }},

      description: DataTypes.STRING
    },
    {});

  roles.beforeValidate((roles, option) =>{
    roles.code = roles.code.toUpperCase()
    return roles
  });

  roles.associate = function(models) {
    // roles.hasMany(models.users.role_id, {  as: "users" });
  };
  return roles;
};