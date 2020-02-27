/*
 * @Author: mikey.hzz 
 * @Date: 2020-01-13 10:49:29 
 * @Last Modified by: mikey.hzz
 * @Last Modified time: 2020-01-14 09:29:13
 * 用户模块和权限配置模块
 */

 const crypto = require('crypto');
 const {argv} = require('yargs');
 const {mongoose} = require('../connect/mongoose');
 const autoIncrement = require('mongoose-auto-increment');

const adminSchema = new mongoose.Schema({
    //第三方用户登录的 id （github）
    github_id :{type:String,default:''},

    //名字
    name:{type:String,required:true,default:''},

    //用户类型 0：博主，1：其他用户 ，2：github， 3：weixin， 4：qq ( 0，1 是注册的用户； 2，3，4 都是第三方授权登录的用户)
    type: { type: Number, default: 1 },
    //手机
    phone:{ type:Number,default:''},
    
    //封面
    img_url: { type: String, default: '' },

    //邮件
    email:{type:String,default:''},
    //个人介绍
    introduce:{type:String,default:''},
    //头像
    avatar:{type:String,default:'user'},
    //地址
    location:{type:String,default:''},
    //密码
    password:{
        type:String,
        default:crypto.createHash('md5').update(argv.auth_default_password ||'han19951007').digest('hex'),
    },
    // 创建日期
    create_time: { type: Date, default: Date.now },

    // 最后修改日期
    update_time: { type: Date, default: Date.now },
})
module.exports = mongoose.model('User',adminSchema);
autoIncrement.initialize(mongoose.connection);
adminSchema.plugin(autoIncrement.plugin,{
    model: 'User',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
})

