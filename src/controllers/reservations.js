const Reservation = require('../models/Reservation');
const Tour = require('../models/Tour');

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('customerId', 'firstName lastName email')
      .populate('tourId', 'name price');
    res.json(reservations);
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
    const tour = await Tour.findById(req.body.tourId);
    if (!tour || !tour.isActive) {
      return res.status(400).json({ message: 'Tour is not available' });
    }

    if (!tour.availableDates.some(date => date.getTime() === new Date(req.body.date).getTime())) {
      return res.status(400).json({ message: 'Selected date is not available for this tour' });
    }

    if (req.body.people > tour.maxPeople) {
      return res.status(400).json({ message: `Cannot exceed ${tour.maxPeople} people for this tour` });
    }

    const reservation = new Reservation(req.body);
    const saved = await reservation.save();

    const populated = await Reservation.findById(saved._id)
      .populate('customerId', 'firstName lastName email')
      .populate('tourId', 'name price');

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.updateReservation = async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('customerId', 'firstName lastName email')
      .populate('tourId', 'name price');

    if (!updatedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
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