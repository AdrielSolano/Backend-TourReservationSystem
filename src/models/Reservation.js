const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  date: { type: Date, required: true },
  people: { type: Number, required: true, min: 1 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  totalPrice: { type: Number }, 
}, { timestamps: true });


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

reservationSchema.index({ customerId: 1 });
reservationSchema.index({ tourId: 1 });
reservationSchema.index({ date: 1 });
reservationSchema.index({ status: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);