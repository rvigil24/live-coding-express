module.exports = {
  mailer: {
    host: "smtp.gmail.com",
    service: "gmail",
    port: process.env.mail_port || 25,
    auth: {
      user: process.env.mail_user || "john.doe@gmail.com",
      pass: process.env.mail_password || "p@ssw0rd",
    },
  },
};
