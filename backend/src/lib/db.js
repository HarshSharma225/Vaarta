const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const connectDB = async()=>{
    try {
        await mongoose.connect(String(process.env.MONGO_URI))
        console.log("DB Connected successfully")
    } catch (error) {
        console.log(`error in connecting db:: `,error)
    }
} 

module.exports = {connectDB}