const mongoose = require("mongoose");

//define mongoDB connection URL
const mongoURL = "mongodb://localhost:27017/hotels";

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
