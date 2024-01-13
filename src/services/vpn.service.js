const {Vpn}=require('../models')

const connect=(vpnBody)=>{
    // add connection logic
    const {user,location}=vpnBody
    //add Document
    Vpn.create(vpnBody)
}

module.exports={
    connect
}