const express = require("express");
const Person = require("../models/Person");
const router = express.Router();

const { jwtAuthMiddleware, generateToken } = require("./../jwt");

// POST route to add a person
router.post("/signup", async (req, res) => {
  try {
    const data = req.body; // Assuming the request body contains the person data

    // Create a new Person document using the Mongoose model
    const newPerson = new Person(data);

    // Save the new person to the database
    const response = await newPerson.save();
    console.log("data saved");

    const payload = {
      id: response.id,
      username: response.username,
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Token is : ", token);

    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Login Route

router.post("/login", async (req, res) => {
  try {
    //extract username and password from request body
    const { username, password } = req.body;

    //find the user by username
    const user = await Person.findOne({ username: username });

    //If user does not exist or password does not match, return error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    //generate Token
    const payload = {
      id: user.id,
      username: user.username,
    };

    const token = generateToken(payload);
    //return token as response
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Profile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    console.log("User Data: ", userData);

    const userId = userData.id;
    const user = await Person.findById(userId);

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get route to fetch Data
router.get("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const savedPerson = await Person.find();
    res.status(200).json(savedPerson);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//parametrized url

router.get("/:workType", async (req, res) => {
  try {
    const workType = req.params.workType;
    if (
      workType === "chef" ||
      workType === "manager" ||
      workType === "waiter"
    ) {
      const response = await Person.find({ work: workType });
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//update person data using put

router.put("/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    console.log("personId", personId);
    const updatedPersonData = req.body;
    const response = await Person.findByIdAndUpdate(
      personId,
      updatedPersonData,
      { new: true, runValidators: true }
    );

    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete using id

router.delete("/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const response = await Person.findByIdAndDelete(personId);
    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.status(200).json({ message: "Person deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
