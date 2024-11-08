const express = require("express");
const app = express();
const PORT = 5000;
const db = require("./db");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

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
