const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customers');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.route('/')
  .get(customerController.getAllCustomers)
  .post(customerController.createCustomer);

router.route('/:id')
  .get(customerController.getCustomer)
  .put(customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

module.exports = router;