const Customer = require('../models/Customer');

exports.getAllCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Customer.countDocuments();
    const customers = await Customer.find().skip(skip).limit(limit);

    res.json({
      data: { customers },
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('reservations');
    
    if (!customer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Cliente no encontrado'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        customer
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        customer: newCustomer
      }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: 'El email ya está registrado'
      });
    }
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!customer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Cliente no encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        customer
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Cliente no encontrado'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};