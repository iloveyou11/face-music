import formatTime from '../../utils/time.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    blog:{},
    commentList:[],
    blogId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      blogId: options.blogId
    })
    this._getBlogDetail()
  },

  _getBlogDetail(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        blogId:this.data.blogId,
        $url:'detail'
      }
    }).then(res=>{
      // 先将时间数据格式化
      let commentList = res.result.commentList.data
      for(let i=0,len=commentList.length;i<len;i++){
        commentList[i].createTime = formatTime(new Date(commentList[i].createTime))
      }

      wx.hideLoading()
      this.setData({
        commentList,
        blog:res.result.detail[0],
      })
    })
  },

  onShareAppMessage(e) {
    let blog = this.data.blog
    return {
      title: blog.content,
      path: `/pages/comment/comment?blogId=${blog._id}`
    }
  }

})