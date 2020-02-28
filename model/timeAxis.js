/*
 * @Author: mikey.hzz 
 * @Date: 2020-01-10 14:26:11 
 * @Last Modified by: mikey.hzz
 * 时间轴模型
 * @Last Modified time: 2020-02-27 15:55:13
 */

const { mongoose } = require('../connect/mongoose');
const autoIncrement = require('mongoose-auto-increment');

// 时间轴模型
const timeAxisSchema = new mongoose.Schema({
	// 标题
	title: { type: String, required: true },

	// 时间轴内容
	content: { type: String, required: true },

	// 状态 1 是已经完成 ，2 是正在进行，3 是没完成
	state: { type: Number, default: 1 },

	// 开始日期
	start_time: { type: Date, default: Date.now },

	// 结束日期
	end_time: { type: Date, default: Date.now },

	// 最后修改日期
	update_time: { type: Date, default: Date.now },
});

// 自增ID插件配置
timeAxisSchema.plugin(autoIncrement.plugin, {
	model: 'TimeAxis',
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

// 时间轴模型
module.exports = mongoose.model('TimeAxis', timeAxisSchema);