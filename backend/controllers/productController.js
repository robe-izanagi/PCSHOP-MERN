const Product = require('../models/Product');
const Purchase = require('../models/Purchase');

module.exports = {
  list: async (req, res) => {
    try {
      const q = (req.query.q || '').trim();
      const category = req.query.category;
      const filter = {};
      if (q) {
        const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter.$or = [{ name: re }, { sku: re }];
      }
      if (category) filter.category = category;
      const products = await Product.find(filter).sort({ category: 1, sku: 1 }).lean();
      return res.json({ products });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  create: async (req, res) => {
    try {
      const body = req.body;
      if (!body.sku || !body.name) return res.status(400).json({ message: 'sku & name required' });
      const exists = await Product.findOne({ sku: body.sku });
      if (exists) return res.status(400).json({ message: 'SKU already exists' });
      const p = await Product.create({
        sku: body.sku,
        name: body.name,
        brand: body.brand || 'ASUS ROG',
        category: body.category || 'part',
        specs: body.specs || {},
        images: body.images || [],
        price: body.price || 0,
        stock: body.stock || 0,
        type: body.type || 'part'
      });
      return res.json({ product: p });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      const sku = req.params.sku;
      const body = req.body;
      const p = await Product.findOne({ sku });
      if (!p) return res.status(404).json({ message: 'Product not found' });
      ['name', 'brand', 'category', 'specs', 'images', 'price', 'stock', 'type', 'disabled'].forEach(k => {
        if (body[k] !== undefined) p[k] = body[k];
      });
      await p.save();
      return res.json({ product: p });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  addStock: async (req, res) => {
    try {
      const sku = req.params.sku;
      const qty = Number(req.body.qty) || 0;
      if (qty <= 0) return res.status(400).json({ message: 'qty must be > 0' });
      const p = await Product.findOne({ sku });
      if (!p) return res.status(404).json({ message: 'Product not found' });
      p.stock = (p.stock || 0) + qty;
      await p.save();
      return res.json({ message: 'Stock added', product: p });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  setDisabled: async (req, res) => {
    try {
      const sku = req.params.sku;
      const disabled = !!req.body.disabled;
      const p = await Product.findOne({ sku });
      if (!p) return res.status(404).json({ message: 'Product not found' });
      p.disabled = disabled;
      await p.save();
      return res.json({ message: disabled ? 'Disabled' : 'Enabled', product: p });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  remove: async (req, res) => {
    try {
      const sku = req.params.sku;
      const p = await Product.findOneAndDelete({ sku });
      if (!p) return res.status(404).json({ message: 'Product not found' });
      return res.json({ message: 'Deleted' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  addFeedback: async (req, res) => {
    try {
      const sku = req.params.sku;
      const { userEmail, comments } = req.body;
      if (!userEmail || !comments) return res.status(400).json({ message: 'userEmail and comments required' });

      // check if email exists in purchases (must have at least one purchase)
      const hasPurchase = await Purchase.exists({ email: userEmail });
      if (!hasPurchase) return res.status(400).json({ message: 'Make a purchase to send feedback' });

      const p = await Product.findOne({ sku });
      if (!p) return res.status(404).json({ message: 'Product not found' });

      p.feedback = p.feedback || [];
      p.feedback.push({ userEmail, comments, date: new Date(), reply: null });
      await p.save();

      return res.json({ message: 'Feedback added', product: p });
    } catch (err) {
      console.error('addFeedback err', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },
};
