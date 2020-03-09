/*
 * @Author: mikey.hzz 
 * @Date: 2020-01-20 14:17:31 
 * @Last Modified by: mikey.hzz
 * @Last Modified time: 2020-03-05 09:52:41
 */
const util = require('../utils/util');
const Category = require('../model/category');

//获取全部标签

exports.getCategory= (req, res) => {
    let keyWord = req.body.keyWord || null;
    let pageNum = parseInt(req.body.pageNum) || 1;
    let pageSize = parseInt(req.body.pageSize) || 10;
    let conditions = {};
    if (keyWord) {
        const reg = new RegExp(keyWord, 'i');
        // if(type){
        //   conditions = {
        //     $or : [{name:{$regex:reg}},{desc:{$regex:reg}}],type:type
        //   }
        // }else{
        conditions = {
            $or: [{
                name: {
                    $regex: reg
                }
            }, {
                desc: {
                    $regex: reg
                }
            }]
        }
        //     }
        //   }else{
        //     if(type){
        //       conditions ={
        //         $or : [{type:type}]
        //       }
        //     }
    }
    let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
    let responseData = {
        count: 0,
        list: []
    };
    Category.countDocuments(conditions, (err, count) => {
        if (err) {
            console.error(err)
        } else {
            responseData.count = count;
            let fields = {
                _id:1,
                name:1,
                desc:1,
                create_time: 1 
            }
            let options ={
                skip: skip,
                limit: pageSize,
                sort: { create_time: -1 },
            };
            Category.find(conditions,fields,options,(error,result)=>{
                if(error){
                    console.error('Error:' + error);
                }else{
                    responseData.list = result;
                    util.responseClient(res, 200, 0, 'success', responseData)
                }
            })

        }
    })


}

exports.addCategory = (req,res)=>{
    let {name,desc} = req.body;
    Category.findOne({
        name,
    }).then((result) => {
        if (!result) {
            let category = new Category({
              name,
              desc,
            });
            category
              .save()
              .then(data => {
                util.responseClient(res, 200, 0, '添加成功', data);
              })
              .catch(err => {
                throw err;
              });
          } else {
            util.responseClient(res, 200, 1, '该分类已存在');
          }  
    }).catch((err) => {
        console.error('err :', err);
        util.responseClient(res);
    });
}

exports.delCategory = (req,res) =>{
    let {id} = req.body
    Category.deleteMany({ _id: id })
    .then(result => {
      if (result.n === 1) {
        util.responseClient(res, 200, 0, '操作成功!');
      } else {
        util.responseClient(res, 200, 1, '分类不存在');
      }
    })
    .catch(err => {
      console.error('err :', err);
      util.responseClient(res);
    });
}