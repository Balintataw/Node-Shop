const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const { INTEGER } = Sequelize;

class Order extends Sequelize.Model { }
Order.init(
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
  { sequelize, modelName: 'order' }
);

module.exports = Order;