const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      user: {
        id: user.id,
        isAdmin: user.isAdmin || false,
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
