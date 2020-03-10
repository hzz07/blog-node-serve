/*
 * @Author: mikey.hzz 
 * @Date: 2020-01-10 14:26:11 
 * @Last Modified by: mikey.hzz
 * 留言数据模型
 * @Last Modified time: 2020-03-09 11:06:16
 */

 const { mongoose } = require('../connect/mongoose');
 const autoIncrement = require('mongoose-auto-increment');

 //留言模型
 const messageSchema = new mongoose.Schema({
     //用户id
     user_id:{type:String,default:''},
     //姓名
     name:{type:String,default:''},
     //头像
     avator:{type:String,default:'user'},
     //电话
     phone:{type:String,default:''},
     //介绍
     introduce:{type:String,default:''},
     //留言内容
     content:{type:String,default:''},
     //回复留言
     reply_list:[{
        content: { type: String, required: true },
     }],
     //邮箱
     email:{type:String,default:''},
     //状态 0 是未处理 ， 1是已处理
     state:{type:Number,default:0},
     //创建日期
     create_time:{type:Date,default:Date.now},
     //最后更新日期
     update_time:{type:Date,default:Date.now},
 })

 //自增ID插件配置
 messageSchema.plugin(autoIncrement.plugin,{
    model: 'Message',
	field: 'id',
	startAt: 1,
	incrementBy: 1,
 })

 module.exports = mongoose.model('Message',messageSchema)