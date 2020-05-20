const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', 'qwe@123',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;