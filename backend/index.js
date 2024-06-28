const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 

const app = express();
const port = 3000;
require("dotenv").config();

// Middleware
app.use(cors()); // Use this to allow cross-origin requests
app.use(express.json()); 

// MongoDB connection string
const dbUri = process.env.MONGO_URI;

mongoose
  .connect(dbUri)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Define a schema for the quiz questions
const questionSchema = new mongoose.Schema(
  {
    question: String,
    options: [String],
    answer: Number, 
  },
  { collection: "questions" },
);

// Create a model from the schema
const Question = mongoose.model("Question", questionSchema);

// Routes
// GET all questions
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    console.log(questions);
    res.json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err.message);
    res.status(500).json({ message: err.message });
  }
});



app.post("/api/questions", async (req, res) => {
  const question = new Question({
    question: req.body.question,
    options: req.body.options,
    answer: req.body.answer,
  });

  try {
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Quiz API listening at http://0.0.0.0:${port}`);
});
