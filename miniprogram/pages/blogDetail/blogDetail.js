
import formateTime from '../../utils/formateTime.js'
// pages/blogDetail/blogDetail.js
import fomateTime from '../../utils/formateTime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogId: '',
    detail: {},
    comments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      blogId: options.id
    })
    this._getdetail()
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
  onCommentSuccess(){
    this._getdetail()
  },
  _getdetail(){
    console.log('_getdetail')
    
    wx.cloud.callFunction({
      name: 'blogDetail',
      data: {
        blogId: this.data.blogId,
        $url: 'detail'
      },
      success: res => {
        let comments = res.result.comments.data
        comments.forEach(item => {
          item.createTime = formateTime(new Date(item.createTime))
        })
        this.setData({
          comments,
          detail: res.result.detail
        })
        console.log('res', res)
      }
    })
  }
})