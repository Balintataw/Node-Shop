const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const { INTEGER, STRING } = Sequelize;

class User extends Sequelize.Model { }
User.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: STRING,
      allowNull: false,
    },
    email: {
      type: STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: 'user' }
);

module.exports = User;