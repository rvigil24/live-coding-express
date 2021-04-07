const nodemailer = require("nodemailer");
const config = require("../config");

async function sendMail(mailOptions) {
  let transporter = nodemailer.createTransport({
    host: config.mailer.host,
    service: config.mailer.service,
    port: config.mailer.port,
    secure: false,
    auth: {
      user: config.mailer.auth.user,
      pass: config.mailer.auth.pass,
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
