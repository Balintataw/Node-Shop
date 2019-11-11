const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const { INTEGER } = Sequelize;

class Cart extends Sequelize.Model { }
Cart.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  { sequelize, modelName: 'cart' }
);

module.exports = Cart;