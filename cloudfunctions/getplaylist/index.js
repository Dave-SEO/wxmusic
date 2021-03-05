// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got');
cloud.init()
const db = cloud.database()
const playlistCollection = db.collection('playlist')
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  // 优化数据获取，小程序限制单次获取 20 条，云函数限制调用次数 100 条
  const countResult = await playlistCollection.count()
  const total = countResult.total
  //  计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
 // 承载所有读操作的 promise 的数组
  const tasks = []
  let list = {}
  // 需要从数据库循环取出的次数
  for(let i = 0; i < batchTimes; i++){
      let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
  }
  // 拿到数据库所有数据
  list = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.concat(cur)
    }
  })

  const {body} = await got('https://dave.myzhangning.top/personalized');
  const {code, result} = JSON.parse(body)
  const arrData = [] 
  for(let i = 0; i < result.length; i++){
    let flag = true
    for(let j = 0; j < list.data.length; j++){
        if(result[i].id === list.data[j].id ){
          flag = false
          break;
        }
    }
    if(flag){
      arrData.push(result[i])
    }
  }
  if(code === 200 && arrData.length > 0){
     await db.collection('playlist').add({
        data: [
          ...arrData
        ]
      }).then(res => {
        console.log('插入成功')
      }).catch(e => {
        console.log('插入失败')
      })
  }
  return {
    newData: JSON.stringify(arrData),
    newNum: arrData.length
  }
}