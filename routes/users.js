const router = require('koa-router')()

//引入模型
const User = require('../model/user')
const Article = require('../model/article')
const Sequelize = require('sequelize')
const sequelize = require('../config/db')
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
        include: [{
            model: Article
        }],
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

router.get('/bar', async function (ctx, next) {

    const {
        client
    } = ctx
    let query_str = ctx.query.query_str
    let querystr = {
        index: 'article',
        type: 'article',
        // from: page * size,
        // size: size,
        body: {
            //只返回name和value字段
            _source: [
                 "content"
            ],
            query: {
                bool: {
                    must: {
                        multi_match: { //匹配name和value
                            query: query_str,
                            fields: [ "content"]
                        }
                    }
                }
            },
            "highlight": {
                "fields": {
                    "content": {}
                }
            }
        }

    };
    const res = await client
        .search(querystr)

    ctx.body = res.hits

})
/**
 * sequelize事物
 */
router.get('/shiwu',async (ctx)=>{
  //启用事务(自动提交)
  return sequelize.transaction(function (t) {
      //创建记录成功后，并把它修改为‘李四’
    return User.create({
        userName: '黄晓明',
        age: 20
    }, {
            transaction: t
        }).then(result => {
            console.log(result)
            return User.update({
                userName: '李四',
            }, {
                    where: { id: result.id },
                    transaction: t  //注意（事务transaction 须和where同级）second parameter is "options", so transaction must be in it
                })
        })
}).then(result => {
    // Transaction 会自动提交
    // result 是事务回调中使用promise链中执行结果
    // console.log(result.length)
    console.log("提交ok")
}).catch(err => {
    // Transaction 会自动回滚
    // err 是事务回调中使用promise链中的异常结果
    console.log("回滚"+err)
})
})

module.exports = router