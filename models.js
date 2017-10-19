const mongoose = require("mongoose");

const blogpostSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  content: {type: String, required: true},
});

const Blogpost = mongoose.model("Blogpost", blogpostSchema);

module.exports = {Blogpost};