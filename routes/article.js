const Article = require('../model/article');
const User = require('../model/user');
const util = require('../utils/util');

//新增文章
exports.addArticle =(req,res)=> {
    let {
        title,
        author,   
        keyWord,
        content,
        desc,
        img_url,
        tags,
        category,
        state,
        type,
        origin
    } = req.body;
    let tempArticle = null;
    if(!img_url){
        img_url = 'http://ww1.sinaimg.cn/large/007UgRf1gy1gb2s67jrffj31hc0u0wmu.jpg';
    }
    tempArticle = new Article({
        title,
        author,
        keyWord:keyWord ? keyWord.split(',') : [],
        content,
        numbers: content.length,
        desc,
        img_url,
        tags:tags ? tags.split(',') : [],
        category: category ? category.split(',') : [],
        state,
        type,
        origin
    })
    tempArticle.save().then(data=>{
        util.responseClient(res,200,0,'保存成功',data)
    }).catch(err=>{
        console.log(err);
        util.responseClient(res);
    })    

} 


//后台查询文章列表
exports.getArticleList =(req,res)=> {
    let keyWord = req.body.keyWord || null;
    let state = req.body.state || null;
    let likes = req.body.likes || '';
    let pageNum = parseInt(req.body.pageNum) || 1;
    let pageSize = parseInt(req.body.pageSize) || 10;
    let conditions = {};
    if(!state){
        if(keyWord){
            const reg = new RegExp(keyWord, 'i'); //不区分大小写
            conditions={
                $or : [{ title: { $regex: reg } },
                    { desc: { $regex: reg } },
                    { keyWord: { $regex: reg } }]
            }
        }
    }else if(state){
        state = parseInt(state)
        if(keyWord){
            const reg = new RegExp(keyWord,'i')
            conditions = {
                $and: [
                  { $or: [{ state: state }] },
                  {
                    $or: [
                      { title: { $regex: reg } },
                      { desc: { $regex: reg } },
                      { keyWord: { $regex: reg } },
                    ],
                  },
                ],
              };
        }else{
            conditions = {state}
        }

    }
    let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
    let responseData = {
        count:0,
        list:[]
    };
    Article.countDocuments({},(err,count)=>{
        if(err){
           console.log(err)     
        }else{
            responseData.count = count;
            let fields = {
                title: 1,
                author: 1,
                keyWord: 1,
                // content: 1,
                desc: 1,
                img_url: 1,
                tags: 1,
                category: 1,
                state: 1,
                type: 1,
                origin: 1,
                //comments: 1,
                //like_Users: 1,
                other: 1,
                create_time: 1,
            }
            let options = {
                skip: skip,
                limit: pageSize,
                sort: { create_time: -1 },
            };
            console.log(conditions,fields,options)
            Article.find(conditions,fields,options,(error,result)=>{
                if(err){
                    console.log('error'+error)
                }else{
                    if (likes) {
                        result.sort((a, b) => {
                          return b.other.likes - a.other.likes;
                        });
                      }
                     
                      responseData.list = result;
                      console.log(error)
                      console.log(responseData)
                      util.responseClient(res, 200, 0, '操作成功！', responseData);
                }
            }).populate([
                { path: 'tags' },
                { path: 'comments' },
                { path: 'category' },
              ])
              .exec((err, doc) => {
                // console.log("doc:");          // aikin
                // console.log("doc.tags:",doc.tags);          // aikin
                // console.log("doc.category:",doc.category);           // undefined
              });    

        }
    })
}

//文章详情
exports.getArticleDetail=(req,res)=>{
    let {id} = req.body;
    let type = Number(req.body.type) || 1; //文章类型 =>1"普通文章，2：简历，3：管理员介绍
    let filter = Number(req.body.filter) || 1; //文章过滤 =>1：过滤，2：不过滤
    if(type===1){
        if(!id){
            util.responseClient(res,200,1,'文章不存在!');
            return;
        }
        Article.findOne({_id:id},(Error,data)=>{
            if(Error){
                console.error('Error：'+Error);
            }else{
                console.log(data)
                if(data){
                    data.other.views = data.other.views+1;
                    Article.updateOne({_id:id},{other:data.other}).then(result=>{
                        if(filter===1){
                            const arr = data.comments;
                            for(let i  = arr.length-1;i>0;i--){
                                const e =arr[i];
                                if(e.state!==1){
                                    arr.splice(i,1);
                                }
                                const newArr = e.other_comments;
                                const length =  newArr.length;
                                if(length){
                                    for(let j=length-1;j>=0;j--){
                                        const item = newArr[j];
                                        if(item.state!==1){
                                            newArr.splice(j,1);
                                        }
                                    }
                                }
                            }
                        }
                        util.responseClient(res,200,0,'操作成功！',data);
                    }).catch(err=>{
                        console.error('err:',err);
                        throw err
                    })
                }else{
                    util.responseClient(res, 200, 1, '文章不存在 ！');
                    return;
                }
                
            }
        }).populate([{path:'tags'},{path:'category'},{path:'comments'}]).exec((err,doc)=>{

        })
    }


}

//更新文章
exports.updateArticle =(req,res)=>{
    const {
        title,
        author,
        keyWord,
        content,
        desc,
        img_url,
        tags,
        category,
        state,
        type,
        origin,
        id
    } = req.body;
    Article.update({_id:id},{
        title,
        author,
        keyWord:keyWord?keyWord.split(','):[],
        content,
        desc,
        img_url,
        tags:tags?tags.split(','):[],
        category:category?category.split(','):[],
        state,
        type,
        origin,
    }).then(result=>{
        util.responseClient(res,200,0,'操作成功',result);
    }).catch(err=>{
        console.error(err)
        util.responseClient(res)
    })
}
//文章删除
exports.delArticle=(req,res)=>{
    let {id} = req.body;
    Article.deleteMany({_id:id}).then(result=>{
        if(result.n===1){
            util.responseClient(res,200,0,'删除成功')
        }else{
            util.responseClient(res,200,1,'文章不存在')
        }
    }).catch(err=>{
        console.err("err：",err);
        util.responseClient(res)
    })
}
//前台文章列表
exports.getArticleListQ = (req,res)=>{
    let keyWord = req.body.keyWord || null;
    let state = req.body.state || '';
    let likes = req.body.likes || '';
    let pageNum = parseInt(req.body.pageNum)||1;
    let pageSize = parseInt(req.body.pageSize)||10;
    let tag_id = req.body.tag_id || '';
    let category_id = req.body.category_id || '';
    let article = req.body.article || '';

    // 如果是文章归档 返回全部文章
    if (article) {
        pageSize = 10000;
    }
    let conditions ={};
    if(!state){
        if(keyWord){
            const reg = new RegExp(keyword, 'i'); //不区分大小写
            conditions = {
              $or: [{ title: { $regex: reg } }, { desc: { $regex: reg } }],
            };

        }
    }else if (state){
        if(keyWord){
            const reg = new RegExp(keyWord,'i');
            conditions = {
                $and:[
                    {$or:[{state:state}]},
                    {$or:[
                        {title:{$regex:reg}},
                        {desc:{$regex:reg}},
                        {keyWord:{$regex:reg}}
                    ]}
                ]
            }
        }else{
            conditions = {state}
        }
    }
    let skip = pageNum-1<0?0:(pageNum-1)*pageSize;
    let responseData = {
        count:0,
        list:[]
    }
    Article.countDocuments({},(err,count)=>{
        if(err){
            console.log('Error:' + err);
        }else{
            responseData.count = count;
            let fields = {
                title: 1,
                desc: 1,
                img_url: 1,
                tags: 1,
                category: 1,
                meta: 1,
                create_time: 1,
            };
            if(article){
                fields = {
                    title : 1,
                    create_time: 1,
                };
            }
            let options = {
                skip:skip,
                limit:pageSize,
                sort:{create_time:-1}
            }
            Article.find(conditions, fields, options, (error, result) => {
                if (err) {
                    console.error('Error:' + error);
                    // throw error;
                } else {
                    let newList =[];
                    if(likes){
                        //根据热度返回文章列表
                        result.sort((a,b)=>{
                            return b.other.likes - a.other.likes;
                        })
                        responseData.list = result 
                    }else if(category_id){
                        //根据前端传的栏目id
                        result.forEach(item => {
                            if(item.category.indexOf(category_id)>-1){
                                newList.push(item)
                            }
                        });
                        let len = newList.length;
                        responseData.count = len;
                        responseData.list =  newList;
                    }else if(tag_id){
                        // 根据标签 id 返回数据
                        result.forEach(item => {
                            if (item.tags.indexOf(tag_id) > -1) {
                            newList.push(item);
                            }
                        });
                        let len = newList.length;
                        responseData.count = len;
                        responseData.list = newList;
                    }else if(article){
                        const archiveList = [];
                        let obj = {}
                        //按年份归档 文章数组
                        result.forEach((e)=>{
                            let year =  e.create_time.getFullYear();
                            if(!obj[year]){
                                obj[year] = [];
                                obj[year].push(e)
                            }else{
                                obj[year].push(e)
                            }
                        })
                        for(const key in obj){
                            if(obj.hasOwnProperty(key)){
                                const element =  obj[key];
                                let item = {}
                                item.year = key
                                item.list = element
                                archiveList.push(item)
                            }
                        } 
                        archiveList.sort((a,b)=>{
                            return b.year-a.year;
                        })
                        responseData.list = archiveList
                    }else{
                        responseData.list  = result
                    }
                    util.responseClient(res,200,0,'操作成功',responseData);
                }
            })
        }
    })
}

//文章点赞
exports.likeArticle = (req,res)=> {
    if(!req.session.userInfo){
        util.responseClient(res,200,1,'您还没登录,或者登录信息已过期，请重新登录！')
        return;
    }
    let {id,user_id}=req.body;
    Article.findOne({_id:id}).then(data=>{
        let fields ={};
        data.other.likes = data.other.likes +1;
        fields.other =  data.other
        let like_Users_arr = data.like_Users_arr.length? data.like_users :[]
        User.findOne({_id:user_id}).then(user=>{
            let new_like_user = {}
            new_like_user.id = user.id;
            new_like_user.name = user.name;
            new_like_user.avatar = user.avatar;
            new_like_user.create_time = user.create_time;
            new_like_user.type = user.type;
            new_like_user.introduce = user.introduce;
            like_users_arr.push(new_like_user);
            fields.like_users = like_users_arr;
            Article.update({_id:id},fields).then(result=>{
                util.responseClient(res,200,0,'操作成功！',result);
            }).catch(err=>{
                console.error('err :', err);
                throw err;
            })
        }).catch(err=>{
            util.responseClient(res)
            console.error('err 1:', err);
        })
    }).catch(err=>{
        util.responseClient(res)
        console.error('err 2:', err);
    })
}

//文章详情根据Type查找

exports.articleDetailType=(req,res)=>{
    let {type} = req.body;
    if(!type){
        util.responseClient(res,200,1,'文章不存在！')
        return
    }
    Article.findOne({type:type},(Error,data)=>{
        if(Error){
            console.error('Error:' + Error);
        }else{
            data.other.views = data.other.views+1
            Article.updateOne({type:type},{other:data.other}).then(result=>{
                responseClient(res, 200, 0, '操作成功 ！', data);
            }).catch(err => {
                console.error('err :', err);
                throw err;
              })
        }
    }).populate([
        { path: 'tags', select: '-_id' },
        { path: 'category', select: '-_id' },
        { path: 'comments', select: '-_id' },
    ]).exec((err, doc) => {
        
    });

}
