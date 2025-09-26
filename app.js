const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from this folder (src/)
app.use(express.static(__dirname));

// In-memory student data
let students = [
  { name: "Rahul", roll: "S101" },
  { name: "Priya", roll: "S102" },
  { name: "Aman", roll: "S103" }
];

// API: get all students
app.get("/students", (req, res) => {
  res.json(students);
});

// API: add student
app.post("/add", (req, res) => {
  const { name, roll } = req.body;
  if (!name || !roll) return res.status(400).json({ message: "Name and Roll required" });

  // avoid duplicate roll
  if (students.some(s => s.roll === roll)) {
    return res.status(409).json({ message: "Roll already exists" });
  }

  students.push({ name, roll });
  res.json({ message: "Student added", students });
});

// API: remove student
app.post("/remove", (req, res) => {
  const { roll } = req.body;
  const idx = students.findIndex(s => s.roll === roll);
  if (idx === -1) return res.status(404).json({ message: "Student not found" });

  const removed = students.splice(idx, 1)[0];
  res.json({ message: `Removed ${removed.name}`, students });
});

// Ensure / serves src/index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});