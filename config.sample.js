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
  db: {
    connString:
      process.env.db_connection || "mongodb:://127.0.0.1:27017/rt-coding",
  },
  sessionKey: process.env.session_key || "$3cR3t",
  facebook: {
    id: process.env.facebook_id || "",
    secret: process.env.facebook_secret || "",
  },
};
