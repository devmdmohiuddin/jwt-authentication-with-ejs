const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const { protected, checkUser } = require("./middlewares/authMiddleware");
const authRoutes = require("./routes/authRoutes");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI = "mongodb+srv://mohi:mohi1234@cluster0.ejzxy.mongodb.net/test";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser)
app.get("/", protected, (req, res) => res.render("home"));
app.get("/smoothies", protected, (req, res) => res.render("smoothies"));

app.use(authRoutes);

// set cookie
app.get("/set-cookie", (req, res) => {
  // res.setHeader('Set-Cookie', "newUser=true")

  res.cookie("newUser", false);
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  res.send("you got the cookie");
});

// get cookie
app.get("/get-cookie", (req, res) => {
  console.log(req.cookies.isEmployee);
  res.send("you got the cookie");
});
