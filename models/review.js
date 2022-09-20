'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.article.belongsTo(models.book)

    }
  }
  review.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    content: DataTypes.STRING,
    bookId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'review',
  });
  return review;
};