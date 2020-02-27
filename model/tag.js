/*
 * @Author: mikey.hzz 
 * @Date: 2020-01-20 11:30:01 
 * @Last Modified by: mikey.hzz
 * @Last Modified time: 2020-01-22 14:53:45
 */
const {mongoose} = require('../connect/mongoose');
const autoIncrement = require('mongoose-auto-increment');


//标签模型
const tagSchema = new mongoose.Schema({
    //标签名称
    name:{
        type:String,
        require:true,
        validate:/\S+/
    },
    //描述
    desc:String,
    //图标
    icon:String,
    //发布日期
    create_time:{
        type:Date,
        default:Date.now
    },
    //最后修改的日期
    update_time:{
        type:Date,
        default:Date.now
    }

})
//标签模型
module.exports = mongoose.model('Tag',tagSchema)
autoIncrement.initialize(mongoose.connection);
// 自增ID插件配置
tagSchema.plugin(autoIncrement.plugin, {
	model: 'Tag',
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});
