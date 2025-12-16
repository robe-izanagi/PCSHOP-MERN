const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  sku: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  brand: { type: String, default: 'ASUS ROG' },
  category: { type: String, default: 'part' },
  specs: { type: Object, default: {} },
  images: { type: [String], default: [] },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  type: { type: String, default: 'part' }, 
  disabled: { type: Boolean, default: false },

  feedback: {
    type: [
      {
        userEmail: { type: String, required: true },
        comments: { type: String, required: true },
        date: { type: Date, default: Date.now },
        reply: {
          adminEmail: { type: String },
          comment: { type: String },
          date: { type: Date }
        }
      }
    ],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
