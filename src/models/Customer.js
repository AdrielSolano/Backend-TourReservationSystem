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
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: 'México' }
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

// Índices para mejor performance
customerSchema.index({ lastName: 1, firstName: 1 });

// Virtual para nombre completo
customerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Middleware para actualizar la fecha de modificación
customerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware para populares reservaciones al consultar un cliente
customerSchema.virtual('reservations', {
  ref: 'Reservation',
  localField: '_id',
  foreignField: 'customerId'
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;