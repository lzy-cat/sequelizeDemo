 const Sequelize = require('sequelize')
const sequelize = require('../config/db.js')

const DataTypes = Sequelize.DataTypes

//定义模型User,我使用define定义模型，也可以使用init，(define的内部其实调用了init)
const User = sequelize.define(
    //表名
    'user',
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userName: {
            type: DataTypes.STRING(128),
        },
        age:{
          type: DataTypes.INTEGER
        }
    }
) 

module.exports = User

