const index = function (req, res) {
  res.render("index", { title: "Home" });
};

module.exports = {
  index,
};
