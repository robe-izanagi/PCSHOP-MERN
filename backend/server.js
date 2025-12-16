require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to mongo
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/pcshop_db');

// routes
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/orders', require('./routes/orders'));
app.use('/products', require('./routes/products'));
// app.use('/api/products', require('./routes/products'));
// app.use('/api/orders', require('./routes/orders'));

app.get('/', (req, res) => res.send('PC Shop Backend (MongoDB) Running...'));

const PORT = process.env.PORT || 'https://pcshop-mern-backend-rpep.onrender.com';
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
