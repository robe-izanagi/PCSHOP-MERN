
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');
const builder = require('xmlbuilder');
const fs = require('fs');
const path = require('path');

const xmlDir = path.join(__dirname, '..', 'xml');
if (!fs.existsSync(xmlDir)) {
  fs.mkdirSync(xmlDir);
}

module.exports = {
  dashboardData: async (req, res) => {
    try {
      console.log('Fetching dashboard data...');
      // Total Sales: sum of all purchase totals
      const totalSalesAgg = await Purchase.aggregate([{ $group: { _id: null, sum: { $sum: "$total" } } }]);
      const totalSales = totalSalesAgg[0]?.sum || 0;
      console.log('Total Sales:', totalSales);

      // Active Products: enabled and stock > 0
      const activeProducts = await Product.countDocuments({ disabled: false, stock: { $gt: 0 } });
      console.log('Active Products:', activeProducts);

      // Inactive Products: disabled or stock <= 0
      const inActiveProducts = await Product.countDocuments({ $or: [{ disabled: true }, { stock: { $lte: 0 } }] });
      console.log('Inactive Products:', inActiveProducts);

      // Total Users
      const totalUsers = await User.countDocuments();
      console.log('Total Users:', totalUsers);

      // Purchased Product: sum of all quantities in purchases
      const purchasedProductAgg = await Purchase.aggregate([{ $group: { _id: null, sum: { $sum: "$quantity" } } }]);
      const totalPurchasedProduct = purchasedProductAgg[0]?.sum || 0;
      console.log('Total Purchased Product:', totalPurchasedProduct);

      // Transaction Made: count of purchases
      const totalTransactionMade = await Purchase.countDocuments();
      console.log('Total Transaction Made:', totalTransactionMade);

      // Product Ranking: all products can be filter by sales, name, & quantity purchased
      const allProducts = await Product.find({}).lean();
      const productRankingAgg = await Purchase.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.sku", totalQuantity: { $sum: "$items.qty" }, totalSales: { $sum: { $multiply: ["$items.price", "$items.qty"] } } } }
      ]);
      const salesMap = {};
      productRankingAgg.forEach(item => {
        salesMap[item._id] = { totalQuantity: item.totalQuantity, totalSales: item.totalSales };
      });
      const productRanking = allProducts.map(product => ({
        productName: product.name,
        salesProduct: salesMap[product.sku]?.totalSales || 0,
        quantityPurchased: salesMap[product.sku]?.totalQuantity || 0
      }));
      console.log('Product Ranking:', productRanking.length);

      const recentPurchases = await Purchase.find({}).sort({ purchasedAt: -1 }).limit(10).lean();
      const recentPurchasesData = await Promise.all(recentPurchases.map(async (p) => {
        const itemsDetails = await Promise.all((p.items || []).map(async (item) => {
          const product = await Product.findOne({ sku: item.sku }).lean();
          return {
            productName: product?.name || item.name || item.sku,
            quantity: item.qty,
            amount: item.price * item.qty
          };
        }));
        return {
          fullname: p.fullname || '',
          email: p.email,
          date: p.purchasedAt,
          items: itemsDetails
        };
      }));
      console.log('Recent Purchases:', recentPurchasesData.length);

      return res.json({
        totalSales,
        activeProducts,
        inActiveProducts,
        totalUsers,
        totalPurchasedProduct,
        totalTransactionMade,
        productRanking,
        recentPurchases: recentPurchasesData
      });
    } catch (err) {
      console.error('dashboardData error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },


  analytics: async (req, res) => {
    try {
      const range = req.query.range || 'days';
      let dateFormat;

      switch (range) {
        case 'weeks':
          dateFormat = { $dateToString: { format: "%Y-W%V", date: "$purchasedAt" } }; // Note: %V may not be supported in all MongoDB versions, adjust if needed
          break;
        case 'months':
          dateFormat = { $dateToString: { format: "%Y-%m", date: "$purchasedAt" } };
          break;
        case 'years':
          dateFormat = { $dateToString: { format: "%Y", date: "$purchasedAt" } };
          break;
        default:
          dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$purchasedAt" } };
      }

      // Sales / Income
      const salesData = await Purchase.aggregate([
        { $group: { _id: dateFormat, total: { $sum: "$total" } } },
        { $sort: { _id: 1 } },
        { $project: { period: "$_id", total: 1, _id: 0 } }
      ]);

      // Users
      const userDateFormat = { $dateToString: { format: dateFormat.$dateToString.format, date: "$createdAt" } };
      const usersData = await User.aggregate([
        { $group: { _id: userDateFormat, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { period: "$_id", count: 1, _id: 0 } }
      ]);

      // Transaction Made
      const transactionsData = await Purchase.aggregate([
        { $group: { _id: dateFormat, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { period: "$_id", count: 1, _id: 0 } }
      ]);

      // Per Product Sales and Quantity
      const productsData = await Purchase.aggregate([
        { $unwind: "$items" },
        { $group: { _id: { period: dateFormat, sku: "$items.sku" }, sales: { $sum: { $multiply: ["$items.price", "$items.qty"] } }, qty: { $sum: "$items.qty" } } },
        { $sort: { "_id.period": 1, "_id.sku": 1 } },
        { $project: { period: "$_id.period", sku: "$_id.sku", sales: 1, qty: 1, _id: 0 } }
      ]);

      return res.json({ sales: salesData, users: usersData, transactions: transactionsData, products: productsData });
    } catch (err) {
      console.error('analytics error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },



  replyFeedback: async (req, res) => {
    try {
      const sku = req.params.sku;
      const idx = Number(req.params.idx);
      const { adminEmail, comment } = req.body;

      if (!comment || !comment.trim()) return res.status(400).json({ message: 'comment required' });

      const p = await Product.findOne({ sku });
      if (!p) return res.status(404).json({ message: 'Product not found' });

      if (!Array.isArray(p.feedback) || idx < 0 || idx >= p.feedback.length) {
        return res.status(400).json({ message: 'Feedback entry not found' });
      }

      const adminEmailFinal = adminEmail || (req.user && req.user.email) || 'admin';

      p.feedback[idx].reply = {
        adminEmail: adminEmailFinal,
        comment: comment.trim(),
        date: new Date()
      };

      await p.save();

      return res.json({ message: 'Reply saved', product: p });
    } catch (err) {
      console.error('replyFeedback err', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  exportUsersXML: async (req, res) => {
    try {
      const users = await User.find({}).lean();
      const root = builder.create('users');
      users.forEach(user => {
        const userEl = root.ele('user');
        userEl.ele('id', user._id.toString());
        userEl.ele('fullname', user.fullname || '');
        userEl.ele('email', user.email);
        userEl.ele('emailVerified', user.emailVerified ? 'true' : 'false');
        userEl.ele('createdAt', user.createdAt ? user.createdAt.toISOString() : '');
        userEl.ele('updatedAt', user.updatedAt ? user.updatedAt.toISOString() : '');
      });
      const xml = root.end({ pretty: true });
      // Write to file
      fs.writeFileSync(path.join(xmlDir, 'users.xml'), xml);
      // Send as response
      res.set('Content-Type', 'application/xml');
      res.set('Content-Disposition', 'attachment; filename="users.xml"');
      res.send(xml);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  exportProductsXML: async (req, res) => {
    try {
      const products = await Product.find({}).lean();
      const root = builder.create('products');
      products.forEach(product => {
        const productEl = root.ele('product');
        productEl.ele('id', product._id.toString());
        productEl.ele('sku', product.sku);
        productEl.ele('name', product.name);
        productEl.ele('brand', product.brand);
        productEl.ele('category', product.category);
        productEl.ele('price', product.price);
        productEl.ele('stock', product.stock);
        productEl.ele('type', product.type);
        productEl.ele('disabled', product.disabled ? 'true' : 'false');
        const specsEl = productEl.ele('specs');
        Object.keys(product.specs || {}).forEach(key => {
          specsEl.ele(key, product.specs[key]);
        });
        const imagesEl = productEl.ele('images');
        (product.images || []).forEach(img => {
          imagesEl.ele('image', img);
        });
        const feedbackEl = productEl.ele('feedback');
        (product.feedback || []).forEach(f => {
          const fEl = feedbackEl.ele('entry');
          fEl.ele('userEmail', f.userEmail);
          fEl.ele('comments', f.comments);
          fEl.ele('date', f.date ? f.date.toISOString() : '');
          if (f.reply) {
            const replyEl = fEl.ele('reply');
            replyEl.ele('adminEmail', f.reply.adminEmail);
            replyEl.ele('comment', f.reply.comment);
            replyEl.ele('date', f.reply.date ? f.reply.date.toISOString() : '');
          }
        });
        productEl.ele('createdAt', product.createdAt ? product.createdAt.toISOString() : '');
        productEl.ele('updatedAt', product.updatedAt ? product.updatedAt.toISOString() : '');
      });
      const xml = root.end({ pretty: true });
      // Write to file
      fs.writeFileSync(path.join(xmlDir, 'products.xml'), xml);
      // Send as response
      res.set('Content-Type', 'application/xml');
      res.set('Content-Disposition', 'attachment; filename="products.xml"');
      res.send(xml);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  exportPurchasesXML: async (req, res) => {
    try {
      const purchases = await Purchase.find({}).lean();
      const root = builder.create('purchases');
      purchases.forEach(purchase => {
        const purchaseEl = root.ele('purchase');
        purchaseEl.ele('id', purchase._id.toString());
        purchaseEl.ele('fullname', purchase.fullname || '');
        purchaseEl.ele('email', purchase.email);
        purchaseEl.ele('paymentType', purchase.paymentType || '');
        purchaseEl.ele('quantity', purchase.quantity);
        purchaseEl.ele('total', purchase.total);
        const itemsEl = purchaseEl.ele('items');
        (purchase.items || []).forEach(item => {
          const itemEl = itemsEl.ele('item');
          itemEl.ele('sku', item.sku);
          itemEl.ele('name', item.name);
          itemEl.ele('price', item.price);
          itemEl.ele('qty', item.qty);
        });
        purchaseEl.ele('purchasedAt', purchase.purchasedAt ? purchase.purchasedAt.toISOString() : '');
        purchaseEl.ele('createdAt', purchase.createdAt ? purchase.createdAt.toISOString() : '');
        purchaseEl.ele('updatedAt', purchase.updatedAt ? purchase.updatedAt.toISOString() : '');
      });
      const xml = root.end({ pretty: true });
      // Write to file
      fs.writeFileSync(path.join(xmlDir, 'purchases.xml'), xml);
      // Send as response
      res.set('Content-Type', 'application/xml');
      res.set('Content-Disposition', 'attachment; filename="purchases.xml"');
      res.send(xml);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },


};