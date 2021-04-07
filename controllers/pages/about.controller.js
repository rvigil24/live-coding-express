const index = (req, res, next) => {
  res.render("about", { title: "About" });
};

module.exports = {
  index,
};
