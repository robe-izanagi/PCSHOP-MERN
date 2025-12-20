require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors({
  origin: '*', // para gumana agad frontend
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to mongo
connectDB(process.env.MONGO_URI);

// routes
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/orders', require('./routes/orders'));
app.use('/products', require('./routes/products'));

app.get('/', (req, res) => {
  res.send('PC Shop Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
