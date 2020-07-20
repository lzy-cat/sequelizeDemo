const sequelize = require('./config/db.js')
//要导入model下的数据模型，否则无法同步到数据库中
const User = require('./model/user')
const Article = require('./model/article')
//测试连接
sequelize
    .authenticate()
    .then(() => {
        console.log('数据库连接成功');
    })
    .catch(err => {
        console.error('数据库连接失败：', err);
    });

Article.belongsTo(User, {
    foreignKeys: 'userId',
    targetKey: 'id'
})
User.hasMany(Article, {
    foreignKey: 'userId',
    sourceKey: 'id'
})
//同步到数据库

sequelize.sync({
    force: false
})