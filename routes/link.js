const util = require('../utils/util');
const Link = require('../model/link');

//获取全部链接
 exports.getAllLink=(req,res)=>{
     let keyWord = req.body.keyWord || '';
     let type = Number(req.body.type);//1:其他链接 2：博主链接 3：‘’全部链接
     let pageNum = parseInt(req.body.pageNum) || 1;
     let pageSize = parseInt(req.body.pageSize) || 10;
     let conditions ={}
     if(type){
         if(keyWord){
             const reg = new RegExp(keyWord,'i');
             conditions ={
                 $and = [{$or:[{type:type}]},{$or:[{name:{$regex:reg}},{desc:{$regex:reg}}]}]
             }
         }else{
             conditions = {type}
         }
     }else{
         if(keyWord){
             const reg = new RegExp(keyWord,'i')
             conditions = {$or:[{name:{$regex:reg}},{desc:{$regex:reg}}]};
         }
     }
     let skip = pageNum - 1 <0 ? 0 : (pageNum -1)*pageSize;
     let responseData = {
         count :0,
         list:[]
     }
     Link.countDocuments(conditions,(err,count)=>{
        if(err){
            console.error('Error',err)
        }else{
            responseData.count = count;
            let fileds ={
                _id:1,
                name:1,
                icon:1,
                url:1
            };
            let options={
                skip:skip,
                limit:limit,
                sort:{create_time:-1}
            }
            Link.find(conditions,fileds,options,(error,result)=>{
                if(err){
                    console.error('Error:'+error)
                }else{
                    responseData.list = result
                    util.responseClient(res,200,0,'success',responseData);

                }
            })
        }
     })
 }

 exports.addLink = (req,res)=>{
     let {name , desc,icon,url,type} = req.body;
     Link.findOne({
         name
     }).then((result) => {
        if(!result){
            let link = new Link({
                name,
                desc,
                icon,
                url,
                type
            })
            link.save().then(data=>{
                util.responseClient(res,200,0,'添加成功',data)
            }).catch(err=>{
                throw err
            })
        } 
     }).catch((err) => {
         util.responseClient(res)
     });
 }

 exports.updateLink = (req,res)=>{
     const {state,id} = req.body;
     Link.update(
         {_id:id},
         {state}
     ).then(result=>{
         util.responseClient(res,200,0,'操作成功',result);
     }).catch(err=>{
         console.error(err)
         util.responseClient(res)
     })
 }
 exports.delLink=(req,res)=>{
     let {id} = req.body
     Link.deletMany({_id:id}).then(
         result =>{
             if(result.n ===1){
                util.responseClient(res, 200, 0, '删除成功!')
             }else{
                util.responseClient(res, 200, 1, '标签不存在')
             }
         }
     ).catch(err=>{
        console.error(err);
        util.responseClient(res);
     })
 }