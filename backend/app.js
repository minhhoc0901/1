const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

const locationRoutes = require('./routes/locationRoutes') ;
const {checkConnection} = require('./config/db');
const tourRoutes  = require('./routes/tourRoutes');
const reviewRoutes  = require('./routes/reviewRoutes');
const authRoutes  = require('./routes/autRoutes');
const userRoutes  = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRouter');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Cấu hình routes
app.get('/', (req, res) => {
    res.send('Welcome to the Travel API!');
});
app.use('/api/locations', locationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tours', tourRoutes);
// app.use('/api/reviews', reviewRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRouter);

// Kiểm tra kết nối cơ sở dữ liệu
checkConnection();

// Khởi động server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});