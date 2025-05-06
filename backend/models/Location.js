const { pool } = require('../config/db');

// -------------------
// Truy vấn cơ bản
// -------------------

/**
 * Thêm một địa điểm mới vào các bảng Locations, LocationDetails và TravelInfo
 * @param {Object} data - Dữ liệu địa điểm (name, type, description, latitude, longitude,...)
 * @returns {Number} - ID của địa điểm vừa tạo
 */
async function createLocation(data) {
    const { 
        name, type, description, latitude, longitude,
        subtitle, introduction, 
        why_visit_architecture_title, why_visit_architecture_text, why_visit_culture,
        ticket_price, tip,
        bestTimes = [], // Thêm các trường mới
        travelMethods = { fromTuyHoa: [], fromElsewhere: [] },
        experiences = [],
        cuisines = [],
        tips = [],
        nearby = []
    } = data;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insert into Locations table
        const [locationResult] = await connection.execute(`
            INSERT INTO Locations (name, type, description, latitude, longitude)
            VALUES (?, ?, ?, ?, ?)
        `, [name, type, description, latitude, longitude]);
        
        const locationId = locationResult.insertId;

        // 2. Insert into LocationDetails
        await connection.execute(`
            INSERT INTO LocationDetails 
            (location_id, subtitle, introduction, why_visit_architecture_title, 
            why_visit_architecture_text, why_visit_culture)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [locationId, subtitle, introduction, why_visit_architecture_title, 
            why_visit_architecture_text, why_visit_culture]);

        // 3. Insert into TravelInfo
        await connection.execute(`
            INSERT INTO TravelInfo (location_id, ticket_price, tip)
            VALUES (?, ?, ?)
        `, [locationId, ticket_price, tip]);

        // 4. Insert BestTimes
        for (const time of bestTimes) {
            await connection.execute(`
                INSERT INTO BestTimes (location_id, time_description)
                VALUES (?, ?)
            `, [locationId, time]);
        }

        // 5. Insert TravelMethods
        for (const method of travelMethods.fromTuyHoa) {
            await connection.execute(`
                INSERT INTO TravelMethods (location_id, method_type, description)
                VALUES (?, 'fromTuyHoa', ?)
            `, [locationId, method]);
        }
        for (const method of travelMethods.fromElsewhere) {
            await connection.execute(`
                INSERT INTO TravelMethods (location_id, method_type, description)
                VALUES (?, 'fromElsewhere', ?)
            `, [locationId, method]);
        }

        // 6. Insert Experiences
        for (const exp of experiences) {
            await connection.execute(`
                INSERT INTO Experiences (location_id, description)
                VALUES (?, ?)
            `, [locationId, exp.text]);
        }

        // 7. Insert Cuisines
        for (const cuisine of cuisines) {
            await connection.execute(`
                INSERT INTO Cuisines (location_id, description)
                VALUES (?, ?)
            `, [locationId, cuisine.text]);
        }

        // 8. Insert Tips
        for (const tip of tips) {
            await connection.execute(`
                INSERT INTO Tips (location_id, description)
                VALUES (?, ?)
            `, [locationId, tip]);
        }

        await connection.commit();
        return locationId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Lấy thông tin cơ bản của tất cả địa điểm
 * @returns {Array} - Danh sách địa điểm với thông tin cơ bản
 */
async function getBasicLocations() {
    const query = `
        SELECT 
            l.id,
            l.name AS title,
            l.type,
            l.description,
            l.latitude,
            l.longitude,
            ld.subtitle,
            ld.introduction,
            ld.why_visit_architecture_title,
            ld.why_visit_architecture_text,
            ld.why_visit_culture,
            ti.ticket_price,
            ti.tip
        FROM Locations l
        LEFT JOIN LocationDetails ld ON l.id = ld.location_id
        LEFT JOIN TravelInfo ti ON l.id = ti.location_id;
    `;
    const [rows] = await pool.execute(query);
    return rows;
}

/**
 * Lấy thông tin cơ bản của một địa điểm theo ID
 * @param {Number} locationId - ID của địa điểm
 * @returns {Object|null} - Thông tin cơ bản của địa điểm hoặc null nếu không tìm thấy
 */
async function getBasicLocationById(locationId) {
    const query = `
        SELECT 
            l.id,
            l.name AS title,
            l.type,
            l.description,
            l.latitude,
            l.longitude,
            ld.subtitle,
            ld.introduction,
            ld.why_visit_architecture_title,
            ld.why_visit_architecture_text,
            ld.why_visit_culture,
            ti.ticket_price,
            ti.tip
        FROM Locations l
        LEFT JOIN LocationDetails ld ON l.id = ld.location_id
        LEFT JOIN TravelInfo ti ON l.id = ti.location_id
        WHERE l.id = ?;
    `;
    const [rows] = await pool.execute(query, [locationId]);
    return rows[0] || null;
}

/**
 * Cập nhật thông tin một địa điểm
 * @param {Number} locationId - ID của địa điểm
 * @param {Object} data - Dữ liệu cần cập nhật
 * @returns {Boolean} - True nếu cập nhật thành công
 */
async function updateLocation(locationId, data) {
    const { name, type, description, latitude, longitude, subtitle, introduction, why_visit_architecture_title, why_visit_architecture_text, why_visit_culture, ticket_price, tip } = data;

    // Cập nhật bảng Locations
    const locationQuery = `
        UPDATE Locations 
        SET name = ?, type = ?, description = ?, latitude = ?, longitude = ?
        WHERE id = ?;
    `;
    await pool.execute(locationQuery, [
        name || null,
        type || null,
        description || null,
        latitude || null,
        longitude || null,
        locationId
    ]);

    // Cập nhật bảng LocationDetails
    const detailsQuery = `
        UPDATE LocationDetails 
        SET subtitle = ?, introduction = ?, why_visit_architecture_title = ?, why_visit_architecture_text = ?, why_visit_culture = ?
        WHERE location_id = ?;
    `;
    await pool.execute(detailsQuery, [
        subtitle || null,
        introduction || null,
        why_visit_architecture_title || null,
        why_visit_architecture_text || null,
        why_visit_culture || null,
        locationId
    ]);

    // Cập nhật bảng TravelInfo
    const travelInfoQuery = `
        UPDATE TravelInfo 
        SET ticket_price = ?, tip = ?
        WHERE location_id = ?;
    `;
    await pool.execute(travelInfoQuery, [
        ticket_price || null,
        tip || null,
        locationId
    ]);

    return true;
}

/**
 * Xóa một địa điểm và tất cả dữ liệu liên quan
 * @param {Number} locationId - ID của địa điểm
 * @returns {Boolean} - True nếu xóa thành công
 */
async function deleteLocation(locationId) {
    // Xóa dữ liệu liên quan trước
    const tables = [
        'Itinerary_Locations',
        'Ratings',
        'User_Uploads',
        'Comments',
        'LocationDetails',
        'TravelInfo',
        'BestTimes',
        'TravelMethods',
        'Experiences',
        'Cuisines',
        'Tips',
        'NearbyLocations',
        'Location_Images',
        'LocationHotels'
    ];
    for (const table of tables) {
        const query = `DELETE FROM ${table} WHERE location_id = ?;`;
        await pool.execute(query, [locationId]);
    }

    // Xóa địa điểm từ bảng Locations
    const locationQuery = `
        DELETE FROM Locations 
        WHERE id = ?;
    `;
    const [result] = await pool.execute(locationQuery, [locationId]);
    return result.affectedRows > 0;
}

// -------------------
// Truy vấn phụ (dữ liệu liên quan)
// -------------------

/**
 * Lấy ảnh của địa điểm theo loại ảnh
 * @param {Number} locationId - ID của địa điểm
 * @param {String} imageType - Loại ảnh (introduction, architecture, experience, cuisine)
 * @returns {String|null} - URL của ảnh hoặc null nếu không tìm thấy
 */

async function getImage(locationId, imageType, referenceId = null) {
    let query = `
      SELECT image_url 
      FROM Location_Images 
      WHERE location_id = ? AND image_type = ?
    `;
    const params = [locationId, imageType];
    
    if (referenceId) {
      query += ` AND reference_id = ?`;
      params.push(referenceId);
    }
    
    query += ` LIMIT 1;`;
    const [rows] = await pool.execute(query, params);
    return rows[0]?.image_url || null;
  }

/**
 * Lấy thời gian tốt nhất để tham quan
 * @param {Number} locationId - ID của địa điểm
 * @returns {Array} - Danh sách thời gian
 */
async function getBestTimes(locationId) {
    const query = `
        SELECT time_description
        FROM BestTimes
        WHERE location_id = ?;
    `;
    const [rows] = await pool.execute(query, [locationId]);
    return rows.map(row => row.time_description);
}

/**
 * Lấy phương thức di chuyển
 * @param {Number} locationId - ID của địa điểm
 * @returns {Object} - Các phương thức di chuyển (fromTuyHoa, fromElsewhere)
 */
async function getTravelMethods(locationId) {
    const query = `
        SELECT method_type, description
        FROM TravelMethods
        WHERE location_id = ?;
    `;
    const [rows] = await pool.execute(query, [locationId]);
    const result = { fromTuyHoa: [], fromElsewhere: [] };
    rows.forEach(row => {
        if (row.method_type === 'fromTuyHoa') {
            result.fromTuyHoa.push(row.description);
        } else if (row.method_type === 'fromElsewhere') {
            result.fromElsewhere.push(row.description);
        }
    });
    return result;
}

/**
 * Lấy danh sách trải nghiệm
 * @param {Number} locationId - ID của địa điểm
 * @returns {Array} - Danh sách trải nghiệm
 */

async function getExperiences(locationId) {
    const query = `
      SELECT e.id, e.description
      FROM Experiences e
      WHERE e.location_id = ?;
    `;
    const [rows] = await pool.execute(query, [locationId]);
    const experiences = [];
    for (const row of rows) {
      // Lấy ảnh cho trải nghiệm này, sử dụng id của trải nghiệm
      const image = await getImage(locationId, 'experience', row.id);
      experiences.push({ text: row.description, image });
    }
    return experiences;
  }
/**
 * Lấy danh sách ẩm thực
 * @param {Number} locationId - ID của địa điểm
 * @returns {Array} - Danh sách ẩm thực
 */
async function getCuisines(locationId) {
    const query = `
        SELECT c.id, c.description
        FROM Cuisines c
        WHERE c.location_id = ?;
    `;
    const [rows] = await pool.execute(query, [locationId]);
    const cuisines = [];
    for (const row of rows) {
        const image = await getImage(locationId, 'cuisine', row.id);
        cuisines.push({ text: row.description, image });
    }
    return cuisines;
}

/**
 * Lấy danh sách mẹo
 * @param {Number} locationId - ID của địa điểm
 * @returns {Array} - Danh sách mẹo
 */
async function getTips(locationId) {
    const query = `
        SELECT description
        FROM Tips
        WHERE location_id = ?;
    `;
    const [rows] = await pool.execute(query, [locationId]);
    return rows.map(row => row.description);
}

/**
 * Lấy danh sách địa điểm gần đó
 * @param {Number} locationId - ID của địa điểm
 * @returns {Array} - Danh sách tên địa điểm gần đó
 */
async function getNearbyLocations(locationId) {
    const query = `
        SELECT l2.name
        FROM NearbyLocations nl
        JOIN Locations l2 ON nl.nearby_location_id = l2.id
        WHERE nl.location_id = ?;
    `;
    const [rows] = await pool.execute(query, [locationId]);
    return rows.map(row => row.name);
}

/**
 * Lấy trung bình điểm đánh giá và số lượng đánh giá
 * @param {Number} locationId - ID của địa điểm
 * @returns {Object} - Trung bình điểm và số lượng đánh giá
 */
async function getRatings(locationId) {
    const query = `
        SELECT AVG(rating) as averageRating, COUNT(rating) as ratingCount
        FROM Ratings
        WHERE location_id = ?;
    `;
    const [rows] = await pool.execute(query, [locationId]);
    return {
        averageRating: rows[0]?.averageRating || 0,
        ratingCount: rows[0]?.ratingCount || 0
    };
}

/**
 * Lấy danh sách bình luận
 * @param {Number} locationId - ID của địa điểm
 * @returns {Array} - Danh sách bình luận
 */
async function getComments(locationId) {
    const query = `
        SELECT c.id, c.comment_text, c.created_at, u.username
        FROM Comments c
        JOIN Users u ON c.user_id = u.id
        WHERE c.location_id = ?;
    `;
    const [rows] = await pool.execute(query, [locationId]);
    return rows;
}

/**
 * Lấy danh sách ảnh do người dùng tải lên
 * @param {Number} locationId - ID của địa điểm
 * @returns {Array} - Danh sách ảnh
 */
async function getUserUploads(locationId) {
    const query = `
        SELECT image_url, uploaded_at, u.username
        FROM User_Uploads uu
        JOIN Users u ON uu.user_id = u.id
        WHERE uu.location_id = ?;
    `;
    const [rows] = await pool.execute(query, [locationId]);
    return rows;
}

/**
 * Lấy danh sách khách sạn gần đó
 * @param {Number} locationId - ID của địa điểm
 * @returns {Array} - Danh sách khách sạn
 */
async function getNearbyHotels(locationId) {
    const query = `
        SELECT h.id, h.name, h.address, h.latitude, h.longitude
        FROM LocationHotels lh
        JOIN Hotels h ON lh.hotel_id = h.id
        WHERE lh.location_id = ?;
    `;
    const [rows] = await pool.execute(query, [locationId]);
    return rows;
}

// -------------------
// Hợp nhất dữ liệu
// -------------------

/**
 * Hợp nhất dữ liệu từ các bảng để tạo đối tượng địa điểm hoàn chỉnh
 * @param {Object} loc - Thông tin cơ bản của địa điểm
 * @returns {Object|null} - Đối tượng địa điểm hoàn chỉnh
 */
async function composeLocation(loc) {
    if (!loc) return null;

    const [
        introImage,
        archImage,
        bestTimes,
        travelMethods,
        experiences,
        cuisines,
        tips,
        nearby,
        ratings,
        comments,
        userUploads,
        nearbyHotels
    ] = await Promise.all([
        getImage(loc.id, 'introduction'),
        getImage(loc.id, 'architecture'),
        getBestTimes(loc.id),
        getTravelMethods(loc.id),
        getExperiences(loc.id),
        getCuisines(loc.id),
        getTips(loc.id),
        getNearbyLocations(loc.id),
        getRatings(loc.id),
        getComments(loc.id),
        getUserUploads(loc.id),
        getNearbyHotels(loc.id)
    ]);

    return {
        id: loc.id,
        title: loc.title,
        type: loc.type,
        description: loc.description,
        coordinates: {
            latitude: loc.latitude,
            longitude: loc.longitude
        },
        subtitle: loc.subtitle,
        introduction: {
            text: loc.introduction,
            image: introImage
        },
        whyVisit: {
            architecture: {
                title: loc.why_visit_architecture_title,
                text: loc.why_visit_architecture_text,
                image: archImage
            },
            culture: loc.why_visit_culture
        },
        bestTimes,
        travelMethods,
        travelInfo: {
            ticketPrice: loc.ticket_price,
            tip: loc.tip
        },
        experiences,
        cuisine: cuisines,
        tips,
        nearby,
        averageRating: ratings.averageRating,
        ratingCount: ratings.ratingCount,
        comments,
        userUploads,
        nearbyHotels
    };
}

/**
 * Lấy tất cả địa điểm với thông tin đầy đủ
 * @returns {Array} - Danh sách địa điểm hoàn chỉnh
 */
async function getAllLocations() {
    const basicLocations = await getBasicLocations();
    const locations = [];
    for (const loc of basicLocations) {
        const location = await composeLocation(loc);
        locations.push(location);
    }
    return locations;
}

/**
 * Lấy thông tin đầy đủ của một địa điểm theo ID
 * @param {Number} locationId - ID của địa điểm
 * @returns {Object|null} - Thông tin đầy đủ của địa điểm
 */
async function getLocationById(locationId) {
    const basicLocation = await getBasicLocationById(locationId);
    return await composeLocation(basicLocation);
}

async function getLocationByName(name) {
    const query = `
      SELECT * FROM Locations WHERE name = ?;
    `;
    const [rows] = await pool.execute(query, [name]);
    return rows[0] || null;
  }
module.exports = { getLocationByName ,createLocation, getAllLocations, getLocationById, updateLocation, deleteLocation };