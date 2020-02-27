const fetch = require('node-fetch');
const CONFIG = require('../config.app');
const User =require('../model/user');
const util = require('../utils/util') ;

exports.register = (req,res) =>{
  let {name , password ,phone,introduce,email,type } = req.body;
  if(!email){
    util.responseClient(res,400,2,'用户邮箱不能为空');
    return;
  }
  //正则表达式
  const reg = new RegExp(
    '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$',
  ); 
  if(!reg.test(email)){
    util.responseClient(res,400,2,'请输入格式正确的邮箱！');
    return;
  }
  if (!name) {
    util.responseClient(res, 400, 2, '用户名不可为空');
    return;
  }
  if (!password) {
    util.responseClient(res, 400, 2, '密码不可为空');
    return;
  }
  //判断当前用户是否存在
  User.findOne({email:email})
    .then(data=>{
      if(data){
        util.responseClient(res, 200, 1, '用户邮箱已存在！');
        return;
      }
      //保存到数据库
      let user = new User({
        email,
        name,
        password:util.md5(password + util.MD5_fixed),
        phone,
        type,
        introduce,
      });
      user.save().then(data => {
        util.responseClient(res, 200, 0, '注册成功', data);
      });
    }).catch(err => {
      util.responseClient(res);
      return;
    });
} 
exports.login =(req,res) =>{
  let {email,password}  = req.body;
  if(!email){
    util.responseClient(res,400,2,'用户邮箱不能为空');
    return;
  }
  if (!password) {
    util.responseClient(res, 400, 2, '密码不可为空');
    return;
  }
  User.findOne({
    email,
    password:util.md5(password+util.MD5_fixed),
  }).then(userInfo=>{
    if(userInfo){
      if (userInfo.type === 0) {
        //登录成功后设置session
        req.session.userInfo = userInfo;
        util.responseClient(res, 200, 0, '登录成功', userInfo);
      } else {
        util.responseClient(res, 403, 1, '只有管理员才能登录后台！');
      }
    }else{
      util.responseClient(res, 400, 1, '用户名或者密码错误');
    }o
  }).catch(err=>{
    util.responseClient(res);
  })

}

exports.currentUser =(req, res)=> {
    let user = req.session.userInfo;
    if (user) {
      user.avatar = 'http://ww1.sinaimg.cn/large/007UgRf1gy1gaxd6hfcouj30dc0dcaad.jpg';
      user.notifyCount = 0;
      user.address = '上海市';
      user.country = 'China';
      user.group = '冲鸭攻城狮';
      (user.title = '前端攻城狮'), (user.signature = '坚持，坚强，自信，自强');
      user.tags = [];
      user.geographic = {
        province: {
          label: '上海',
          key: '2000000',
        },
        city: {
          label: '上海',
          key: '2100000',
        },
      };
      util.responseClient(res, 200, 0, '', user);
    } else {
      util.responseClient(res, 200, 1, '请重新登录', user);
    }
}
exports.loginAdmin = (req, res) => {
  let { email, password } = req.body;
  if (!email) {
    util.responseClient(res, 400, 2, '用户邮箱不可为空');
    return;
  }
  if (!password) {
    util.responseClient(res, 400, 2, '密码不可为空');
    return;
  }
  User.findOne({
    email,
    password: util.md5(password + util.MD5_fixed),
  })
    .then(userInfo => {
      if (userInfo) {
        if (userInfo.type === 0) {
          //登录成功后设置session
          req.session.userInfo = userInfo;
          util.responseClient(res, 200, 0, '登录成功', userInfo);
        } else {
          util.responseClient(res, 403, 1, '只有管理员才能登录后台！');
        }
      } else {
        util.responseClient(res, 400, 1, '用户名或者密码错误');
      }
    })
    .catch(err => {
      util.responseClient(res);
    });
};

exports.logout = (req, res) => {
  if (req.session.userInfo) {
    req.session.userInfo = null; // 删除session
    util.responseClient(res, 200, 0, '登出成功！！');
  } else {
    util.responseClient(res, 200, 1, '您还没登录！！！');
  }
};

exports.getUserList = (req,res) =>{
  let keyWord = req.body.keyWord || '';
  let pageNum = req.body.pageNum || 1;
  let pageSize = req.body.pageSize || 10;
  let type = req.body.type || '';
  
  let conditions = {};
  if(keyWord){
    const reg = new RegExp(keyWord,'i');
    if(type){
      conditions = {
        $or : [{name:{$regex:reg}},{email:{$regex:reg}}],type:type
      }
    }else{
      conditions = {
        $or : [{name:{$regex:reg}},{email:{$regex:reg}}]
      }
    }
  }else{
    if(type){
      conditions ={
        $or : [{type:type}]
      }
    }
  }
  let skip = pageNum -1 <0 ? 0 :(pageNum - 1) * pageSize ; 
  let responseData = {
    count :0,
    list :[],
  };
  User.countDocuments({},(err,count)=>{
    if(err){
      console.error('Error:'+ err);
    }else{
      responseData.count = count;
      //待返回的字段
      let fields = {
        _id: 1,
        email: 1,
        name: 1,
        avatar: 1,
        phone: 1,
        introduce: 1,
        type: 1,
        create_time: 1,
      };
      let option={
        skip:skip,
        limit:pageSize,
        sort:{create_time:-1},
      };
      console.log(conditions,fields,option)
      User.find(conditions,fields,option,(error,result)=>{
        if(error){
          console.error('Error:'+error)
        }else{
          responseData.list = result;
          
          util.responseClient(res, 200, 0, 'success', responseData);
        }
      })
    }
  })

}

exports.delUser = (req,res)=>{
  let { id } = req.body;
  console.log(id)
  User.deleteMany({_id:id}).then(result=>{
    console.log(result)
    if (result.n === 1) {
      util.responseClient(res, 200, 0, '用户删除成功!');
    } else {
      util.responseClient(res, 200, 1, '用户不存在');
    }
  }).catch(err => {
    util.responseClient(res);
  });

}