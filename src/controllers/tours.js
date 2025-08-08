const Tour = require('../models/Tour');

exports.getAllTours = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Tour.countDocuments();
    const tours = await Tour.find().skip(skip).limit(limit);

    res.json({
      data: { tours },
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getActiveTours = async (req, res) => {
  try {
    const tours = await Tour.find({ isActive: true });
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTour = async (req, res) => {
  const tour = new Tour(req.body);
  try {
    const newTour = await tour.save();
    res.status(201).json(newTour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.json(updatedTour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (!deletedTour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};