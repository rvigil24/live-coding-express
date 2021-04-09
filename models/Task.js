const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  content: String,
  users: Object,
  chat: Object,
});

module.exports = mongoose.model("Task", taskSchema);
