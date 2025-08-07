// models/Tour.js
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour name is required'],
    trim: true,
    maxlength: [100, 'Tour name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 hour']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  maxPeople: {
    type: Number,
    required: [true, 'Maximum people is required'],
    min: [1, 'Maximum people must be at least 1']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  availableDates: {
    type: [Date],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tour', tourSchema);
