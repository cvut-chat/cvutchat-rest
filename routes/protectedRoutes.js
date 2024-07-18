const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const axios = require('axios');

router.get('/weather', asyncHandler(async (req, res) => {
  const { location } = req.query;
  const response = await axios.get(`http://weather/weather?location=${location}`);
  res.status(200).json(response.data);
}));

// /users/me get the current user
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

// /users, get a batch of users
router.get('/users/:userId', asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  let userId = req.params.userId;
  const response = await axios.get(`http://data/api/users/${userId}`, {
    headers: {
      Authorization: token
    }
  });
  res.status(200).json(response.data);
}));


router.get('/rooms', asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  let response = axios.get('http://data/api/rooms', {
    headers: {
      Authorization: token
    }
  });
  // let data = {
  //   name: "room1",
  //   users: ["user1", "user2"]
  // };
  res.status(200).json(response.data);
}));

router.get('/rooms/:roomId/messages', asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const token = req.headers.authorization;
  const response = await axios.get(`http://data/api/rooms/${roomId}/messages`, {
    headers: {
      Authorization: token
    }
  });

  // const data = [
  //   {
  //     _id: 'message1',
  //     from: 'user1',
  //     room: roomId,
  //     content: 'Hello, how are you?',
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   },
  //   {
  //     _id: 'message2',
  //     from: 'user2',
  //     room: roomId,
  //     content: 'I am good, thank you!',
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   }
  // ];

  res.status(200).json(response.data);
}));

router.post('/rooms', asyncHandler(async (req, res) => {
  const { rooms } = req.body;
  const token = req.headers.authorization;
  const response = await axios.get(`http://data/api/rooms/${rooms}`, {
    headers: {
      Authorization: token
    }
  });
  res.status(200).json(response);
}));

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

// GET /rooms get list of rooms
// POST /rooms create a new room
// GET /rooms/:id get messages history of a room
// POST /rooms/:id send a message to a room


module.exports = router;