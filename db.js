const mongoose = require("mongoose");
require("dotenv").config();

//define mongoDB connection URL
const mongoURL = process.env.MONGO_URL_LOCAL;
// const mongoURL = process.env.MONGO_URL;
mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB server");
});

db.on("error", (err) => {
  console.log("MongoDB connection error", err);
});

db.on("disconnected", () => {
  console.log("MongoDb disconnected");
});

//export the database connection

module.exports = db;
