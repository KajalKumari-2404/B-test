// const {  } = require("jsonwebtoken")
const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerController = async (req,res) => {
    try {
        const {userName, email, phone, password, address} = req.body

        if(!userName || !email || !phone || !password || !address) {
            return res.status(500).send({
                success:false,
                message:"All fields are not provided"
            })
        }

       const checkUser = await userModel.findOne({email})
       if (!checkUser){
        res.status(404).send({
            success:false,
            message:"User already exists"
        })
       }

       const hashpassword = await bcrypt.hash(password, 10)

       const user = await userModel.create({
        userName,
        password:hashpassword,
        phone,
        email,
        address
       })

      return res.status(200).send({
        success:true,
        message:"user register successfully",
        user
       });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in register user API',
            error
        })
    }
}

const loginController = async (req, res) => {
    try{
    const {email, password} = req.body

    if(!email || !password){
        return res.status(500).send({
            success:false,
            message:"Please provide email or password"
        })
    }

    const user = await userModel.findOne({email})
    if(!user){
        return res.status(404).send({
            success:false,
            message:"User not found"
        })
    }

    const compare = await bcrypt.compare(password,user.password)
    if(!compare){
        return res.status(500).send({
            success:false,
            message:"Invalid credentials"
        })
    }

    const token = jwt.sign({id: user._id},
        process.env.JWT_SECRET,{
            expiresIn:"7d"
        })

        return res.status(200).send({
            success:true,
            message:"Login Successfully",
            token,
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"error in login api",
            error
        })
    }
}


module.exports = {registerController,loginController}