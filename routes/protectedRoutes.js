// TODO Use then catch everywere
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const axios = require('axios');

// GET /weather get weather
router.get('/weather', asyncHandler(async (req, res) => {
  const { location } = req.query;
  const response = await axios.get(`http://weather/weather?location=${location}`);
  res.status(200).json(response.data);
}));

// POST /users create a new user
router.get('/users/me', asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  const decodedToken = await axios.get('http://auth/api/verifyToken', {
    headers: {
      Authorization: token
    }
  });
  const id = decodedToken.data.user.id;
  // TODO No need for token since we already verified it
  const response = await axios.get(`http://data/api/users/${id}`, {
    headers: {
      Authorization: token
    }
  });
  res.status(200).json(response.data);
}));

// GET /users/:usersId get users by id
// TODO Wont work with multiple ids for now
router.get('/users/:usersId', asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  let usersId = req.params.usersId;
  const response = await axios.get(`http://data/api/users/${usersId}`, {
    headers: {
      Authorization: token
    }
  });
  res.status(200).json(response.data);
}));

// POST /rooms create a new room
router.post('/rooms', asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  const response = await axios.post('http://data/api/rooms', req.body, {
    headers: {
      Authorization: token
    }
  });
  res.status(201).json(response.data);
}));

// GET /rooms get list of rooms
router.get('/rooms', asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  let response = axios.get('http://data/api/rooms', {
    headers: {
      Authorization: token
    }
  }).then(response => {
    res.status(200).json(response.data);
  }).catch(error => {
    res.status(400).json({ message: error.message });
  });
}));

// TODO POST /rooms/:roomId/messages/send send a message to a room
router.post('/rooms/:roomId/messages/send', asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { data } = req.body;
  const token = req.headers.authorization;
    const responseSocket = await axios.post(`http://socket/api/rooms/${roomId}/messages/send`, data, {
      headers: {
        Authorization: token
      }
    });
    const response = await axios.post(`http://data/api/rooms/${roomId}/messages/send`, data, {
      headers: {
        Authorization: token
      }
    });

  if (responseSocket.status === 200 && response.status === 200) {
    res.status(200).json({success: true});
  } else {
    res.status(200).json({success: false});
  }
}));

// TODO GET /rooms/:roomId/messages get messages history of a room
router.get('/rooms/:roomId/messages', asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const token = req.headers.authorization;
  const response = await axios.get(`http://data/api/rooms/${roomId}/messages`, {
    headers: {
      Authorization: token
    }
  });

  res.status(200).json(response.data);
}));


module.exports = router;