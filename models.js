const mongoose = require("mongoose");

const blogpostSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  content: {type: String, required: true}
});

blogpostSchema.methods.apiRepr = function () {
  return {
    title: this.title,
    content: this.content,
    author: this.author.firstName + " " + this.author.lastName,
    created: new Date().getTime()// is this right ???
  };
};

const Blogpost = mongoose.model("Blogpost", blogpostSchema);

module.exports = {Blogpost};