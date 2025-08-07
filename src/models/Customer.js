const mongoose = require('mongoose');
const validator = require('validator');

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true,
    maxlength: [50, 'El apellido no puede exceder los 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Por favor ingrese un email válido']
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} no es un número de teléfono válido!`
    }
  },
  address: {
    type: String, // ← AHORA ES STRING
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

customerSchema.index({ lastName: 1, firstName: 1 });

customerSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

customerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

customerSchema.virtual('reservations', {
  ref: 'Reservation',
  localField: '_id',
  foreignField: 'customerId'
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
