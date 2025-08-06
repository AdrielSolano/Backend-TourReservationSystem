const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer',
    required: [true, 'Customer ID is required']
  },
  tourId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tour',
    required: [true, 'Tour ID is required']
  },
  date: { 
    type: Date, 
    required: [true, 'Reservation date is required'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Reservation date must be in the future'
    }
  },
  people: { 
    type: Number, 
    required: [true, 'Number of people is required'],
    min: [1, 'At least 1 person is required']
  },
  totalPrice: { 
    type: Number,
    min: [0, 'Total price cannot be negative']
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware to calculate total price before saving
reservationSchema.pre('save', async function(next) {
  if (!this.isModified('people') && !this.isModified('tourId')) return next();
  
  try {
    const tour = await mongoose.model('Tour').findById(this.tourId);
    if (tour) {
      this.totalPrice = tour.price * this.people;
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Indexes for better performance
reservationSchema.index({ customerId: 1 });
reservationSchema.index({ tourId: 1 });
reservationSchema.index({ date: 1 });
reservationSchema.index({ status: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);