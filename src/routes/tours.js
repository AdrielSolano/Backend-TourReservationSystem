const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tours');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/', tourController.getAllTours);
router.get('/active', tourController.getActiveTours);
router.post('/', tourController.createTour);
router.put('/:id', tourController.updateTour);
router.delete('/:id', tourController.deleteTour);

module.exports = router;