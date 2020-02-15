// 引入上一级目录下的mysql连接池对象
const pool=require('../pool.js');
const express=require('express');
const crypto = require("crypto");
// 创建空路由器
var router=express.Router();
//添加路由
// 1.1邮箱注册
router.post('/eReg',(req,res)=>{
  // var obj=req.body;
  let email = req.body.email;
  let uname = req.body.uname;
  let avatar = req.body.avatar;
  let say = req.body.say;
  let nackname = req.body.nackname;
  let upwd = req.body.upwd;
  let md5 = crypto.createHash("md5"); 
  let newPwd = md5.update(upwd).digest("hex");
  let obj = {
    email,
    uname,
    avatar,
    say,
    nackname,
    upwd: newPwd
  };
  // console.log(obj);
  var sql="INSERT INTO cb_user SET ?"
  var checkSql="SELECT * FROM cb_user WHERE email=?";
  pool.query(checkSql,[email],(err,result)=>{
    // console.log(result)
    if(err) throw err;
	  if(result.length>0){
	    res.send({code:-1,msg:'邮箱已被注册'});
    }else{
      pool.query(sql,[obj],(err,result)=>{
        // console.log(result)
        if(err) throw err;
        if(result.affectedRows>0){
          res.send({code:200,msg:'注册成功!'});
        }else{
          res.send({code:301,msg:'注册失败!'});
        }
      });
    } 
  })
  
});

// 1.2用户名注册
router.post('/nReg',(req,res)=>{
  // var obj=req.body;
  let email = req.body.email;
  let uname = req.body.uname;
  let avatar = req.body.avatar;
  let say = req.body.say;
  let nackname = req.body.nackname;
  let upwd = req.body.upwd;
  let md5 = crypto.createHash("md5"); 
  let newPwd = md5.update(upwd).digest("hex");
  let obj = {
    email,
    uname,
    avatar,
    say,
    nackname,
    upwd: newPwd
  };
  // console.log(obj);
  var sql="INSERT INTO cb_user SET ?"
  var checkSql="SELECT * FROM cb_user WHERE uname=?";
  pool.query(checkSql,[uname],(err,result)=>{
    // console.log(result)
    if(err) throw err;
	  if(result.length>0){
	    res.send({code:-1,msg:'用户名已被注册'});
    }else{
      pool.query(sql,[obj],(err,result)=>{
        // console.log(result)
        if(err) throw err;
        if(result.affectedRows>0){
          res.send({code:200,msg:'注册成功!'});
        }else{
          res.send({code:301,msg:'注册失败!'});
        }
      });
    } 
  })
  
});

// 2.用户登录路由
router.post('/login',(req,res)=>{
  // console.log(req.body);
  var uname=req.body.uname;
  var upwd=req.body.upwd;
  var ph = /^1[3-9]\d{9}$/;
  var e = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
  if(uname.match(ph)){
    var phone=uname;
    var sql =" SELECT * FROM cb_user WHERE phone = ? AND upwd = md5(?)";
    pool.query(sql,[phone,upwd],(err,result)=>{
      // console.log(result);
      if(err) throw err;
      if(result==""){
        res.send({code:404,msg:"用户名不存在"});
      }else if(result.length==0){
          res.send({code:301,msg:"用户名或密码有误"});
      }else{
        req.session.uid = result[0].uid;
        // console.log(req.session.uid);
        res.send({code:200,msg:"登录成功!"});
      }
    })
  }else if(uname.match(e)){
    var email=uname;
    var sql =" SELECT uid FROM cb_user WHERE email = ? AND upwd = md5(?)";
    pool.query(sql,[email,upwd],(err,result)=>{
      // console.log(result);
      if(err) throw err;
      if(result==""){
        res.send({code:404,msg:"用户名不存在"});
      }else if(result.length==0){
          res.send({code:301,msg:"用户名或密码有误"});
      }else{
        req.session.uid = result[0].uid;
        // console.log(req.session.uid);
        res.send({code:200,msg:"登录成功!"});
      }
    })
  }else{
    var sql =" SELECT uid FROM cb_user WHERE uname = ? AND upwd = md5(?)";
    pool.query(sql,[uname,upwd],(err,result)=>{
      // console.log(result);
      if(err) throw err;
      if(result==""){
        res.send({code:404,msg:"用户名不存在"});
      }else if(result.length==0){
          res.send({code:301,msg:"用户名或密码有误"});
      }else{
        req.session.uid = result[0].uid;
        // console.log(req.session.uid);
        res.send({code:200,msg:"登录成功!"});
      }
    })
  }
});

// 3.更改用户
router.post('/update',(req,res)=>{
  var obj = req.body;
  // console.log(obj);
  var $uid = req.session.uid;
  var $email = obj.email
  // var $avatar=obj.avatar;
  var $nackname = obj.nackname;
  var $say = obj.say;
  var $gender = obj.gender;
  var $birthday = obj.birthday;
  var $profession = obj.profession;
  //执行SQL语句
  pool.query('UPDATE cb_user SET email=?,nackname=?,say=?,gender=?,birthday=?,profession=? WHERE uid=?',[$email,$nackname,$say,$gender,$birthday,$profession,$uid],(err,result)=>{
    if(err) throw err;
    // console.log(result)
	//判断是否更改成功
	if(result.affectedRows>0){
	  res.send({code:200,msg:'修改成功'});
	}else{
	  res.send({code:301,msg:'修改失败'});
	}
  });
});

// 4.返回当前登录用户的信息
router.get("/sessiondata",(req,res)=>{
  var uid=req.session.uid;
  // console.log(uid)
  var sql="SELECT uname,email,avatar,nackname,say,gender,birthday,hometown,addr,profession FROM cb_user WHERE uid=?";
  pool.query(sql,[uid],(err,result)=>{
    if(err) throw err;
    res.send({code:200,msg:"查询成功",data:result});
  })
})
//导出路由器
module.exports=router;