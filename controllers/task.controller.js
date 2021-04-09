const Task = require("../models/Task");
const { ErrorHandler } = require("../lib/errors");

const all = (req, res, next) => {
  res.render("task", {
    title: "Tasks",
    tasks: [1, 2, 3],
  });
};

const create = (req, res, next) => {
  task = new Task();
  task
    .save()
    .then((data) => {
      res.redirect(`/task/${data._id}`);
    })
    .catch((err) =>
      next(
        new ErrorHandler({
          title: "Home",
          route: "",
          messages: err.message,
          data: {
            name,
            email,
            password,
          },
        })
      )
    );
};

const findOne = async (req, res, next) => {
  if (req.params.id) {
    const { id } = req.params;
    try {
      const task = await Task.findOne({ _id: id }).exec();
      if (!task) {
        return next(
          new ErrorHandler({
            title: "Tasks",
            route: "task",
            messages: ["Task not found"],
          })
        );
      }
      const { content } = task;
      return res.render("task", {
        title: "Task",
        roomId: task._id,
        content,
      });
    } catch (ex) {
      return next(
        new ErrorHandler({
          title: "Home",
          route: "",
          messages: ["Task not found"],
        })
      );
    }
  }
  return next(
    new ErrorHandler({
      title: "Home",
      route: "",
      messages: ["Task not found"],
    })
  );
};

module.exports = {
  create,
  findOne,
  all,
};
