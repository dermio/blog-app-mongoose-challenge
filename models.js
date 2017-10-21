const mongoose = require("mongoose");

const blogpostSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  content: {type: String, required: true},
  created: {type: Date, default: Date.now} // Thinkful's code
});

// Thinkful's virtual and apiRepr method solution
blogpostSchema.virtual("authorName").get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogpostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    // I thought about referencing the full name using a Virtual,
    // then using the Virtual inside the apiRepr!!! bleh
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
}

/* Ask Kristen about using a Virtual or Instance Method
blogpostSchema.virtual("fullName")
  .get(function () {
    return this.author.firstName + " " + this.author.lastName;
  })
  .set(function (name) {
    this.author.firstName = name.slice(0, name.indexOf(" "));
    this.author.lastName = name.slice(name.indexOf(" ") + 1);
  });


// My old apiRepr method solution
blogpostSchema.methods.apiRepr = function () {
  return {
    title: this.title,
    content: this.content,
    author: this.author.firstName + " " + this.author.lastName,
    created: Date.now().toString() // is this right ???
  };
};
*/

const Blogpost = mongoose.model("Blogpost", blogpostSchema);

module.exports = {Blogpost};