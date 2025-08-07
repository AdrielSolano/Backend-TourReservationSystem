const Reservation = require('../models/Reservation');
const Tour = require('../models/Tour');

exports.getAllReservations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Reservation.countDocuments();
    const reservations = await Reservation.find()
      .skip(skip)
      .limit(limit)
      .populate('customerId', 'firstName lastName email phone')
      .populate('tourId', 'name description price availableDates');

    res.json({
      data: reservations,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id)
      .populate('customerId', 'firstName lastName email phone address')
      .populate('tourId', 'name description price availableDates duration maxPeople isActive');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservación no encontrada' });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getReservationsByStatus = async (req, res) => {
  try {
    const reservations = await Reservation.find({ status: req.params.status })
      .populate('customerId', 'firstName lastName')
      .populate('tourId', 'name');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const { tourId, people, totalPrice } = req.body;

    let price = totalPrice;
    if (typeof price === 'undefined') {
      const tour = await Tour.findById(tourId);
      if (!tour) return res.status(404).json({ error: 'Tour no encontrado' });
      price = tour.price * people;
    }

    const reservation = new Reservation({
      ...req.body,
      totalPrice: price
    });

    await reservation.save();
    const populated = await reservation.populate(['customerId', 'tourId']);

    res.status(201).json(populated);
  } catch (error) {
    console.error('Error al crear reservación:', error);
    res.status(500).json({ error: 'Error al crear reservación' });
  }
};


exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { tourId, people, totalPrice } = req.body;

    let price = totalPrice;
    if (typeof price === 'undefined') {
      const tour = await Tour.findById(tourId);
      if (!tour) return res.status(404).json({ error: 'Tour no encontrado' });
      price = tour.price * people;
    }

    const updated = await Reservation.findByIdAndUpdate(id, {
      ...req.body,
      totalPrice: price
    }, { new: true }).populate(['customerId', 'tourId']);

    if (!updated) return res.status(404).json({ error: 'Reservación no encontrada' });

    res.json(updated);
  } catch (error) {
    console.error('Error al actualizar reservación:', error);
    res.status(500).json({ error: 'Error al actualizar reservación' });
  }
};



exports.deleteReservation = async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!deletedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};