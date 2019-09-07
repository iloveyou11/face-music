// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGetUserInfo(e){
      // console.log(e)
      const userInfo=e.detail.userInfo
      // 允许授权
      if(userInfo){
        this.setData({
          modalShow:false
        })
        // 向review页面传递userInfo信息
        this.triggerEvent('loginSuccess',userInfo)
        //不允许授权
      }else{
        this.triggerEvent('loginFail')
      }
    }
  }
})
