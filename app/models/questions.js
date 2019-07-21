const mongoose = require('mongoose')

const {
  Schema,
  model,
} = mongoose

const qutstionSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  title: {
    type: String,
    select: true,
  },
  description: {
    type: String,
  },
  questioner: {
    type: Schema.Types.ObjectId, ref: 'User',
    select: false,
  },
})

module.exports = model('Question', qutstionSchema)