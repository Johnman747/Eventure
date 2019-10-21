const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

let transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.REACT_APP_EMAIL_USER,
    pass: process.env.REACT_APP_EMAIL_PASS
  }
}

let transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});


router.post('/', (req, res, next) => {
    console.log(req.body);
    let name = req.body.name
    let email = req.body.email
    let message = req.body.message
    let mail = {
      from: 'Hoster',
      to: email,  //Change to email address that you want to receive messages on
      subject: `Hello ${name}`,
      text: `This is your message: ${message}`
    }
  
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        res.json({
          msg: 'fail'
        })
      } else {
        res.json({
          msg: 'success'
        })
      }
    })
  })

  module.exports = router