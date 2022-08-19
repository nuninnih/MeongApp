'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.belongsTo(models.User, {foreignKey: 'UserId'})
    }

    formatBirthDate(){
      return new Date(this.dateOfBirth).toISOString().split('T')[0]
    }
  }
  Profile.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notEmpty: {
          msg : 'Name cannot be empty'
        },
        notNull : {
          msg : 'Name cannot be null'
        }
      }
    },
    gender: DataTypes.STRING,
    location: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};