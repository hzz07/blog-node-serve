/*
 * @Author: mikey.hzz 
 * @Date: 2020-01-13 15:19:23 
 * @Last Modified by: mikey.hzz
 * @Last Modified time: 2020-02-17 16:38:20
 * 所有路由接口配置
 */
const user =require('./users');
const article = require('./article');
const tag = require('./tag');
const category = require('./category');
const comment =require('./comment');

module.exports=app=>{
  //用户 登录 注册模块
  app.post('/register', user.register)
  app.post('/adminLogin',user.loginAdmin)
  app.post('/login', user.login);
  app.post('/getUserList',user.getUserList);
  app.get('/currentUser',user.currentUser);
  app.get('/logout',user.logout);
  app.post('/delUser',user.delUser);
  //文章模块
  app.post('/addArticle',article.addArticle);
  app.post('/getArticleList',article.getArticleList);
  app.post('/getArticleDetail',article.getArticleDetail);
  //标签模块
  app.post('/getTagList',tag.getTagList);
  app.post('/delTag',tag.delTag);
  app.post('/addTag',tag.addTag);
  //分类模块  
  app.post('/getCategory',category.getCategory)
  //评论模块
  app.post('/getCommentList',comment.getCommentList)
}