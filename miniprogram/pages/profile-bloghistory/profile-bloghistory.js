const MAX_LIMIT=10

Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getBlogByOpenid()
  },

  _getBlogByOpenid(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        $url:'getBlogByOpenid',
        start: this.data.blogList.length,
        count:MAX_LIMIT
      }
    }).then(res=>{
      wx.hideLoading()
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getBlogByOpenid()
  },

  goComment(e){
    wx.navigateTo({
      url: `../comment/comment?blogId=${e.target.dataset.blogid}`,
    })
  },

  onShareAppMessage(e){
    const blog=e.target.dataset.blog
    return {
      title:blog.content,
      path:`/pages/comment/comment?blogId=${blog._id}`
    }
  }
})