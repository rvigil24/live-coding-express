const nodemailer = require("nodemailer");

async function sendMail(mailOptions) {
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    service: process.env.MAIL_SERVICE,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_SECRET,
    },
  });

  try {
    const { name, email, message } = mailOptions;
    console.log(email)
    let info = await transporter.sendMail({
      from: `${name} 👻 <${email}>`, // sender address
      sender: email,
      to: "ruben.vigil24@gmail.com", // receiver
      subject: "You got a new message from RT-Coding ✔", // Subject line
      text: message, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (ex) {
    console.log(ex);
  }
}

// sendMail().catch(console.error);

module.exports = sendMail;
