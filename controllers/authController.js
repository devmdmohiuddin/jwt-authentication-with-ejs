const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// handle errors
const handleErrors = (err) => {
  const errors = { email: "", password: "" };

  // dublicate error code
  if (err.code === 11000) {
    errors.email = "that email is already registered";
  }

  // validation error
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  console.log(err.message)

  if (err.message === 'incorrect email') {
    errors.email = "this email is not registered"
  }

  if (err.message === 'incorrent password') {
    errors.password = "this password is incorrent"
  }

  return errors;
};

// create token
const maxage = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secret key", { expiresIn: maxage });
};

const signupGet = (req, res) => {
  res.render("signup");
};

const signupPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxage: maxage });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const loginGet = (req, res) => {
  res.render("login");
};

const loginPost = async (req, res) => {
  console.log(res.locals)
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxage: maxage });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const logoutPost = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.redirect('/')
}

module.exports = {
  signupGet,
  signupPost,
  loginGet,
  loginPost,
  logoutPost
};
