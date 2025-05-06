const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

// Create a new tour
router.post('/', tourController.createTour);

// Get all tours
router.get('/', tourController.getAllTours);

// Get a tour by ID
router.get('/:id', tourController.getTourById);

// Update a tour
router.put('/:id', tourController.updateTour);

// Delete a tour
router.delete('/:id', tourController.deleteTour);

module.exports = router;