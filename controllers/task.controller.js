const Task = require("../models/Task");

const create = (req, res, next) => {
  task = new Task();
  task
    .save()
    .then((data) => {})
    .catch((err) => console.log(err));
};
