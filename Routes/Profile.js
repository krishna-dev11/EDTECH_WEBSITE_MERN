const express = require("express")
const router = express.Router();

const {updateProfile , getAllUserDetails , updateDisplayPicture , deleteAccount , getAllEnrolledCourses} = require('../Controllers/Profile')
// Middleware
const {auth , isStudent , isInstructor , isAdmin} = require("../Middlewares/auth")


router.put('/updateProfile' , auth ,  updateProfile)
router.get('/getAllUserDetails' , auth ,  getAllUserDetails)
router.put('/updateDisplayPicture' , auth ,  updateDisplayPicture)
router.delete('/deleteAccount' ,  deleteAccount)
router.get('/getAllEnrolledCourses' , auth ,  getAllEnrolledCourses )


module.exports = router