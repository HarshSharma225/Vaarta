const User = require("../models/User")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const cookie = require("cookie-parser");
const { upsertStreamUser } = require("../lib/stream");

dotenv.config();


async function signup(req,res){
    const {fullName,email,password} = req.body

    try {
        if(!email,!password,!fullName) return res.status(400).json({message: "All fields are required"})

        if(password.length < 8) return res.status(400).json({message: "Password must be at least 8 characters long"})

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: "Email already exists, please use a diffrent email" });
        }

        const i = Math.floor(Math.random()*100)+1;
        const avatar = `https://avatar.iran.liara.run/public/${i}.png`

        const newUser = new User({
            fullName,
            email,
            password,
            profilePic: avatar,
        })
        await newUser.save();

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.fullName}`)
        } catch (error) {
            console.log("Error creating Stream user",error)
        }

        

        const token = jwt.sign({userId: newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn: "7d"
        })

        res.cookie("jwt",token,{
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({success: true, user: newUser})

    } catch (error) {
        console.log("Error in signup:: ",error)
    }
}
async function login(req,res){
    try {
        const {email,password} = req.body

        if(!email || !password) return res.status(400).json({message: "All fields are required"})

        const userdetails =await User.findOne({email});
        if(!userdetails) return  res.status(404).json({message: "Invalid credentials"})

        const check = await userdetails.checkPassword(password)
        if(!check) return res.status(404).json({message: "Invalid credentials"})

        const token = jwt.sign({userId: userdetails._id},process.env.JWT_SECRET_KEY,{
            expiresIn: "7d"
        })

        res.cookie("jwt",token,{
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({success:true,userdetails})

    } catch (error) {
        console.log("Error in login function:: ",error)
    }
}
function logout(req,res){
    res.clearCookie("jwt")
    res.status(200).json({success: true,message: "Logout Successful"})
}

async function onboard(req,res){
    try {
        const userId = req.user._id;

        const {fullName,bio,nativeLanguage, learningLanguage, location} = req.body

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded: true,
        },{new: true})

        if(!updatedUser) return res.status(404).json({message: "User not found"})
        
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            })
            console.log(`Stream User updated after onboarding for ${updatedUser.fullName}`);
        } catch (streamError) {
            console.log("Error updating Stream user during onboarding:: ",streamError)
        }
        
        res.status(200).json({success: true, user: updatedUser});
    } catch (error) {
        console.log("Onboarding Error:: ",error)
    }
}

module.exports = {signup,login,logout,onboard}