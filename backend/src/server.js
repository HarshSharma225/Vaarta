const express = require("express")
const dotenv = require('dotenv')
const app = express()
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js")
const chatRoutes = require("./routes/chat.routes.js")
const { connectDB } = require("./lib/db.js");
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")

dotenv.config();
const PORT = process.env.PORT

// const __dirname = path.resolve();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/chat",chatRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../../frontend/chat/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../../frontend/chat/dist/index.html"));
    })
}


app.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}.....`)
    connectDB()
})
