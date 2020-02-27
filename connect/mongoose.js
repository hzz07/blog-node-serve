/**
 * @Description: 链接数据库
 * @author hzz
 * @date 2020/1/9
*/
const consola = require('consola');
const mongoose = require('mongoose');
const CONFIG = require('../config.app.js')
const autoIncrement = require('mongoose-auto-increment');

// 
mongoose.set('useFindAndModify',false)

exports.mongoose = global.Promise;

exports.mongoose = mongoose;

exports.connet = () =>{
    mongoose.connect(CONFIG.MONGODB.uri,{
        useCreateIndex: true,
		useNewUrlParser: true,
		promiseLibrary: global.Promise
    })
    mongoose.connection.on('error',error =>{
        consola.warn('数据库连接失败!', error)
    })
    mongoose.connection.on('open',()=>{
        consola.ready('数据库连接成功!')
    })
    // 自增 ID 初始化
    autoIncrement.initialize(mongoose.connection)
    //返回实例
    return mongoose
}














