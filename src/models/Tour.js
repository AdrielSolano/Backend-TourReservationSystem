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
  availableDates: [{ 
    type: Date,
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Available date must be in the future'
    }
  }],
  maxPeople: { 
    type: Number, 
    required: [true, 'Maximum people is required'],
    min: [1, 'Maximum people must be at least 1']
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Indexes for better performance
tourSchema.index({ name: 1 });
tourSchema.index({ price: 1 });
tourSchema.index({ isActive: 1 });

module.exports = mongoose.model('Tour', tourSchema);