const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const { INTEGER, STRING, DOUBLE } = Sequelize;

class Product extends Sequelize.Model { }
Product.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: STRING,
      allowNull: false,
    },
    price: {
      type: DOUBLE,
      allowNull: false,
    },
    imageUri: {
      type: STRING,
      allowNull: false,
    },
    description: {
      type: STRING,
      allowNull: false,
    }
  },
  {
    sequelize, modelName: 'product'
  }
);

module.exports = Product;