// pages/foundEdit/foundEdit.js
const db = wx.cloud.database()
let MAX_IMG_LEN = 9
let desc = ''
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    bottom: 0,
    imgData: [],
    selectImgBtn: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = options
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  textareaInput(event){
    let {detail:{value}} = event
    desc = value
    let len = value.length
    let str
    if(len >= 140){
      str = '最大输入140个字'
    }else{
      str = len
    }
    this.setData({
      wordsNum: str
    })
  },
  textareaFocus(event){
    console.log('textareaFocussww', event)
    let {detail:{height}} = event
    this.setData({
      bottom: height + 'px'
    })
  },
  textareaBlur(){
    this.setData({
      bottom: '45rpx'
    })
  },
  selectImg(){
    let max = MAX_IMG_LEN - this.data.imgData.length
    wx.chooseImage({
      count: max,
      sizeType: ['original','compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          imgData: this.data.imgData.concat(res.tempFilePaths)
        })
        max = MAX_IMG_LEN - this.data.imgData.length
        if(max <= 0){
          this.setData({
            selectImgBtn: false
          })
        }
      }
    })
  },
  tapImg(event){
    console.log('tapImg')
    wx.previewImage({
      urls: this.data.imgData,
      current: event.currentTarget.dataset.img
    })
  },
  deleteImg(event){
    let index = event.currentTarget.dataset.index
    this.data.imgData.splice(index, 1)
    let max = this.data.imgData.length
    this.setData({
      imgData: this.data.imgData,
      selectImgBtn: max < 9 ? true : false
    })
  },
  send(){
    if(desc.trim() === ''){
      wx.showToast({
        title: '还没有分享新鲜事儿哦〰',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '正在发布中',
    })
    // 先把图片存入云存储中并且拿到fileid，在拿fileid 存储到数据库中
    let imgData = this.data.imgData
    let promiseAll = []
    for(let i = 0; i < imgData.length; i++){
        let suffix = /\.\w+$/.exec(imgData[i])[0]
        console.log('suffix', suffix)
        let promise = new Promise((resolve, reject) => {
          wx.cloud.uploadFile({
            cloudPath: `blogImg/${Date.now()}-${Math.random() * 1000000}${suffix}`,
            filePath: imgData[i],
            success: res => {
              resolve(res.fileID)
            },
            fail: e => {
              reject(e)
            }
          })
        })
        promiseAll.push(promise)
    }
    Promise.all(promiseAll).then(res =>{
      console.log('promiseall', res)
      db.collection('blog').add({
        data: {
          ...userInfo,
          fileID: res,
          desc,
          creatTime: db.serverDate()
        }
      }).then(res => {
        console.log('db', res)
        wx.hideLoading()
        wx.navigateBack({
          delta: 1
        })
      })
    })
  }
})