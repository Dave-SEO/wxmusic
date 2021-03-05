// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init()
const db = cloud.database()
const MAX_LENGTH = 100
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({event})
  app.router('detail', async (ctx, next) => {
    // 获取博客详情
    let result = await db.collection('blog')
                .where({
                  _id: event.blogId
                }).get()
              // 获取博客评论
    let collectionComments = await db.collection('blog-comments')
     let count = await collectionComments.count()
     let total = count.total
     let num = Math.ceil(total / MAX_LENGTH)
     let promiseAll = []
     console.log('event.blogId', event.blogId)
    for(let i = 0; i < num; i++){
         let promise = collectionComments.skip(i * MAX_LENGTH).limit(MAX_LENGTH)
            .where({
              blogId: event.blogId
            })
            .orderBy('creatTime', 'desc').get()

            promiseAll.push(promise)
    }
    console.log('promiseAll', promiseAll)
      let comments = (await Promise.all(promiseAll)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
     console.log('result', result.data[0])
     console.log('comments', comments)
     ctx.body = {
        detail:result.data[0],
        comments
     }
     next()
  })
  return app.serve()
}