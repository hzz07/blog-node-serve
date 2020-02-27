const crypto = require('crypto');
// const util = {
//     MD5_fixed = 'hzzGITHUB',
//     md5: function(pwd) {
// 		let md5 = cryptp.createHash('md5');
// 		return md5.update(pwd).digest('hex');
// 	},
//     //返回信息响应格式
//     responseClient ( res , httpCode =500 , code=3 ,message = '服务器异常', data = {} ) {
//         let responseData = {};
//         responseData.code = code;
//         responseData.message = message;
// 		responseData.data = data;
// 		res.status(httpCode).json(responseData);
//     },
//     // 时间 格式化成 2018-12-12 12:12:00
// 	timestampToTime(timestamp) {
		// const date = new Date(timestamp);
		// const Y = date.getFullYear() + '-';
		// const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		// const D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
		// const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
		// const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
		// const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		// return Y + M + D + h + m + s;
// 	},
// }

// module.exports = util;
exports.MD5_fixed = 'hzzGITHUB';
exports.md5 = (pwd) =>{
    let md5 = crypto.createHash('md5');
    return md5.update(pwd).digest('hex');
}
exports.responseClient = ( res , httpCode =500 , code=3 ,message = '服务器异常', data = {})=>{
    let responseData = {};
    responseData.code = code;
    responseData.message = message;
    responseData.data = data;
    res.status(httpCode).json(responseData);
}
exports.timestampToTime =(timestamp)=>{
    const date = new Date(timestamp);
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}