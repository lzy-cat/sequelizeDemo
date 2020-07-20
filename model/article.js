const Sequelize = require('sequelize')
const sequelize = require('../config/db.js')

const Article = sequelize.define('article',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    content:{
        type: Sequelize.STRING,
    },
    userId:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
},{
    timestamps:true
})

module.exports = Article