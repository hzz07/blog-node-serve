const util = require('../utils/util');
const Tag = require('../model/tag');

//获取全部标签

exports.getTagList = (req, res) => {
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
    Tag.countDocuments(conditions, (err, count) => {
        if (err) {
            console.error(err)
        } else {
            responseData.count = count;
            let fields = {
                _id:1,
                name:1
            }
            let options ={
                skip: skip,
                limit: pageSize,
                sort: { create_time: -1 },
            };
            Tag.find(conditions,fields,options,(error,result)=>{
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

exports.delTag =(req, res)=>{
    let { id } = req.body;
  Tag.deleteMany({ _id: id })
    .then(result => {
      if (result.n === 1) {
        responseClient(res, 200, 0, '删除成功!');
      } else {
        responseClient(res, 200, 1, '标签不存在');
      }
    })
    .catch(err => {
      responseClient(res);
    });
}

exports.addTag = (req,res)=>{
    let {name,desc} =req.body;
    Tag.findOne({name}).then(result=>{
        if(!result){
            let tag = new Tag({
                name,
                desc
            })
            tag.save().then(data=>{
                util.responseClient(res,200,0,'添加成功',data);
            }).catch(err=>{
                throw err
            })
        }else{
            util.responseClient(res,200,1,'该标签已存在')
        }
    }).catch(err =>{
        util.responseClient(res)
    })
}
exports.delTag = (req, res) => {
    let { id } = req.body;
    Tag.deleteMany({ _id: id })
      .then(result => {
        if (result.n === 1) {
            util.responseClient(res, 200, 0, '删除成功!');
        } else {
            util.responseClient(res, 200, 1, '标签不存在');
        }
      })
      .catch(err => {
        util.responseClient(res);
      });
  };