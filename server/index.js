const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

// Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/studentDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Define a schema and model
const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    event: String,
});
const Student = mongoose.model("Student", studentSchema);

// API endpoint to handle registration
app.post("/register", async (req, res) => {
    const { name, email, event } = req.body;

    // Validation
    if (!name || name.length < 3 || name.length > 50) {
        return res.status(400).json({ message: "Name must be 3-50 characters long." });
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email || !emailPattern.test(email)) {
        return res.status(400).json({ message: "Invalid email address." });
    }

    const validEvents = ["Hackathon", "Coding Bootcamp", "AI Workshop", "Web Development"];
    if (!event || !validEvents.includes(event)) {
        return res.status(400).json({ message: "Invalid event selected." });
    }

    // Save to database if validation passes
    try {
        const newStudent = new Student({ name, email, event });
        await newStudent.save();
        res.status(201).json({ message: "Registration successful!" });
    } catch (err) {
        res.status(500).json({ message: "Error registering student.", error: err.message });
    }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
