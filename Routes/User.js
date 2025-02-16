const express = require("express")
const router = express.Router();


const {forgotpasswordToken , forgotPassword} = require('../Controllers/resetPassword')
const {sendOTP , signUP , login , changePassword} = require('../Controllers/Auth')
// Middleware
const {auth , isStudent , isInstructor , isAdmin} = require("../Middlewares/auth")

// Forgot Password
router.post('/forgotpasswordToken' ,  forgotpasswordToken )
router.post('/forgotPassword' ,  forgotPassword)

// Auth Routes
router.post('/sendOTP' , auth ,  sendOTP)
router.post('/signUP' , signUP)
router.post('/login' , login)
router.post('/changePassword' , auth ,  changePassword)


module.exports = router