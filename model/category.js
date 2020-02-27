/*
 * @Author: mikey.hzz 
 * @Date: 2020-01-20 13:55:04 
 * @Last Modified by: mikey.hzz
 * @Last Modified time: 2020-01-22 14:53:15
 */
const {mongoose} = require('../connect/mongoose');
const autoIncrement = require('mongoose-auto-increment');

// 分类集合模型
const categorySchema = new mongoose.Schema({
	// 分类名称
	name: { type: String, required: true, validate: /\S+/ },

	// 分类描述
	desc: { type: String, default: '' },

	// 创建日期
	create_time: { type: Date, default: Date.now },

	// 最后修改日期
	update_time: { type: Date, default: Date.now },
});




// 分类集合模型
module.exports = mongoose.model('Category', categorySchema);
autoIncrement.initialize(mongoose.connection);
//自增 ID 插件配置
categorySchema.plugin(autoIncrement.plugin, {
	model: 'Category',
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});