const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const db = require("./src/config/db");
const PORT = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(cors());

app.post("/add-data", (req, res) => {
  const { Sub1, Sub2, Sub3, Sub4, Sub5, Tot ,Rno } = req.body;
  if (!Sub1 || !Sub2 || !Sub3 || !Sub4 || !Sub5 || !Tot  ||!Rno) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const query = `INSERT INTO info (subject1, subject2, subject3, subject4, subject5, total,rollno) VALUES (?, ?, ?, ?, ?, ?,?)`;
  db.query(query, [Sub1, Sub2, Sub3, Sub4, Sub5, Tot ,Rno], (err) => {
    if (err) {
      console.log("Database Error:", err);
      return res.status(500).json({ error: "Failed to add marks" });
    }
    res.status(200).json({ msg: "Successfully added" });
  });
});

app.get("/fetch-marks", (req, res) => {
  const query = `SELECT * FROM info ORDER BY rollno ASC`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ err: "Failed to fetch the marks" });
    }
    res.status(200).json({ marks: result });
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.delete("/delete-marks/:id", (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM info WHERE ID=?`;
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Marks not deleted" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No record found with this ID" });
    }

    res.status(200).json({ message: "Marks deleted successfully" });
  });
});

app.put("/edit-marks/:id", (req, res) => {
  const id = req.params.id; 
  const { Sub1, Sub2, Sub3, Sub4, Sub5, Tot, Rno } = req.body; 

  if (!Sub1 || !Sub2 || !Sub3 || !Sub4 || !Sub5 || !Tot || !Rno) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `UPDATE info SET subject1 = ?, subject2 = ?, subject3 = ?, subject4 = ?, subject5 = ?, total = ?, rollno = ? WHERE ID = ?`;

  db.query(query, [Sub1, Sub2, Sub3, Sub4, Sub5, Tot, Rno, id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to update marks" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No record found with this ID" });
    }
    res.status(200).json({ message: "Marks updated successfully" });
  });
});

