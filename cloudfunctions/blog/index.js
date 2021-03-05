// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})
  app.router('blog-card', async (ctx, next) => {
    let  w = {}
    if(event.keword.trim() !== ''){
      w = {
        desc: db.RegExp({
          regexp: event.keword,
          options: 'i'
        })
      }
    }
    const {data} = await db.collection('blog')
      .where(w)
      .skip(event.start)
      .limit(event.num)
      .orderBy('creatTime', 'desc')
      .get()
      ctx.body = data
      next()
  })
  return app.serve()
}