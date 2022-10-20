const userModel = require("../models/userModel.js")
const emailValidator = require('validator')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

exports.user_signup = async (req, res) => {
    try {
        let {
            name,
            email,
            password,
        } = req.body;
        const isValidEmail = emailValidator.isEmail(email)
        if (!isValidEmail) {
            return res.status(400).send({ status: false, msg: " invalid email" })
        }
        const dataExist = await userModel.findOne({ email: email });
        if (dataExist) {
            return res.status(400).send({ message: "email already in use" });
        }
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const userRequest = {
            name,
            email,
            password
        };
        const userData = await userModel.create(userRequest);
        return res
            .status(201)
            .send({ message: "User signup successfully", data: userData });
    } catch (err) {
        return res.status(500).send(err.message);
    }
};



exports.userLogin = async function(req,res){
    try{
        let data =req.body;
        if(Object.keys(data).length==0){
            res.status(400).send({status:false,msg:"kindly pass Some Data"})
        }
        let username = req.body.email;
        let password = req.body.password;

        if(!username){
           return res.status(400).send({ status: false, msg: " Email is required" })
       }

       const isValidEmail = emailValidator.isEmail(username)
       if (!isValidEmail) {
        return res.status(400).send({ status: false, msg: " invalid email" })
   }

   const findUser = await userModel.findOne({ email: username });

   if (!findUser) {
     return res.status(401).send({ status: false, message: `Login failed! email is incorrect.` });
   }

        if (!password){
       return res.status(400).send({ status: false, msg: "Password is required" })
        }

        let encryptedPassword = findUser.password;

        const decryptpassword = await bcrypt.compare(password, encryptedPassword);
    
        if (!decryptpassword) {
          return res.status(401).send({ status: false, message: `Login failed! password is incorrect.` });
        }
        
        
        let token = jwt.sign({
             userId: findUser._id,
            
             
           },"coupon" ,
           
           
           );
           res.setHeader("Authorization",token);
         res.status(201).send({status: true,msg:'success', data: {userId: findUser._id, token}})

   }
   catch (err) {
      res.status(500).send({ Error: err.message })
   }
}
