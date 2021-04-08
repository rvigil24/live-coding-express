const { response } = require("express");

/* error list:
10000: "Incorrect username or password"
10001: "Account already registered with facebook"
11000: "Account already registered"
*/

class ErrorHandler extends Error {
  errorMessage;
  constructor({ route, title, messages, data = {} }) {
    super();
    this.route = route;
    this.messages = messages;
    this.title = title;
    this.data = data;
  }
}

const handleError = (err, res) => {
  const { messages, route, title, data } = err;
  const messageArray = messages?.map((msg) => {
    return {
      message: msg,
    };
  });
  res.render(route, {
    status: "error",
    title,
    ...data,
    errors: messageArray,
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};
