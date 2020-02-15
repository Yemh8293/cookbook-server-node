const express=require('express');
const cors=require('cors');
const session=require('express-session');
const bodyParser=require('body-parser');

const userRouter=require('./routes/user.js');
const productRouter=require('./routes/product.js');
const indexRouter=require('./routes/index');

// 创建web服务器
var server=express();
server.listen(3000);

// 处理跨域请求
server.use(cors({
	origin:["http://127.0.0.1:8080","http://localhost:8080"],
  credentials:true
}));

// 使用 session 中间件
server.use(session({
  secret:"128位字符串",
  resave:true,
  saveUninitialized:true
}));

// 使用body-parser中间件
server.use(bodyParser.urlencoded({
  extended:false
}));

// 托管静态资源到public目录下
server.use(express.static('public'));
server.use('/user',userRouter);
server.use('/product',productRouter);
server.use(indexRouter);
