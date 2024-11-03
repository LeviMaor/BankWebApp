require('dotenv').config();
require('./cronJobs/cleanup');
const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const verifyJWT = require('./middleware/verifyJWT')
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;


const app = express();

connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/auth', require('./routes/authRoutes'));
app.use('/transactions', verifyJWT, require('./routes/transactionRoutes'));
app.use('/users', verifyJWT, require('./routes/userRoutes'));

app.all('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
    console.log(err);
});
