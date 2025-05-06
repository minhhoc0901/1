const pool = require('../config/db');

class Review {
  static async create(userId, tourId, rating, comment) {
    await pool.execute(
      'INSERT INTO Reviews (user_id, tour_id, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, tourId, rating, comment || null]
    );
  }
}

module.exports = Review;