exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL
                        || "mongodb://localhost/blog-app-mongoose";

// for the local url, make sure the database name in the url is the same
// as the database name stored in Mongo
// For example: blog-app-mongoose in Mongo, and
// "mongodb://localhost/blog-app-mongoose" in the url

exports.PORT = process.env.PORT || 8080;