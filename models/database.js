const Sequelize = require('sequelize');
const database = new Sequelize('nairu', '', '', {
    dialect: 'mysql',
    host: 'localhost',
    collate: 'utf8_unicode_ci',
    define: {
        timestamps: false
    }
})

module.exports = database;