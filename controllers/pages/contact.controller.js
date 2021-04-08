//mailer
const { validationResult } = require("express-validator");
const { ErrorHandler } = require("../../lib/errors");
const sendMail = require("../../lib/email");

const index = (req, res, next) => {
  res.render("contact", { title: "Contact" });
};

const thankYou = (req, res, next) => {
  const { name, email, message } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messageArray = errors.array().map((err) => err.msg);
    return next(
      new ErrorHandler({
        title: "Contact",
        route: "contact",
        messages: messageArray,
        data: {
          name,
          email,
          message,
        },
      })
    );
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
