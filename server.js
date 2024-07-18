const express = require("express");
const app = express();
const axios = require('axios');
const cors = require('cors');
const { authRoutes, protectedRoutes } = require("./routes");

// app.use(cors());
app.use(express.json());
app.use(cors())

// TODO Merge auth service with rest to get rid of this
const validateTokeWithAuthService = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const response = await axios.get('http://auth/api/verifyToken', {
      headers: {
        Authorization: token
      }
    });
    if (response.status === 200) {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    console.error("Error during token verification:", error.response ? error.response.data : error.message);
    res.status(401).send('Unauthorized');
  }
};

app.use('/api/auth', authRoutes);
app.use('/api/protected', validateTokeWithAuthService, protectedRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
