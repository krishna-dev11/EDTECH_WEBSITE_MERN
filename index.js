const express = require("express")
const app = express();

const userRoutes = require("./Routes/User")
const profileRoutes = require("./Routes/Profile")
const paymentRoutes = require("./Routes/Payment")
const courseRoutes = require("./Routes/Course")

const {dbconnect} = require('./config/Database')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const {cloudinaryConnect} = require('./config/Cloudinary')
const fileUpload = require('express-fileupload')
require("dotenv").config();


const PORT = process.env.PORT || 4000;

dbconnect();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials : true
    })
)
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

cloudinaryConnect();

app.use("/api/v1/auth" , userRoutes);
app.use("/api/v1/profile" , profileRoutes);
app.use("/api/v1/course" , courseRoutes);
app.use("/api/v1/payment" , paymentRoutes);


app.get('/' , async(req ,res)=>{
    return res.json({
        success:true,
        message : 'your server is up and running'
    })
});


app.listen(PORT , ()=>{
    console.log(`app listen at port ${PORT}`)
});