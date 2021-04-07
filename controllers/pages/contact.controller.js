//mailer
const { validationResult } = require("express-validator");
const sendMail = require("../../utils/email");

const index = (req, res, next) => {
  res.render("contact", { title: "Contact" });
};

const thankYou = (req, res, next) => {
  const { name, email, message } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("contact", {
      title: "Any suggestion? 👋",
      name,
      email,
      message,
      errors: errors.array(),
    });
  }
  sendMail({ name, email, message });
  return res.render("thanks", {
    title: "Thanks for contacting us!",
  });
};

module.exports = {
  index,
  thankYou,
};
