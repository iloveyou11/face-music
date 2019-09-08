// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const TcbRouter = require('tcb-router')
const db=cloud.database()
const blogCollection=db.collection('blog')

// 每次查询的最大限度（小程序限制
const MAX_LIMIT=100

// 云函数入口函数
exports.main = async (event, context) => {
  const app=new TcbRouter({
    event
  })
  // 获取全部博客列表
  app.router('list',async(ctx,next)=>{
    const keywords = event.keywords
    let where={}

    // 模糊查询
    if (keywords.trim()!==''){
      where={
        content:db.RegExp({
          regexp:keywords,
          options:'i'
        })
      }
    }

    let blogList=await blogCollection
      .where(where)
      .skip(event.start, event.count)
      .orderBy('createTime','desc')
      .get()
      .then(res=>{
        return res.data
      })
    ctx.body = blogList
  })
  
  // 获取单条博客详情（包括全部评论）
  app.router('detail', async (ctx, next) => {
    let blogId=event.blogId
    // 详情查询
    let detail=await blogCollection.where({
      _id:blogId
    }).get().then(res=>{
      return res.data
    })
    // 评论查询
    const countResult=await blogCollection.count()
    const total=countResult.total
    let commentList={
      data:[]
    }
    if(total>0){
      const times=Math.ceil(total/MAX_LIMIT)
      const tasks=[]
      for(let i=0;i<times;i++){
        let promise=db.collection('blog-comment')
          .skip(i*MAX_LIMIT)
          .limit(MAX_LIMIT)
          .where({blogId})
          .orderBy('createTime','desc')
          .get()
        tasks.push(promise)
      }
      if(tasks.length>0){
        commentList=(await Promise.all(tasks)).reduce((pre,cur)=>{
          return {
            data:pre.data.concat(cur.data)
          }
        })
      }
    }

    ctx.body = {
      commentList,
      detail
    }

  })

  // 获取指定openid用户的博客数据
  const wxContext=cloud.getWXContext()
  app.router('getBlogByOpenid', async (ctx, next) => {
    ctx.body=await blogCollection
      .where({
        _openid: wxContext.OPENID
      })
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime','desc')
      .get()
      .then(res=>{
        return res.data
      })
  })


  return  app.serve()
}