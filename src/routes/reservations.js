const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservations');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/', reservationController.getAllReservations);
router.get('/status/:status', reservationController.getReservationsByStatus);
router.get('/:id', authMiddleware, reservationController.getReservationById); 
router.post('/', reservationController.createReservation);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;