const express = require('express');
const router = express.Router();

const usercontroller = require("../controllers/usercontroller")
const couponController=require("../controllers/couponController")
// const middleware=require("../middleware/auth.js")

//****************** USER API *************************************
router.post("/register",usercontroller.user_signup)
router.post("/login", usercontroller.userLogin)

//***************** COUPON API **************************************
router.post("/couponCreate",couponController.couponCreate)
router.post("/redeemCoupon",couponController.redeemCoupon)
router.post("/cancelCoupon",couponController.cancelCoupon)
router.get("/getCoupon",couponController.getCoupon)
router.get("/getCouponByCode",couponController.getCouponByCode)
//router.put("/updateCoupon",couponController.updateCoupon)
router.delete("/deleteCoupon",couponController.deleteCoupon)

module.exports = router;