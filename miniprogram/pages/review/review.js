let keywords=''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制底部弹出层是否显示
    modalShow:false,
    blogList:[]
  },

  // 加载博客列表数据
  onLoad: function (options) {
    this._loadBlogList()
  },

  // 需要支持start起始条、keywords关键字模糊搜索
  _loadBlogList(start=0){
    wx.showLoading({
      title: '拼命加载中……',
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        start,
        count: 10,
        keywords,
        $url:'list'
      }
    }).then(res=>{
        if(res.result.length===0){
          wx.showToast({
            title: '没有更多数据了',
          })
          wx.hideLoading()
          wx.stopPullDownRefresh()
          return
        }
        this.setData({
          blogList:this.data.blogList.concat(res.result)
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
    })
  },

  options:{
    styleIsolation:'apply-shared'
  },
  
  // 发布
  publish(){
    // 先判断用户是否授权
    wx.getSetting({
      success:(res)=>{
        // console.log(res)
        // console.log(res.authSetting['scope.userInfo'])
        if (res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success:(res)=>{
              // console.log(res)
              // 如果用户已授权，则直接跳转到博客书写页面
              this.loginSuccess({
                detail:res.userInfo
              })
            }
          })
        }else{
          this.setData({
            modalShow:true
          })
        }
      }
    })
    
    this.setData({
      modalShow:true
    })
  },

  loginSuccess(e){
    // console.log(e)
    const detail=e.detail
    wx.navigateTo({
      url: `../review-edit/review-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })

  },
  loginFail(){
    wx.showModal({
      title: '授权用户才能发布博客',
      content: '',
    })
  },

  onReachBottom(){
    this._loadBlogList(this.data.blogList.length)
  },

  onPullDownRefresh(){
    // 清空列表再拉取数据
    this.setData({
      blogList:[]
    })
    this._loadBlogList(0)
  },

  goToComment(e){
    // 点击后将blogid传递过去
    wx.navigateTo({
      url: `../comment/comment?blogid=${e.target.dataset.blogid}`,
    })
  },

  onSearch(e){
    keywords=e.detail.keywords
    this.setData({
      blogList:[]
    })
    this._loadBlogList(0)
  },

  onShareAppMessage(e){
    // console.log(e)
    let blog=e.target.dataset.blog
    return{
      title: blog.content,
      path: `/pages/comment/comment?blogId=${blog._id}`,
      // imageUrl:''
    }
  }

})