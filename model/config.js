/*
 * @Author: mikey.hzz 
 * @Date: 2020-01-10 14:26:11 
 * @Last Modified by: mikey.hzz
 * 网站基本信息配置
 * @Last Modified time: 2020-02-27 15:29:23
 */

const {mongoose} = require('../connect/mongoose');
//const autoIncrement = require('mongoose-auto-increment');

const optionSchema = new mongoose.Schema({
	// 网站标题
	title: { type: String, required: true },

	// logo 图片
	logo: { type: String, required: true },

	// 网站副标题
	sub_title: { type: String, required: true },

	// 关键字
	keywords: [{ type: String }],

	// 网站描述
	description: String,

	// 站点地址
	site_url: { type: String, required: true },

	// 网站官邮
	site_email: String,

	// 备案号
	site_icp: String,

	// 搜索引擎 ping
	ping_sites: [{ type: String, validate: /\S+/ }],

	// 其他元信息
	meta: {
		// 被喜欢次数
		likes: { type: Number, default: 0 },
	},
});

module.exports = mongoose.model('Config', optionSchema);