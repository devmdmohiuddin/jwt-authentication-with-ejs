const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protected = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "secret key", (err, decoded) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decoded);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, "secret key", async (err, decoded) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null
        next()
      } else {
        console.log(decoded);
        let user = await User.findById(decoded.id)
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null
    next()
  }
}

module.exports = { protected, checkUser };
