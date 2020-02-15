const express=require('express');
//引入连接池
const pool=require('../pool.js');
//创建空路由器
var router=express.Router();
//创建路由
// 1.首页轮播
router.get("/sider",(req,res)=>{
  var sql="SELECT cid,class_id,img,title,subtitle FROM cb_index_carousel";
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    res.send({code:200,msg:"查询成功",data:result});
  })
})
// 2.商品列表
router.get('/list',(req,res)=>{
  //获取数据
  var obj=req.query;
  var $kw=obj.keyword;
  var sql='SELECT id,title,pic FROM cb_detail';
    sql+=` WHERE title LIKE '%${$kw}%'`;
  //执行SQL语句，响应查询到的数据
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    res.send({code:200,msg:"查询成功",data:result});
  });
});



// 首页焦点图
router.get("/banner",(req,res)=>{
  var sql="SELECT img FROM cb_index_banner";
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    res.send({code:200,msg:"查询成功",data:result});
  })
})

// 菜单导航-左边分类
router.get("/menu",(req,res)=>{
  var sql = "SELECT fid,img,fname FROM cb_primary_family";
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    res.send({code:200,msg:"查询成功",data:result})
  })
})
// 菜单导航-右边内容
router.get("/menuItem",(req,res)=>{
  var sql = "SELECT family_id,img,sname FROM cb_secondary";
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    res.send({code:200,msg:"查询成功",data:result});
  })
})

// 视频页面
router.get("/video",(req,res) => {
  var sql = "SELECT title,img,duration,release_date,clicks,video FROM cb_video";
  pool.query(sql,(err,result) => {
    if(err) throw err;
    res.send({code:200,msg:"查询成功",data:result})
  })
})

// 文章页面
router.get("/article",(req,res)=>{
  var sql="SELECT aid,theme,view_data,release_date,img FROM cb_article";
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    res.send({code:200,msg:"查询成功",data:result});
  })
})

// 时令食材
router.get("/seasonal",(req,res)=>{
  // var obj=req.query.family_id;
  var sql = "SELECT fid,family_id,img,fname,effect,energy FROM cb_seasonal_food";
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    res.send({code:200,msg:"查询成功",data:result});
  });
})

//商品详情
router.get("/detail",(req,res)=> {
  //获取数据，
  var obj=req.query;
  var $lid=obj.id;
  //执行SQL语句，把查询的数据响应给浏览器
  var sql = "SELECT title,peoplenum,cookingtime,content,pic,tag,material FROM cb_detail WHERE id=?";
  pool.query(sql,[$lid],(err,result)=>{
    if(err) throw err;
    res.send({code:200,msg:"查询成功",data:result});
  });
})

//导出路由器
module.exports=router;
//在app.js服务器文件中挂载到/product下