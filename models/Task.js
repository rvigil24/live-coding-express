const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  content: String,
});

module.exports = mongoose.model("Task", taskSchema);
