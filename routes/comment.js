const util = require('../utils/util');
const Comment = require('../model/comment');
const User = require('../model/user');
const Article = require('../model/article');

//获取全部评论
exports.getCommentList = (req, res) => {
    let keyWord = req.body.keyWord || null;
    let is_handle = parseInt(req.body.is_handle) || 0;
    // console.log('is_handle ', is_handle);
    let pageNum = parseInt(req.body.pageNum) || 1;
    let pageSize = parseInt(req.body.pageSize) || 10;
    let conditions = {};
    if (keyWord) {
      const reg = new RegExp(keyWord, 'i'); //不区分大小写
      if (is_handle) {
        conditions = {
          content: { $regex: reg },
          is_handle,
        };
      } else {
        conditions = {
          content: { $regex: reg },
        };
      }
    }
    if (is_handle) {
      conditions = {
        is_handle,
      };
      console.log('conditions', conditions);
    }
  
    let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
    let responseData = {
      count: 0,
      list: [],
    };
  
    Comment.countDocuments({}, (err, count) => {
      if (err) {
        console.error('Error:' + err);
      } else {
        responseData.count = count;
        // 待返回的字段
        let fields = {
          article_id: 1,
          content: 1,
          is_top: 1,
          likes: 1,
          user_id: 1,
          user: 1,
          other_comments: 1,
          state: 1,
          is_handle: 1,
          create_time: 1,
          // update_time: 1,
        };
        let options = {
          skip: skip,
          limit: pageSize,
          sort: { create_time: -1 },
        };
        Comment.find(conditions, fields, options, (error, result) => {
          if (err) {
            console.error('Error:' + error);
            // throw error;
          } else {
            responseData.list = result;
            util.responseClient(res, 200, 0, '操作成功！', responseData);
          }
        });
      }
    });
  };

  //新增评论
  exports.addComments = (req,res)=>{
    // if(req.session.userInfo){
    //   util.responseClient(res,200,1,'您还没登录，或者登录信息已过期，请重新登录！');
    //   return
    // }
    let { article_id, content } = req.body;
    let user_id = req.cookies.user_id || null;
    let name = req.body.name || null;
    let email = req.body.email || 0;
    // console.log('is_handle ', is_handle);
    //正则表达式
    const reg = new RegExp(
      '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$',
    ); 
    if(!reg.test(email)){
      util.responseClient(res,400,2,'请输入格式正确的邮箱！');
      return;
    }
    let user = new User({
      email,
      name,
      password:util.md5(email + util.MD5_fixed),
      phone:'',
      type:'1',
      introduce:'',
    });
    console.log(user_id)
    if(user_id){
      User.findById({
        _id:user_id
      }).then(result=>{
        if(result){
          let userInfo={
            user_id:result._id,
            name:result.name,
            type:result.type,
            avator:result.avator
          }
          let comment = new Comment({
            article_id:article_id,
            content:content,
            user_id:user_id,
            user:userInfo
          })
          comment.save().then(commentResult=>{
            Article.findOne({_id:article_id},(error,data)=>{
              if(error){
                console.error('Error:'+error)
              }else{
                data.comments.push(commentResult._id)
                data.other.comments = data.other.comments+1
                Article.updateOne({_id:article_id},{comments:data.comments,other:data.other,is_handle:0}).then(result=>{
                  util.responseClient(res,200,0,'操作成功！',commentResult)
                }).catch(err=>{
                  console.error('err:'+err)
                })
              }
            })
          }).catch(err2 => {
            console.error('err :', err2);
            throw err2;
          });
        }else{
          user.save().then(result => {
            if(result){
              console.log(result)
              let userInfo={
                user_id:result._id,
                name:result.name,
                type:result.type,
                avator:result.avator
              }
              let comment = new Comment({
                article_id:article_id,
                content:content,
                user_id:user_id,
                user:userInfo
              })
              comment.save().then(commentResult=>{
                Article.findOne({_id:article_id},(error,data)=>{
                  if(error){
                    console.error('Error:'+error)
                  }else{
                    data.comments.push(commentResult._id)
                    data.other.comments = data.other.comments+1
                    Article.updateOne({_id:article_id},{comments:data.comments,other:data.other,is_handle:0}).then(result=>{
                      util.responseClient(res,200,0,'操作成功！',commentResult)
                    }).catch(err=>{
                      console.error('err:'+err)
                    })
                  }
                })
              }).catch(err2 => {
                console.error('err :', err2);
                throw err2;
              });
            }else{
              util.responseClient(res, 200, 1, '服务器开小差了!')
            }
          });  
        }
      }).catch(error => {
        console.error('error :', error);
        responseClient(res);
      })
    }else{
      user.save().then(result => {
        if(result){
          let userInfo={
            user_id:result._id,
            name:result.name,
            type:result.type,
            avator:result.avator
          }
          let comment = new Comment({
            article_id:article_id,
            content:content,
            user_id:result._id,
            user:userInfo
          })
          comment.save().then(commentResult=>{
            Article.findOne({_id:article_id},(error,data)=>{
              if(error){
                console.error('Error:'+error)
              }else{
                data.comments.push(commentResult._id)
                data.other.comments = data.other.comments+1
                Article.updateOne({_id:article_id},{comments:data.comments,other:data.other,is_handle:0}).then(result=>{
                  util.responseClient(res,200,0,'操作成功！',commentResult)
                }).catch(err=>{
                  console.error('err:'+err)
                })
              }
            })
          }).catch(err2 => {
            console.error('err :', err2);
            throw err2;
          });
        }else{
          util.responseClient(res, 200, 1, '服务器开小差了!')
        }
      });  
    }
    
  }
  //添加评论
  exports.addThirdComment=(req,res)=>{
    if(!req.session.userInfo){
      util.responseClient(res,200,1,'您还没登录，或者登录信息已过期，请重新登录！')
      return
    }
    let {article_id,comment_id,user_id,content,to_user} = req.body;
    Comment.findById({
      _id:comment_id
    }).then(commentResult=>{
      User.findById({_id:user_id}).then(userResult=>{
        if(userResult){
          let userInfo ={
            user_id:userResult._id,
            name:userResult.name,
            type:userResult.type,
            avator:userResult.avator
          }
          let item ={
            user:userInfo,
            content:content,
            to_user:JSON.parse(to_user)
          }
          commentResult.other_comments.push(item);
          Comment.updateOne(
            {_id:comment_id},
            {
              other_comments:commentResult.other_comments,
              is_handle:2
            }

            ).then(result=>{
              Article.findOne({_id:article_id},(error,data)=>{
                if(error){
                  console.error('Error:' + error);
                }else{
                  data.other.comments = data.other.comments+1
                  Article.updateOne({_id:article_id},{other:data.other}).then(ArticleResult=>{
                    util.responseClient(res,200,0,'操作成功！',ArticleResult).catch(err=>{
                      throw err;
                    })
                  })
                }
              })
            }).catch(err1=>{
              console.error('err1:', err1);
              util.responseClient(res);
            })
        }else{
          util.responseClient(res, 200, 1, '用户不存在');
        }
      }).catch(error=>{
        console.error('error :', error);
        util.responseClient(res);
      })
    }).catch(error2 => {
      console.error('error2 :', error2);
      util.responseClient(res);
    });
  }
  //管理一级评论
  exports.changeComment=(req,res)=>{
    let {id,state} = req.body
    Comment.updateOne({_id:id},{state:Number(state),is_handle:1}).then(result=>{
      util.responseClient(res,200,0,'操作成功！',result)
    }).catch(err=>{
      console.error('err:', err);
      util.responseClient(res);
    })
  }
  //管理第三方评论
  exports.chanegThirdComment=(req,res)=>{
    let {id,state,index} = req.body;
    comment.findById({
      _id:id,
    }).then(commentResult=>{
      let i = index?Number(index):0;
      if(commentResult.other_comments.length){
        commentResult.other_comments[i].state = Number(state)
        Comment.updateOne(
          {_id:id},
          {
            other_comments:commentResult.other_comments,
            is_handle:1
          }
        ).then(result=>{
          util.responseClient(res,200,0,'操作成功',result)
        }).catch(err1=>{
          console.error('err1:', err1);
          util.responseClient(res);
        })

      }else{
        util.responseClient(res, 200, 1, '第三方评论不存在！', result);
      }
    }).catch(error2=>{
      console.log('error2 :', error2);
      util.responseClient(res);
    })
  }