// 云函数入口文件
const cloud = require('wx-server-sdk')

const rp=require('request-promise')
const URL = 'http://musicapi.xiecheng.live/personalized'

cloud.init()

const db=cloud.database() //初始化云数据库
const playlistCollection = db.collection('playlist')
const MAX_LENGTH = 100 //小程序能从云数据库获取的最多记录


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 云数据库中存储的数据
  // const list = await playlistCollection.get()
  // 如何突破小程序只能获取云数据库100条记录的限制？
  // 可以分批次去获取，最后拼接在一起
  const countResult=await playlistCollection.count()
  const total=countResult.total
  const batchTimes=Math.ceil(total/MAX_LENGTH)
  const tasks=[]
  for(let i=0;i<batchTimes;i++){
    let promise=playlistCollection.skip(i*MAX_LENGTH).limit(MAX_LENGTH).get()
    tasks.push(promise)
  }
  let list={
    data:[]
  }
  if(tasks.length>0){
    list=(await Promise.all(tasks)).reduce((pre,cur)=>{
      return {
        data:pre.data.concat(cur.data)
      }
    })
  }

  // 从服务器端获取的数据
  const playlist=await rp(URL).then(res=>{
    return JSON.parse(res).result
  })
  // 针对list和playlist做去重处理，在playlist中找出所有不在list中的数据
  const newData=[]
  for (let i = 0, len1 = playlist.length;i<len1;i++){
    let isSame = false
    for(let j=0,len2=list.data.length;j<len2;j++){
      if(playlist[i].id===list[j].id){
        isSame=true
        break
      }
    }
    if(!isSame){
      newData.push(playlist[i])
    }
  }
  // 将数据存储至云数据库当中
  for (let i = 0, len = newData.length;i<len;i++){
    await playlistCollection.add({
      data:{
        ...newData[i],
        createTime:db.serverDate()
      }
    }).then(res=>{
      console.log('插入成功')
    }).catch(err=>{
      console.error('插入失败')
    })
  }

  return newData.length
}