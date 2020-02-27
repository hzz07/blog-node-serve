/*
 * @Author: mikey.hzz 
 * @Date: 2020-01-10 14:22:39 
 * @Last Modified by:   mikey.hzz 
 * @Last Modified time: 2020-01-10 14:22:39 
 */

 const {argv } = require('yargs');
 const path = require('path');
 exports.MONGODB  =  {
    uri:`mongodb://127.0.0.1:${argv.dbport||'27017'}/blogNode`,
    username: argv.db_username || 'DB_username',
	password: argv.db_password || 'DB_password',
 }