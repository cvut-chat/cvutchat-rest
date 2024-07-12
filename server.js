const express = require("express");
const app = express();
const { authRoutes, protectedRoutes } = require("./routes");

// app.use(cors());
app.use(express.json());

// TODO Merge auth service with rest to get rid of this
const validateTokeWithAuthService = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const response = await axios.get('http://auth/verifyToken', {
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
    res.status(401).send('Unauthorized');
  }
};

app.use('/api/auth', authRoutes);
app.use('/api/protected', validateTokeWithAuthService, protectedRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
