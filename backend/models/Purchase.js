const mongoose = require('mongoose');

const PurchaseItemSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, default: 1 },
}, { _id: false });

const PurchaseSchema = new mongoose.Schema({
  email: { type: String, required: true },
  paymentType: { type: String },
  items: { type: [PurchaseItemSchema], default: [] },
  quantity: { type: Number, default: 1 },
  total: { type: Number },
  purchasedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Purchase', PurchaseSchema);
