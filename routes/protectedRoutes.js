const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const axios = require('axios');

router.get('/weather', asyncHandler(async (req, res) => {
  const { location } = req.query;
  const response = await axios.get(`http://weather/weather?location=${location}`);
  res.json(response.data);
}));

// /users, get a batch of users
router.get('/users', asyncHandler(async (req, res) => {
  const response = await axios.get('http://users/users');
  res.json(response.data);
}));

// /users/me get the current user
router.get('/users/me', asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  const response = await axios.get('http://auth/me', {
    headers: {
      Authorization: token
    }
  });
  res.json(response.data);
}));

// GET /rooms get list of rooms
// POST /rooms create a new room
// GET /rooms/:id get messages history of a room
// POST /rooms/:id send a message to a room


module.exports = router;