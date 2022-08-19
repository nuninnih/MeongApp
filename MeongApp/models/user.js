'use strict';
const {
  Model
} = require('sequelize');

const {encrypt} = require('../helpers/helper')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, {foreignKey : 'UserId'})
      User.hasMany(models.Post, {foreignKey: 'UserId'})

    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        isEmail: true,
        notEmpty: {
          msg : 'Username cannot be empty'
        },
        notNull : {
          msg : 'Username cannot be null'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      unique : {
        msg : 'Username has been used. Choose another one'
      },
      allowNull: false,
      validate : {
        notEmpty: {
          msg : 'Username cannot be empty'
        },
        notNull : {
          msg : 'Username cannot be null'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: {
          msg : 'Only number allowed'
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      allowNull: false,
      validate : {
        notEmpty: {
          msg : 'Password cannot be empty'
        },
        notNull : {
          msg : 'Password cannot be null'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(user => {
    user.password = encrypt(user.password)
  })

  return User;
};