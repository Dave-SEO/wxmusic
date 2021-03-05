// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const got = require('got');
cloud.init()
const playlistCollection = cloud.database().collection('playlist')
const BASE_URL = 'https://dave.myzhangning.top'
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  app.router('PlayRouter', async (ctx, next) => {
    ctx.body = await playlistCollection.skip(event.start)
              .limit(event.count)
              .get()
              .then(res => {
                return {
                  ...res,
                  start: event.start,
                  count: event.count
                }
              })
    next()
  })
 
  app.router('PlayListRouter', async (ctx, next) => {
    const {body} = await got(`${BASE_URL}/playlist/detail?id=${event.playlistid}`);
    const bodyResult = JSON.parse(body)
    ctx.body = bodyResult
    next()
  })
  app.router('musicUrl', async (ctx, next) => {
    const {body} = await got(`${BASE_URL}/song/url?id=${event.id}`)
    const bodyResult = JSON.parse(body)
    ctx.body = bodyResult
    next()
  })
  app.router('lyric', async (ctx, next) => {
    const {body} = await got(`${BASE_URL}/lyric?id=${event.id}`)
    const bodyResult = JSON.parse(body)
    ctx.body = bodyResult
    next()
  })
  return app.serve()
}