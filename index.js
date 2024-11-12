const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const db = require("./db");
const passport = require("./auth");
require("dotenv").config();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//middleware function
// const logRequest = (req, res, next) => {
//   console.log(
//     `${new Date().toLocaleString()} request made to ${req.originalUrl}`
//   );
//   next();
// };

// app.use(logRequest);

app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate("local", { session: false });

app.get("/", (req, res) => {
  res.send("Welcome to my Hotel");
});

//import router files
const personRoutes = require("./routes/personRoutes");

//use the routers
app.use("/person", personRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening at PORT ${PORT}`);
});
