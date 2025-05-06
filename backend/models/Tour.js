
const { pool } = require('../config/db');

// -------------------
// Truy vấn cơ bản
// -------------------

/**
 * Thêm một tour mới vào các bảng Tours và các bảng liên quan
 * @param {Object} data - Dữ liệu tour (destination, image, departure_from, duration, description, highlights, schedule, includes, excludes, notes, locations)
 * @returns {Number} - ID của tour vừa tạo
 */
async function createTour(data) {
  const {
    destination,
    image,
    departure_from,
    duration,
    description,
    highlights,
    schedule,
    includes,
    excludes,
    notes,
    locations, // Thêm trường locations
  } = data;

  // Bắt đầu transaction
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Thêm vào bảng Tours
    const tourQuery = `
      INSERT INTO Tours (destination, image, departure_from, duration, description)
      VALUES (?, ?, ?, ?, ?);
    `;
    const [tourResult] = await connection.execute(tourQuery, [
      destination,
      image || null,
      departure_from,
      duration,
      description,
    ]);
    const tourId = tourResult.insertId;

    // Thêm vào bảng Tour_Highlights
    if (highlights && Array.isArray(highlights) && highlights.length > 0) {
      const highlightValues = highlights.map(highlight => [tourId, highlight]);
      const highlightQuery = `
        INSERT INTO Tour_Highlights (tour_id, highlight) VALUES ?
      `;
      await connection.query(highlightQuery, [highlightValues]);
    }

    // Thêm vào bảng Tour_Schedule và Schedule_Activities
    if (schedule && Array.isArray(schedule) && schedule.length > 0) {
      for (const sched of schedule) {
        const scheduleQuery = `
          INSERT INTO Tour_Schedule (tour_id, day, title) VALUES (?, ?, ?);
        `;
        const [scheduleResult] = await connection.execute(scheduleQuery, [
          tourId,
          sched.day,
          sched.title,
        ]);
        const scheduleId = scheduleResult.insertId;

        if (sched.activities && Array.isArray(sched.activities) && sched.activities.length > 0) {
          const activityValues = sched.activities.map(activity => [scheduleId, activity]);
          const activityQuery = `
            INSERT INTO Schedule_Activities (schedule_id, activity) VALUES ?
          `;
          await connection.query(activityQuery, [activityValues]);
        }

        // Thêm liên kết với các địa điểm trong lịch trình này
        if (sched.locations && Array.isArray(sched.locations) && sched.locations.length > 0) {
          for (const locationId of sched.locations) {
            const locationQuery = `
              INSERT INTO Tour_Locations (tour_id, location_id, schedule_id) 
              VALUES (?, ?, ?);
            `;
            await connection.execute(locationQuery, [tourId, locationId, scheduleId]);
          }
        }
      }
    }

    // Thêm vào bảng Tour_Includes
    if (includes && Array.isArray(includes) && includes.length > 0) {
      const includeValues = includes.map(include => [tourId, include]);
      const includeQuery = `
        INSERT INTO Tour_Includes (tour_id, description) VALUES ?
      `;
      await connection.query(includeQuery, [includeValues]);
    }

    // Thêm vào bảng Tour_Excludes
    if (excludes && Array.isArray(excludes) && excludes.length > 0) {
      const excludeValues = excludes.map(exclude => [tourId, exclude]);
      const excludeQuery = `
        INSERT INTO Tour_Excludes (tour_id, description) VALUES ?
      `;
      await connection.query(excludeQuery, [excludeValues]);
    }

    // Thêm vào bảng Tour_Notes
    if (notes && Array.isArray(notes) && notes.length > 0) {
      const noteValues = notes.map(note => [tourId, note]);
      const noteQuery = `
        INSERT INTO Tour_Notes (tour_id, description) VALUES ?
      `;
      await connection.query(noteQuery, [noteValues]);
    }

    await connection.commit();
    return tourId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Lấy thông tin cơ bản của tất cả tour
 * @returns {Array} - Danh sách tour với thông tin cơ bản
 */
async function getBasicTours() {
  const query = `
    SELECT 
      t.id,
      t.destination,
      t.image,
      t.departure_from,
      t.duration,
      t.description,
      (SELECT GROUP_CONCAT(highlight SEPARATOR '||') FROM Tour_Highlights WHERE tour_id = t.id) AS highlights,
      (SELECT GROUP_CONCAT(description SEPARATOR '||') FROM Tour_Includes WHERE tour_id = t.id) AS includes,
      (SELECT GROUP_CONCAT(description SEPARATOR '||') FROM Tour_Excludes WHERE tour_id = t.id) AS excludes,
      (SELECT GROUP_CONCAT(description SEPARATOR '||') FROM Tour_Notes WHERE tour_id = t.id) AS notes
    FROM Tours t;
  `;
  const [rows] = await pool.execute(query);
  return rows.map(row => ({
    ...row,
    highlights: row.highlights ? row.highlights.split('||') : [],
    includes: row.includes ? row.includes.split('||') : [],
    excludes: row.excludes ? row.excludes.split('||') : [],
    notes: row.notes ? row.notes.split('||') : [],
  }));
}

/**
 * Lấy thông tin cơ bản của một tour theo ID
 * @param {Number} tourId - ID của tour
 * @returns {Object|null} - Thông tin cơ bản của tour hoặc null nếu không tìm thấy
 */
async function getBasicTourById(tourId) {
  const query = `
    SELECT 
      t.id,
      t.destination,
      t.image,
      t.departure_from,
      t.duration,
      t.description,
      (SELECT GROUP_CONCAT(highlight SEPARATOR '||') FROM Tour_Highlights WHERE tour_id = t.id) AS highlights,
      (SELECT GROUP_CONCAT(description SEPARATOR '||') FROM Tour_Includes WHERE tour_id = t.id) AS includes,
      (SELECT GROUP_CONCAT(description SEPARATOR '||') FROM Tour_Excludes WHERE tour_id = t.id) AS excludes,
      (SELECT GROUP_CONCAT(description SEPARATOR '||') FROM Tour_Notes WHERE tour_id = t.id) AS notes
    FROM Tours t
    WHERE t.id = ?;
  `;
  const [rows] = await pool.execute(query, [tourId]);
  const row = rows[0];
  if (!row) return null;
  return {
    ...row,
    highlights: row.highlights ? row.highlights.split('||') : [],
    includes: row.includes ? row.includes.split('||') : [],
    excludes: row.excludes ? row.excludes.split('||') : [],
    notes: row.notes ? row.notes.split('||') : [],
  };
}

/**
 * Lấy lịch trình chi tiết của một tour kèm thông tin địa điểm
 * @param {Number} tourId - ID của tour
 * @returns {Array} - Danh sách lịch trình với các hoạt động và địa điểm
 */
async function getSchedule(tourId) {
  // Lấy lịch trình cơ bản
  const scheduleQuery = `
    SELECT 
      ts.id, 
      ts.day, 
      ts.title, 
      (SELECT GROUP_CONCAT(activity SEPARATOR '||') 
       FROM Schedule_Activities 
       WHERE schedule_id = ts.id) AS activities
    FROM Tour_Schedule ts
    WHERE ts.tour_id = ?
    ORDER BY ts.day;
  `;
  const [scheduleRows] = await pool.execute(scheduleQuery, [tourId]);
  
  // Lấy thông tin địa điểm cho mỗi lịch trình
  const schedules = [];
  for (const sched of scheduleRows) {
    const locationQuery = `
      SELECT 
        l.id, 
        l.name, 
        l.type,

        l.description,
        l.latitude,
        l.longitude
      FROM Locations l
      JOIN Tour_Locations tl ON l.id = tl.location_id
      WHERE tl.tour_id = ? AND tl.schedule_id = ?;
    `;
    const [locationRows] = await pool.execute(locationQuery, [tourId, sched.id]);
    
    schedules.push({
      id: sched.id,
      day: sched.day,
      title: sched.title,
      activities: sched.activities ? sched.activities.split('||') : [],
      locations: locationRows || []
    });
  }
  
  return schedules;
}

/**
 * Cập nhật thông tin một tour
 * @param {Number} tourId - ID của tour
 * @param {Object} data - Dữ liệu cần cập nhật
 * @returns {Boolean} - True nếu cập nhật thành công
 */
async function updateTour(tourId, data) {
  const {
    destination,
    image,
    departure_from,
    duration,
    description,
    highlights,
    schedule,
    includes,
    excludes,
    notes,
  } = data;

  // Bắt đầu transaction
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Cập nhật bảng Tours
    const tourQuery = `
      UPDATE Tours 
      SET destination = ?, image = ?, departure_from = ?, duration = ?, description = ?
      WHERE id = ?;
    `;
    const [result] = await connection.execute(tourQuery, [
      destination,
      image || null,
      departure_from,
      duration,
      description,
      tourId,
    ]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    // Xóa và thêm lại Tour_Highlights
    await connection.execute('DELETE FROM Tour_Highlights WHERE tour_id = ?', [tourId]);
    if (highlights && Array.isArray(highlights) && highlights.length > 0) {
      const highlightValues = highlights.map(highlight => [tourId, highlight]);
      const highlightQuery = `
        INSERT INTO Tour_Highlights (tour_id, highlight) VALUES ?
      `;
      await connection.query(highlightQuery, [highlightValues]);
    }

    // Xóa và thêm lại Tour_Locations
    await connection.execute('DELETE FROM Tour_Locations WHERE tour_id = ?', [tourId]);

    // Xóa và thêm lại Schedule_Activities
    await connection.execute(
      'DELETE FROM Schedule_Activities WHERE schedule_id IN (SELECT id FROM Tour_Schedule WHERE tour_id = ?)', 
      [tourId]
    );

    // Xóa và thêm lại Tour_Schedule
    await connection.execute('DELETE FROM Tour_Schedule WHERE tour_id = ?', [tourId]);
    
    if (schedule && Array.isArray(schedule) && schedule.length > 0) {
      for (const sched of schedule) {
        const scheduleQuery = `
          INSERT INTO Tour_Schedule (tour_id, day, title) VALUES (?, ?, ?);
        `;
        const [scheduleResult] = await connection.execute(scheduleQuery, [
          tourId,
          sched.day,
          sched.title,
        ]);
        const scheduleId = scheduleResult.insertId;

        if (sched.activities && Array.isArray(sched.activities) && sched.activities.length > 0) {
          const activityValues = sched.activities.map(activity => [scheduleId, activity]);
          const activityQuery = `
            INSERT INTO Schedule_Activities (schedule_id, activity) VALUES ?
          `;
          await connection.query(activityQuery, [activityValues]);
        }

        // Thêm lại liên kết với các địa điểm
        if (sched.locations && Array.isArray(sched.locations) && sched.locations.length > 0) {
          for (const locationId of sched.locations) {
            const locationQuery = `
              INSERT INTO Tour_Locations (tour_id, location_id, schedule_id) 
              VALUES (?, ?, ?);
            `;
            await connection.execute(locationQuery, [tourId, locationId, scheduleId]);
          }
        }
      }
    }

    // Xóa và thêm lại Tour_Includes
    await connection.execute('DELETE FROM Tour_Includes WHERE tour_id = ?', [tourId]);
    if (includes && Array.isArray(includes) && includes.length > 0) {
      const includeValues = includes.map(include => [tourId, include]);
      const includeQuery = `
        INSERT INTO Tour_Includes (tour_id, description) VALUES ?
      `;
      await connection.query(includeQuery, [includeValues]);
    }

    // Xóa và thêm lại Tour_Excludes
    await connection.execute('DELETE FROM Tour_Excludes WHERE tour_id = ?', [tourId]);
    if (excludes && Array.isArray(excludes) && excludes.length > 0) {
      const excludeValues = excludes.map(exclude => [tourId, exclude]);
      const excludeQuery = `
        INSERT INTO Tour_Excludes (tour_id, description) VALUES ?
      `;
      await connection.query(excludeQuery, [excludeValues]);
    }

    // Xóa và thêm lại Tour_Notes
    await connection.execute('DELETE FROM Tour_Notes WHERE tour_id = ?', [tourId]);
    if (notes && Array.isArray(notes) && notes.length > 0) {
      const noteValues = notes.map(note => [tourId, note]);
      const noteQuery = `
        INSERT INTO Tour_Notes (tour_id, description) VALUES ?
      `;
      await connection.query(noteQuery, [noteValues]);
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Xóa một tour và tất cả dữ liệu liên quan
 * @param {Number} tourId - ID của tour
 * @returns {Boolean} - True nếu xóa thành công
 */
async function deleteTour(tourId) {
  // Bắt đầu transaction
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Xóa dữ liệu liên quan trước
    await connection.execute('DELETE FROM Tour_Highlights WHERE tour_id = ?', [tourId]);
    await connection.execute('DELETE FROM Tour_Locations WHERE tour_id = ?', [tourId]);
    await connection.execute(
      'DELETE FROM Schedule_Activities WHERE schedule_id IN (SELECT id FROM Tour_Schedule WHERE tour_id = ?)', 
      [tourId]
    );
    await connection.execute('DELETE FROM Tour_Schedule WHERE tour_id = ?', [tourId]);
    await connection.execute('DELETE FROM Tour_Includes WHERE tour_id = ?', [tourId]);
    await connection.execute('DELETE FROM Tour_Excludes WHERE tour_id = ?', [tourId]);
    await connection.execute('DELETE FROM Tour_Notes WHERE tour_id = ?', [tourId]);
    await connection.execute('DELETE FROM Reviews WHERE tour_id = ?', [tourId]);

    // Xóa tour từ bảng Tours
    const [result] = await connection.execute('DELETE FROM Tours WHERE id = ?', [tourId]);
    
    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Tìm các tour theo địa điểm
 * @param {Number} locationId - ID của địa điểm
 * @returns {Array} - Danh sách các tour có chứa địa điểm này
 */
async function getToursByLocation(locationId) {
  const query = `
    SELECT DISTINCT t.*
    FROM Tours t
    JOIN Tour_Locations tl ON t.id = tl.tour_id
    WHERE tl.location_id = ?;
  `;
  const [rows] = await pool.execute(query, [locationId]);
  const tours = [];
  
  for (const tour of rows) {
    const fullTour = await composeTour({ id: tour.id });
    tours.push(fullTour);
  }
  
  return tours;
}

// -------------------
// Hợp nhất dữ liệu
// -------------------

/**
 * Hợp nhất dữ liệu từ các bảng để tạo đối tượng tour hoàn chỉnh
 * @param {Object} tour - Thông tin cơ bản của tour
 * @returns {Object|null} - Đối tượng tour hoàn chỉnh
 */
async function composeTour(tour) {
  if (!tour) return null;

  // Lấy lịch trình với thông tin địa điểm
  const schedule = await getSchedule(tour.id);

  // Lấy tất cả các địa điểm trong tour
  const locationQuery = `
    SELECT DISTINCT 
      l.id, 
      l.name, 
      l.type, 
      l.description,
      l.latitude,
      l.longitude
    FROM Locations l
    JOIN Tour_Locations tl ON l.id = tl.location_id
    WHERE tl.tour_id = ?;
  `;
  const [locations] = await pool.execute(locationQuery, [tour.id]);

  return {
    id: tour.id,
    destination: tour.destination,
    image: tour.image,
    departure_from: tour.departure_from,
    duration: tour.duration,
    description: tour.description,
    highlights: tour.highlights,
    schedule,
    includes: tour.includes,
    excludes: tour.excludes,
    notes: tour.notes,
    locations
  };
}

/**
 * Lấy tất cả tour với thông tin đầy đủ
 * @returns {Array} - Danh sách tour hoàn chỉnh
 */
async function getAllTours() {
  const basicTours = await getBasicTours();
  const tours = [];
  for (const tour of basicTours) {
    const fullTour = await composeTour(tour);
    tours.push(fullTour);
  }
  return tours;
}

/**
 * Lấy thông tin đầy đủ của một tour theo ID
 * @param {Number} tourId - ID của tour
 * @returns {Object|null} - Thông tin đầy đủ của tour
 */
async function getTourById(tourId) {
  const basicTour = await getBasicTourById(tourId);
  return await composeTour(basicTour);
}

module.exports = { 
  createTour, 
  getAllTours, 
  getTourById, 
  updateTour, 
  deleteTour,
  getToursByLocation
};