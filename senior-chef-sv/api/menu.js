const express = require('express');
const rt = express.Router();

rt.get("/test", (req, res) => {
  res.json({ message: "Menu API is working!" });
});

rt.post("/cook", (req, res) => {
  // Logic to add a menu item
  console.log(req.body);
  res.json({ message: "Dish is cooking!" });
});

module.exports = rt;