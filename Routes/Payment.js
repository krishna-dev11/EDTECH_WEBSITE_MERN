const express = require("express")
const router = express.Router();

const {capturePayment , verifySignature} = require('../Controllers/Payment')
// Middleware
const {auth , isStudent , isInstructor , isAdmin} = require("../Middlewares/auth")


router.post('/capturePayment' , auth , isStudent , capturePayment)
router.post('/verifySignature',   verifySignature)

module.exports = router