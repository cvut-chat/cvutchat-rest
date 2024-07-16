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

router.get('/rooms', asyncHandler(async (req, res) => {
  // const token = req.headers.authorization;
  let data = {
    name: "room1",
    users: ["user1", "user2"]
  };
  res.json(data);
}));

router.get('/rooms/:roomId/messages', asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const messages = [
    {
      _id: 'message1',
      from: 'user1',
      room: roomId,
      content: 'Hello, how are you?',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'message2',
      from: 'user2',
      room: roomId,
      content: 'I am good, thank you!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  res.status(200).json(messages);
}));



// GET /rooms get list of rooms
// POST /rooms create a new room
// GET /rooms/:id get messages history of a room
// POST /rooms/:id send a message to a room


module.exports = router;