const couponModel = require("../models/couponModel.js");
const router = require("../route/route.js");

exports.couponCreate = async (req, res) => {
    try {
    let {
        couponCode,
        issueDate,
        expirationDate,
        redeemedDate,
        cancellationDate,
        value,
        unit,
        title,
        body,
        user
    } = req.body;

    const couponRequest = {
        couponCode,
        issueDate,
        expirationDate,
        redeemedDate,
        cancellationDate,
        value,
        unit,
        title,
        body,
        user
    };
    const couponData = await couponModel.create(couponRequest);
    return res
        .status(201)
        .send({ message: "coupon created successfully", data: couponData });
} catch (err) {
    return res.status(500).send(err.message);
}
};

exports.redeemCoupon = async (req, res) => {
try{
    const couponCode=req.body.couponCode
    const couponData = await couponModel.findOne({couponCode:couponCode,isDeleted:false})
    if(!couponData){
        return res.status(400).send({status:false,msg:"coupon not found"})
    }
    if(couponData.redeemedDate){
        return res.status(400).send({status:false,msg:"coupon already redeemed"})
    }
    if(couponData.cancellationDate){
        return res.status(400).send({status:false,msg:"coupon already cancelled"})
    }
    if(couponData.expirationDate<Date.now()){
        return res.status(400).send({status:false,msg:"coupon expired"})
    }
    const redeemDate = new Date()
    const updateData = await couponModel.updateOne({couponCode:couponCode},{redeemedDate:redeemDate},{new:true})
    return res.status(200).send({status:true,msg:"coupon redeemed successfully",data:updateData})
}
catch(err){
    return res.status(500).send(err.message);
}
};

exports.cancelCoupon = async (req, res) => {
try{
    const couponCode=req.body.couponCode
    const couponData = await couponModel.findOne({couponCode:couponCode})
    if(!couponData){
        return res.status(400).send({status:false,msg:"coupon not found"})
    }
    if(couponData.redeemedDate){
        return res.status(400).send({status:false,msg:"coupon already redeemed"})
    }
    if(couponData.cancellationDate){
        return res.status(400).send({status:false,msg:"coupon already cancelled"})
    }
    const cancellationDate = new Date()
    const updateData = await couponModel.updateOne({couponCode:couponCode},{cancellationDate:cancellationDate},{new:true})
    return res.status(200).send({status:true,msg:"coupon cancelled successfully",data:updateData})
}
catch(err){
    return res.status(500).send(err.message);
}
}

exports.getCoupon = async (req, res) => {
try{
    const countCoupon = await couponModel.find().count()
    const couponData = await couponModel.find()
    if(!couponData){
        return res.status(400).send({status:false,msg:"coupon not found"})
    }
    return res.status(200).send({status:true,msg:"coupon found",count:countCoupon,data:couponData})
}
catch(err){
    return res.status(500).send(err.message);
}
}

exports.getCouponByCode = async (req, res) => {
try{
    const couponCode=req.body.couponCode
    const couponCount = await couponModel.find({couponCode:couponCode}).count()
    const couponData = await couponModel.find({couponCode:couponCode})
    if(!couponData){
        return res.status(400).send({status:false,msg:"coupon not found"})
    }
    return res.status(200).send({status:true,msg:"coupon found",count:couponCount,data:couponData})
}
catch(err){
    return res.status(500).send(err.message);
}
}

exports.deleteCoupon = async (req, res) => {
try{
    const couponCode=req.body.couponCode
    const checkCoupon = await couponModel.find({couponCode:couponCode });
    if (checkCoupon) {
        const cupon = await couponModel.updateOne({ couponCode:couponCode, isDeleted: false }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });
        res.status(200).send({ msg: "Coupon deleted successfully", data: cupon });
    } else {
        res.status(400).send({ error: 'Coupon not found' });
    }
} catch (err) {
    return res.status(500).send(err.message);
}
}
