'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static sortPostBy(sort){
      let options = '';
      if(sort){
        options = {
          order: [['like', 'DESC']],
          include : [{
              model: User,
              include : [{
                  model: Profile
              }]
          }]
        }
      }else{
        options = {
          order: [['createdAt', 'DESC']],
          include : [{
              model: User,
              include : [{
                  model: Profile
              }]
          }]
        }
      }

      return Post.findAll(options)
    }

    static associate(models) {
      Post.belongsTo(models.User, {foreignKey: 'UserId'})
    }
  }
  Post.init({
    post: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notEmpty: {
          msg : 'Post cannot be empty'
        },
        notNull : {
          msg : 'Post cannot be null'
        }
      }
    },
    like: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    loc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};