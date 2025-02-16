const user = require("../Models/user");
const mailsender = require("../Utilities/mailSender");
const bcrypt = require("bcrypt");

exports.forgotpasswordToken = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(401).json({
        success: false,
        message: "enter email in input box",
      });
    }

    const userexisting = await user.findOne({ email: email });

    if (!userexisting) {
      return res.status(401).json({
        success: false,
        message: `user can not be exist in our database with  email : ${email}`,
      });
    }

    const token = crypto.randomBytes(20).toString("hex");

    const updatedUser = await user.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    );

    const url = `https://localhost:3000/update-password/${token}`;

    await mailsender(
      email,
      "secure link to change your password ",
      `click on these link and change password ${url}`
    );

    return res.status(200).json({
      success: true,
      message: `email sent successfully to the : ${email}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "there would be some error in sending the email to the user's email to change password",
    });
  }
};

// actually  reset password after clicking on the link provided to the authorized email
exports.forgotPassword = async (req, res) => {
  try {
    const { password, confirmedPassword, token } = req.body;

    if (!password || !confirmedPassword || !token) {
      return res.status(401).json({
        success: false,
        message: "fill all details carefully ",
      });
    }

    if (password !== confirmedPassword) {
      return res.status(401).json({
        success: false,
        message: "password and confirmedpassword is different",
      });
    }

    const existingUser = await user.findOne({ token: token });

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    if (existingUser.resetPasswordExpires > Date.now()) {
      return res.status(403).json({
        success: false,
        message: "token was expired send link again",
      });
    }


    const hasedPassword = await bcrypt.hash(password , 10)

    const updatedUser = await user.findOneAndUpdate(
      { token: token },
      { password: hasedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "some error occur on changing the password",
    });
  }
};


