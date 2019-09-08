let lyricHeight=0

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricsShow:{
      type:Boolean,
      value:false
    },
    lyric:String
  },
  observers:{
    lyric(lrc){
      if(lrc==='暂无歌词，请欣赏'){
        this.setData({
          lrcList:[{
            lrc,
            time:0
          }],
          nowLyricIndex:-1
        })
      }else{
        this._parseLyric(lrc)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    nowLyricIndex:-1,
    scrollTop:0,
  },

// 在这里换算px和rpx的关系
  lifetimes:{
    ready(){
      wx.getSystemInfo({
        success: function(res) {
          // 1rpx的大小（对应的px单位）
          // 一行歌词对应的高度，因为css中设置的是64rpx
          lyricHeight=res.screenWidth/750*64 
        },
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    update(curTime){
      let lrcList = this.data.lrcList
      let len = lrcList.length
      if (len===0) return

// 如果当前时间比歌词中最后一条歌词的时间还大，则不高亮任何歌词，同时滚动到最后一句歌词
      if (curTime > lrcList[len-1]){
        if(this.data.nowLyricIndex!==-1){
          this.setData({
            nowLyricIndex:-1,
            scrollTop:len*lyricHeight
          })
        }
      }
      for(let i=0;i<len;i++){
        if(curTime<lrcList[i].time){
          this.setData({
            nowLyricIndex:i-1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    },
    _parseLyric(lyric){
      let line=lyric.split('\n')
      let _lyric=[]
      line.forEach(item=>{
        let time=item.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time){
          let lrc=item.split(time)[1]
          let pureTime = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          let second = parseInt(pureTime[1]) * 60 + parseInt(pureTime[2]) + parseInt(pureTime[3])/1000
          _lyric.push({
            lrc,
            time:second
          })
        }else{
          // 如果歌词没有时间，无法设置正常的滚动，需要用户手动移动歌词
          _lyric.push({
            lrc:item,
            time: 0
          })
        }
      })
      this.setData({
        lrcList: _lyric
      })
    }
  }
})
