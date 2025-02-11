const user = require("../Models/user");
const OTP = require("../Models/otpSchema");
const bcrypt = require("bcrypt");
const profile = require("../Models/profile");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");

// send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(401).json({
        success: false,
        message: "enter the email",
      });
    }

    const result = await user.findOne({ email: email });

    if (result) {
      return res.status(401).json({
        success: false,
        message:
          "you are already exist in our database so go to login page and make login",
      });
    }

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const sameOtpPresent = await OTP.findOne({ otp: otp });

    while (sameOtpPresent) {
      otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      sameOtpPresent = await OTP.findOne({ otp: otp });
    }

    const updateOTP = await OTP.create({ email, otp });

    res.status(200).json({
      success: true,
      message: "entery of otp successfully created in database",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "there should be some error in sending the otp to the user's email",
    });
  }
};

// signUP
exports.signUP = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      contactNO,
      accountType,
      additionalDetails,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !contactNO ||
      !accountType ||
      !additionalDetails ||
      !otp
    ) {
      return res.status(401).json({
        success: false,
        message: "enter all details in signUp form carefully",
      });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "password and confirmedPassword can't matched",
      });
    }

    const checkUser = await user.findOne({ email: email });

    if (checkUser) {
      return res.status(401).json({
        success: false,
        message:
          "you are already register with these email on our plateform go through the login page or start signUp with another email address",
      });
    }

    const recentOtp = await OTP.findOne({ email: email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (recentOtp.opt.length == 0) {
      return res.status(401).json({
        success: false,
        message: "OTP is not Found",
      });
    } else if (recentOtp.otp != otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is Invalid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const createUser = await user.create({
      firstName,
      lastName,
      email,
      accountType,
      contactNO,
      password: hashedPassword,
      imageUrl: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
      additionalDetails: profileDetails._id,
    });

    return res.status(200).json({
      success: true,
      data: createUser,
      message: "user signUp successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "user signUp request fails",
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "fill all required details in login form",
      });
    }

    const User = await user.findOne({ email: email });

    if (!User) {
      return res.status(401).json({
        success: false,
        message:
          "user can't be registerd in our database with these email Address so go though with signUp",
      });
    }

    if (await bcrypt.compare(User.password, password)) {
      const payload = {
        email: User.email,
        id: User_id,
        accountType: User.accountType,
      };
      const options = {
        expiresIn: "2h",
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, options);

      User.token = token;
      User.password = undefined;

      const cookieOptions = {
        expires: Date.now(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };
      res.cookie("token", token, cookieOptions).status(200).json({
        success: true,
        token,
        User,
        message: "User Logged in Successfully",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Password is Incorrect",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `user login request hai due to some error : ${error}`,
    });
  }
};


// changed password
exports.changePassword = async(req , res)=>{
    try{
       
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'there would be some error in changing the password in database'
        })
    }
}