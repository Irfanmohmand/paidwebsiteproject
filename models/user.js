const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://irfanmohmand987:hNe9VrZgTR2YCuzx@paidwebsite.yqqoc.mongodb.net/paidwebsite");

const userSchema = mongoose.Schema({
  name: String,
  rollno: Number,
  section: String,
  email: String,
  password: String,
  contact: Number
});

module.exports = mongoose.model("user", userSchema);