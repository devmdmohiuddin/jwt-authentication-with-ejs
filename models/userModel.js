const mongoose = require("mongoose");
// const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email address"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter an valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter an valid password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

// fire a function after the save in the database
// userSchema.post('save', function (doc, next) {
//   console.log('after save in the database', doc)
//   next()
// })

// fire a function before the save in the database
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method
userSchema.statics.login = async function (email, password) {
  const existUser = await this.findOne({ email });
  if (existUser) {
    const isMatchPassword = await bcrypt.compare(password, existUser.password)
    if (isMatchPassword) {
      return existUser
    }
      throw Error('incorrent password')
  }
    throw Error('incorrect email')
}

const User = mongoose.model("user", userSchema);

module.exports = User;
