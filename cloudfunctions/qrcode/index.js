// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await cloud.openapi.wxacode.getUnlimited({
    scene: 'a=1'
  })
  const upload = await cloud.uploadFile({
    cloudPath: 'qrcode/' + Date.now() + '-' + Math.random() + '.jpg',
    fileContent: result.buffer
  })
  console.log('upload', upload)
  return upload.fileID
}