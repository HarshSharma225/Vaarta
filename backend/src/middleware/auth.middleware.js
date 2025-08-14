const jwt = require("jsonwebtoken")
const User = require("../models/User");

async function protectRoute(req,res,next){
    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message: "Token not found"})
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);

        if(!decode) return res.status(401).json({message: "Invalid Token"})

        const user = await User.findById(decode.userId).select("-password");

        if(!user) return res.status(401).json({message: "User Not found"})

        req.user = user;
        
        next();

    } catch (error) {
        console.log("Error in auth middleware:: ", error);
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = {protectRoute}