const mongoose = require('mongoose');


const userorderSchema = mongoose.Schema({
  content: String
});

module.exports = mongoose.model("userorder", userorderSchema);