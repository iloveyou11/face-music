import formatDate from '../../utils/time.js'
// const formatDate = require('../../utils/time.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog:Object
  },

  observers:{
    ['blog.createTime'](val){
      this.setData({
        _createTime: formatDate(new Date(val))
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreview(e){
      const ds=e.target.dataset
      const urls = ds.imgs
      const current=ds.src
      wx.previewImage({
        urls,
        current
      })
    }
  }
})
