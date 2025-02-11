const nodemailer = require("nodemailer");
require("dotenv").config();

exports.mailSender = async(email , title , body)=>{

  try{

    let transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
    })

    let mailsended = await transporter.sendMail({
        from:'From Study_notion',
        to:{email},
        subject:{title},
        html:`<h1>Verify your email with these otp ${body}</h1>`
    })

    console.log(mailsended);
    return mailsended;

  }catch(error){
    console.error(error)
  }

}

