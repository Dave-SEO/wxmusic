import formateTime from '../../utils/formateTime.js'
// pages/myblog/myblog.js
import formatTime from '../../utils/formateTime.js'
const db = wx.cloud.database()
const MAX_LENGTH = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this._getLoader()
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
  _getLoader(){
    let num = this.data.blog.length
    db.collection('blog').skip(num)
        .limit(MAX_LENGTH).orderBy('creatTime', 'desc')
        .get()
        .then(res => {
          let result = res.data
          result.forEach(item => {
            console.log('22222',typeof item.creatTime)
            item.creatTime = new Date(item.creatTime).toString()
          })
          this.setData({
            blog: result
          })
        })
  }
})