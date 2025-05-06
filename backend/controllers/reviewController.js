const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  const { user_id, tour_id, rating, comment } = req.body;

  if (!user_id || !tour_id || !rating) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await Review.create(user_id, tour_id, rating, comment);
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting review' });
  }
};