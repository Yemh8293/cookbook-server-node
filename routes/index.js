const express=require('express');
//引入连接池
const pool=require('../pool.js');
//创建空路由器
var router=express.Router();
router.get("/index",(req,res)=>{
  var sql = "SELECT id,title,pic FROM cb_detail";
  // var sql="SELECT pid,title,pic FROM cb_index_product";
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    res.send({code:200,msg:"查询成功",data:result});
  })
})


module.exports=router;