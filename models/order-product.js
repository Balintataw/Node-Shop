const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const { INTEGER } = Sequelize;

class OrderProduct extends Sequelize.Model { }
OrderProduct.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  { sequelize, modelName: 'orderProduct' }
);

module.exports = OrderProduct;