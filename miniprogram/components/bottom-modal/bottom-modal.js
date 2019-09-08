Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow:Boolean
  },

  options:{
    styleIsolation:'apply-shared',
    multipleSlots:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose(){
      this.setData({
        modalShow:false
      })
    }
  }
})
