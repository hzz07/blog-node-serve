/*
 * @Author: mikey.hzz 
 * @Date: 2020-01-10 14:26:11 
 * @Last Modified by: mikey.hzz
 * 文章数据模型
 * @Last Modified time: 2020-01-22 14:56:50
 */
const {mongoose} = require('../connect/mongoose');
const autoIncrement = require('mongoose-auto-increment');

//文章模型

const articleSchema = new mongoose.Schema({
    //文章标题
    title: {
        type: String,
        required: true,
        validate: /\S+/
    },
    //文章关键字
    keyWord: [{
        type: String,
        default: ''
    }],
    //作者
    author: {
        type: String,
        required: true,
        validate: /\S+/
    },
    //文章描述
    desc: {
        type: String,
        default: ''
    },
    //文章内容
    content: {
        type: String,
        required: true,
        validate: /\S+/
    },
    //字數
    textNumbers: {
        type: String,
        default: 0
    },
    //封面圖
    img_url: {
        type: String,
        default: 'http://ww1.sinaimg.cn/large/007UgRf1gy1gaup8hulg2j30dc07iwel.jpg'
    },
    // 文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
    type: {
        type: Number,
        default: 1
    },
    // 文章发布状态 => 0 草稿，1 已发布
    state: {
        type: Number,
        default: 1
    },
    // 文章转载状态 => 0 原创，1 转载，2 混合
    origin: {
        type: Number,
        default: 0
    },
    // 文章标签
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        required: true
    }],
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comment',required:true}],
    //文章分类
    category:[{type:mongoose.Schema.Types.ObjectId,ref:'Category',required:true}],
    //点赞用户
    like_users:[{
        //用户id
        id:{type:mongoose.Schema.Types.ObjectId},
        //名字
        name:{type:mongoose.Schema.Types.ObjectId,default:''},
        //用户类型 0:博主，1：普通用户
        type:{type:Number,default:1 },
        //个人介绍
        introduce:{type:String,default:''},
        //头像
        avator:{type:String,default:'https://hzz07.github.io/assets/blogImg/IMG_2822.GIF'},
        //创建日期
        create_time:{type:Date,default:Date.now},
        
    }],
    // 其他元信息
	other: {
		views: { type: Number, default: 0 },
		likes: { type: Number, default: 0 },
		comments: { type: Number, default: 0 },
    },
    //创建日期
    create_time:{type:Date,default:Date.now},
    //更新时间
    update_time:{type:Date,default:Date.now}

})
module.exports = mongoose.model('Article', articleSchema)
autoIncrement.initialize(mongoose.connection);
//自增id
articleSchema.plugin(autoIncrement.plugin,{
    model: 'Article',
	field: 'id',
	startAt: 1,
	incrementBy: 1,
})
