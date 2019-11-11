const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const { INTEGER } = Sequelize;

class CartProduct extends Sequelize.Model { }
CartProduct.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    quantity: {
      type: INTEGER
    }
  },
  { sequelize, modelName: 'cartProduct' }
);

module.exports = CartProduct;