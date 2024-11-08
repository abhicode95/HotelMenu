const express = require("express");
const Person = require("../models/Person");
const router = express.Router();

//post route to add person
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newPerson = new Person(data);
    const savedPerson = await newPerson.save();
    res.status(200).json(savedPerson);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//get route to fetch Data
router.get("/", async (req, res) => {
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
