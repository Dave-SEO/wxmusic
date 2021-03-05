// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got')
cloud.init()
const db = cloud.database()
let tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx219338aa01a16cf3&secret=f83a3fdc3104d9fbbfdb3c699ef3199a`
// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  const {body} = await got(tokenUrl)
  const bodyResult = JSON.parse(body)
  console.log('event.content', event.content)
  const result = await cloud.openapi.subscribeMessage.send({
    touser: OPENID,
    page: 'page/page/index',
    lang: 'zh_CN',
    data: {
        thing1: {
          value: '评价完成'
        },
        thing3: {
          value: event.content
        },
        date4: {
          value: "2020-01-01 12:00:00"
        }
    },
    templateId: '_RzZsTXQhulADai9uPdG_EMUY59ziZsk4tZH2uo8_js',
    access_token: bodyResult
  })
  return result
}