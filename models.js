const mongoose = require("mongoose");

const blogpostSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  content: {type: String, required: true}
});

/* Ask Kristen about using a Virtual or Instance Method
blogpostSchema.virtual("fullName").set(function (name) {
  this.author.firstName = name.slice(0, name.indexOf(" "));
  this.author.lastName = name.slice(name.indexOf(" ") + 1);
});
*/

blogpostSchema.methods.apiRepr = function () {
  return {
    title: this.title,
    content: this.content,
    author: this.author.firstName + " " + this.author.lastName,
    created: Date.now().toString() // is this right ???
  };
};

const Blogpost = mongoose.model("Blogpost", blogpostSchema);

module.exports = {Blogpost};