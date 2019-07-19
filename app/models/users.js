const mongoose = require('mongoose')

const {
  Schema,
  model,
} = mongoose

const userScema = new Schema({
  name: {
    type: String,
    required: true
  },
})

module.exports = model('User', userScema)