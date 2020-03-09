const util = require('../utils/util');
const TimeAxis = require('../model/timeAxis');

//获取全部时间轴列表
exports.getTimeAxisList = (req,res)=>{
    let keyWord =  req.query.keyWord || null;
    let state = req.query.state ||'';
    let pageNum = parseInt(req.query.pageNum) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    let conditions = {}
    if(!state){
        if(keyWord){
            const reg = new RegExp(keyWord,'i');//不区分大小写
            conditions ={
                $or:[{title:{$regex:reg}},{content:{$regex:reg}}]
            }
        }
    }else if(state){
        state = parseInt(state)
        if(keyWord){
            const reg = new RegExp(keyWord,'i');
            conditions={
                $and:[
                    {$or:[{state:state}]},
                    {$or:[{title:{$regex:reg}},{content:{$regex:reg}}]},
                ]
            }
        }else{
            conditions = {state}
        }
    }
    let skip = pageNum -1<0?0 : (pageNum-1)*pageSize;
    let responseData = {
        count:0,
        list:[]
    }
    TimeAxis.countDocuments({},(err,count)=>{
        if(err){
            console.error('Error:'+err);
            
        }else{
            responseData.count = count;
            let fileds = {
                title:1,
                content:1,
                state:1,
                start_time:1,
                end_time:1
            };
            let options = {
                skip:skip,
                limit:pageSize,
                sort:{end_time:-1}
            }
            TimeAxis.find(conditions,fileds,options,(error,result)=>{
                if(err){
                    console.error('Error:'+error)
                }else{
                    responseData.list =  result;
                    util.responseClient(res,200,0,'操作成功',responseData)
                }
            })


        }
    })

}

exports.addTimeAxis = (req,res)=>{
    let {title,state,content,start_time,end_time} =  req.body;
    TimeAxis.findOne({title}).then((result) => {
        if(!result){
            let timeAxis = new TimeAxis({
                title,
                state,
                content,
                start_time,
                end_time
            })
            timeAxis.save().then((data) => {
                util.responseClient(res, 200, 0, '操作成功！', data)
            }).catch((err) => {
                console.error('err :', err);    
            });
        }else{
            util.responseClient(res, 200, 1, '该时间轴内容已存在');
        }
    }).catch((error) => {
        console.error('error :', error);
        util.responseClient(res);
    });
}

exports.updateTimeAxis = (req,res)=>{
    let {id,title,state,content,start_time,end_time} = req.body;
    TimeAxis.updateOne(
        {_id:id},
        {
            title,
            state:Number(state),
            content,
            start_time,
            end_time,
            update_time:new Date()
        }
    ).then((result) => {
        // console.log(result);
        util.responseClient(res, 200, 0, '操作成功', result);   
    }).catch((err) => {
        console.error('err:', err);
        util.responseClient(res);
    });
}

exports.delTimeAxis = (req,res)=>{
    let {id} = req.body;
    TimeAxis.deleteMany({_id:id}).then( result =>{
        // console.log('result :', result)
      if (result.n === 1) {
        util.responseClient(res, 200, 0, '操作成功!');
      } else {
        util.responseClient(res, 200, 1, '时间轴内容不存在');
      }
    }).catch(err=>{
        console.error('err :', err);
        util.responseClient(res);
    })
}

// 详情
exports.getTimeAxisDetail = (req, res) => {
    let { id } = req.body;
    TimeAxis.findOne({ _id: id })
      .then(data => {
        util.responseClient(res, 200, 0, '操作成功！', data);
      })
      .catch(err => {
        console.error('err :', err);
        util.responseClient(res);
      });
  };