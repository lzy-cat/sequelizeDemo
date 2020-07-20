const router = require('koa-router')()

//引入模型
const User = require('../model/user')
const Article = require('../model/article')
const  Sequelize = require('sequelize')
const Op = Sequelize.Op

router.prefix('/users')

/**
 * 用于测试hooks
 */
router.get('/', function (ctx, next) {

  User.create({
    userName: 'zs',
    age: 10
  }).then((result => {
    ctx.body = 'ok'
}))
ctx.body = 'OK'
})

/**
 * 条件分页查询
 */
router.get('/UserList', async (ctx) => {
  //获取查询条件
  let searchParams = ctx.request.query
/*   Article.belongsTo(User, {
      foreignKeys: 'userId',
      targetKey: 'id'
  })
  User.hasMany(Article, {
      foreignKey: 'userId',
      sourceKey: 'id'
  }) */
  await User.findAndCountAll({
       include: [
          {
              model: Article
          }
      ], 
      where: {
          userName: {
              [Op.iLike]: '%' + searchParams.userName + '%'
          }
      },
      //过滤掉前几页数据
      offset: (searchParams.currentPage - 1) * searchParams.size,
      limit: searchParams.size
  }).then(result => {
      ctx.body = {
          code: 200,
          msg: '查询成功',
          data: result.rows
      }
  }).catch(err => {
      ctx.body = {
          code: 500,
          msg: '查询失敗',
          data: err
      }
  })
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
