const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const axios = require('axios');

router.get('/weather', asyncHandler(async (req, res) => {
  const { location } = req.query;
  const response = await axios.get(`http://weather/weather?location=${location}`);
  res.json(response.data);
}));

module.exports = router;