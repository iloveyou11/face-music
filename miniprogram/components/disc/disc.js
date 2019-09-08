Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist:{
      type:Object
    }
  },
  observers:{
    ['playlist.playCount'](count){
      this.setData({
        _count:this._transNumber(count,2)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _count:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToMusicList(){
      wx.navigateTo({
        url: `../../pages/music-list/music-list?playlistId=${this.properties.playlist.id}`,
      })
    },
    _transNumber(count,point){
      const number=count.toString().split('.')[0]
      const len=number.length
      if(len<6){
        return number
      }else if(len>=6&&len<=8){
        let decimal=number.substring(len-4,len-4+point)
        return parseFloat(parseInt(number / 10000) + '.' + decimal)+'万'
      }else{
        let decimal = number.substring(len - 8, len - 8 + point)
        return parseFloat(parseInt(number / 100000000) + '.' + decimal) + '亿'
      }
    }
  }
})
