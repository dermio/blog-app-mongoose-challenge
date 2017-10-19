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
  //res.send("The app is working. Hello World.");
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
            console.error(error);
            res.status(500).json({message: "Internal server error"});
          });
});

app.get("/posts/:id", function (req, res) {
  res.send(`GET request, id: ${req.params.id}`);
});

app.post("/posts", function (req, res) {
  res.send(`POST request made`);
});

app.put("/posts/:id", function (req, res) {
  res.send(`PUT request, id: ${req.params.id}`);
});

app.delete("/posts/:id", function (req, res) {
  res.send(`DELETE request, id: ${req.params.id}`);
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
      .on('error', err => {
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
       console.log('Closing server');
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
