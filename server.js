const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const {PORT, DATABASE_URL} = require("./config");
const {Blogpost} = require("./models");

mongoose.Promise = global.Promise;
app.use(bodyParser.json());

app.get("/posts", function (req, res) {
  Blogpost.find()
          .then(posts => {
            // posts is the promise value returned from find().
            // posts is an array of Documents from the Database
            res.json({ // resp w/ JSON object with a `posts` key name
              // call apiRepr method bound to the blogpostSchema in models.js
              // this will return the document in the correct format
              posts: posts.map(post => post.apiRepr())
            });
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
          });
});

app.get("/posts/:id", function (req, res) {
  Blogpost.findById(req.params.id) // returns single Document by id
          // post is the promise value returned from findById().
          // post is a single Document from the Database
          .then(post => res.json(post.apiRepr()))
          .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
          });
});

app.post("/posts", function (req, res) {
  // validation of required fields for creating posts
  let requiredFields = ["title", "content", "author"];
  for (let i = 0; i < requiredFields.length; i++) {
    let field = requiredFields[i];
    if (!(field in req.body)) {
      let message = `Missing \`${field}\` in request body`;
      console.error(message);
      // return breaks out of function
      return res.status(400).send(message);
    }
  }
  
  Blogpost.create({
            title: req.body.title,
            content: req.body.content,
            /* My version is Wrong
            author: { // try to use Virtual method to split author name?
              firstName: req.body.author.split(" ")[0],
              lastName: req.body.author.split(" ")[1]
            }
            */
            author: req.body.author
          })
          .then(post => res.status(201).json(post.apiRepr()))
          .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
          });
});

app.put("/posts/:id", function (req, res) {
  // validate the Id in the request body and route url are the same
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    let message = `Request path id (${req.params.id}) and ` +
                  `request body id (${req.body.id}) must match`;
    console.error(message);
    // return breaks out of function
    return res.status(400).json({message: message});
  }
  //res.send(`PUT request, id: ${req.params.id}`);

  let toUpdate = {};
  let updateableFields = ["title", "content", "author"];

  // any fields that are submitted in the PUT request will be updated
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  // What is $set? What is {new: true}? Not in docs
  Blogpost.findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
          .then(post => res.status(201).json(post.apiRepr()))
          .catch(
            err => res.status(500).json({message: "Internal service error"})
          );
});

app.delete("/posts/:id", function (req, res) {
  Blogpost.findByIdAndRemove(req.params.id)
          .then(() => {
            console.log(`Deleted blog post with id \`${req.params.ID}\``);
            res.status(204).end()
          })
          .catch(
            err => res.status(500).json({message: "Internal service error"})
          );
});

// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

/*
app.listen(PORT, function () {
  console.log(`Your app is listening on ${PORT}`);
});
*/

/***** code below copied from: Node-Restaurants-App-Mongoose *****/

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on("error", err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log("Closing server");
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
