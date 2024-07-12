const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const dataServiceUrl = 'http://data/api';
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const response = await axios.post(`${dataServiceUrl}/user`, { ...req.body, password: hashedPassword });
    res.status(201).json({ message: "User created successfully", user: { username: response.data.username } });
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const response = await axios.get(`${dataServiceUrl}/user/${req.body.username}`);
    if (await bcrypt.compare(req.body.password, response.data.password)) {
      const token = jwt.sign({ username: response.data.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: "Login successful", token: token });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

module.exports = router;