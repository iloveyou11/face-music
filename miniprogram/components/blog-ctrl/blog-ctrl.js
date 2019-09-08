let userInfo={}
const db=wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId:String,
    blog:Object
  },

  externalClasses: ['iconfont', 'icon-pinglun','icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    loginShow:false,
    bottomModalShow:false,
    content:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment(){
      // 判断用户是否授权
      wx.getSetting({
        success:(res)=>{
          if (res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success:res=>{
                userInfo = res.userInfo
                // 显示评论
                this.setData({
                  bottomModalShow:true
                })

              }
            })
          }else{
            this.setData({
              loginShow:true
            })
          }
        }
      })
    },

    loginSuccess(e){
      userInfo=e.detail
      // 授权框消失，评论框显示
      this.setData({
        loginShow:false
      },()=>{
        this.setData({
          bottomModalShow:true
        })
      })
    },

    loginFail(){
      wx.showModal({
        title: '授权用户才能进行评价',
        content: '',
      })
    },

    // 使用表单后不需要为输入框绑定监听事件
    // onInput(e){
    //   this.setData({
    //     content:e.detail.value
    //   })
    // },

    onSend(e){
      // console.log(e)
      let content=e.detail.value.content
      let formId=e.detail.formId
      // 插入数据库
      // let content = this.data.content
      if (content.trim()===''){
        wx.showModal({
          title: '评论内容不能为空！',
          content: '',
        })
        return
      }
      wx.showLoading({
        title: '评价中……',
        mask:true
      })
      db.collection('blog-comment').add({
        // 小程序端（非云函数）插入数据库，会自带openid参数
        data:{
          content,
          createTime:db.serverDate(),
          blogId: this.properties.blogId,
          nickName:userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then(res=>{
        // 推送模板消息
        // wx.cloud.callFunction({
        //   name:'sendMsg',
        //   data:{
        //     content,
        //     formId,
        //     blogId: this.properties.blogId
        //   }
        // }).then(res=>{
        //   console.log(res)
        // })

        this.setData({
          bottomModalShow: false,
          content: ''
        })
        wx.hideLoading()
        wx.showToast({
          title: '评论成功!',
        })

        // 父元素需要刷新评论页面
        this.triggerEvent('refreshCommentList')
      })

    },



  }
})
