const errorHandler = (error) => {
  let errorMessage;
  switch (error.code) {
    case 11000:
      errorMessage = { msg: "Account already registered" };
      break;

    default:
      errorMessage = { msg: "Unknown error" };
      break;
  }
  return errorMessage;
};

module.exports = {
  errorHandler,
};
