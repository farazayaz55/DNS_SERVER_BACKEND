const {vpnService}=require('../services')
const catchAsync = require('../utils/catchAsync')
const connect=catchAsync(async(req,res)=>{
    vpnService.connect()
})


module.exports={
    connect
}