const User = require('../models/User');
const Product = require('../models/Product');
const Purchase = require('../models/Purchase');
const nodemailer = require('nodemailer');

const transporter = (process.env.SMTP_HOST && process.env.SMTP_USER)
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    })
  : null;

// ==========================
// RECEIPT HTML BUILDER
// SAME STYLE AS OrderPage.jsx
// ==========================
function buildReceiptHTML(purchase) {
  const itemsHTML = purchase.items
    .map(
      (it) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${it.name}</td>
          <td style="padding: 8px; text-align:center; border-bottom: 1px solid #ddd;">${it.qty}</td>
          <td style="padding: 8px; text-align:right; border-bottom: 1px solid #ddd;">₱${it.price.toLocaleString()}</td>
          <td style="padding: 8px; text-align:right; border-bottom: 1px solid #ddd;">₱${(it.price * it.qty).toLocaleString()}</td>
        </tr>
      `
    )
    .join("");

  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px;">
      <h2 style="text-align:center;">Purchase Receipt</h2>
      <p><strong>Email:</strong> ${purchase.email}</p>
      <p><strong>Date:</strong> ${new Date(purchase.createdAt).toLocaleString()}</p>
      <p><strong>Payment:</strong> ${purchase.paymentType}</p>

      <h3>Items Purchased</h3>
      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align:left; padding: 8px;">Item</th>
            <th style="text-align:center; padding: 8px;">Qty</th>
            <th style="text-align:right; padding: 8px;">Price</th>
            <th style="text-align:right; padding: 8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <h2 style="text-align:right; margin-top:20px;">
        TOTAL: ₱${purchase.total.toLocaleString()}
      </h2>

      <p style="margin-top:30px; text-align:center; font-size:12px; color:#555;">
        Thank you for your purchase!
      </p>
    </div>
  </div>
  `;
}

module.exports = {
  createOrder: async (req, res) => {
    try {
      const { email, mode = 'parts', items = [], paymentType, buildSku, options = {} } = req.body;

      if (!email) return res.status(400).json({ message: 'Email required (please sign in via SSO)' });

      const user = await User.findOne({ email });
      if (!user || !user.emailVerified) {
        return res.status(400).json({ message: 'User not registered or email not verified' });
      }

      let total = 0;
      const purchasedItems = [];

      // ==============================
      // PARTS ORDER MODE
      // ==============================
      if (mode === 'parts') {
        if (!Array.isArray(items) || items.length === 0)
          return res.status(400).json({ message: 'No items' });

        for (const it of items) {
          const sku = it.sku;
          const qty = Math.max(1, Number(it.qty) || 1);

          const p = await Product.findOne({ sku });
          if (!p) return res.status(404).json({ message: `Product not found: ${sku}` });
          if (p.disabled) return res.status(400).json({ message: `Product disabled: ${sku}` });
          if (p.stock < qty) return res.status(400).json({ message: `Insufficient stock for ${sku}` });

          total += p.price * qty;
          purchasedItems.push({
            sku,
            name: p.name,
            qty,
            price: p.price,
            productId: p._id
          });

          await Product.updateOne({ sku }, { $inc: { stock: -qty } });
        }

      } else {
        // ==============================
        // FULLBUILD MODE
        // ==============================
        if (!buildSku) return res.status(400).json({ message: 'buildSku required for fullbuild' });

        const build = await Product.findOne({ sku: buildSku });
        if (!build) return res.status(404).json({ message: 'Build SKU not found' });
        if (build.disabled) return res.status(400).json({ message: 'Build is disabled' });
        if (build.stock < 1) return res.status(400).json({ message: 'Build out of stock' });

        total += build.price;
        purchasedItems.push({
          sku: build.sku,
          name: build.name,
          qty: 1,
          price: build.price,
          productId: build._id
        });

        await Product.updateOne({ sku: build.sku }, { $inc: { stock: -1 } });

        if (options?.ramSku) {
          const ram = await Product.findOne({ sku: options.ramSku });
          if (!ram) return res.status(404).json({ message: 'Option RAM not found: ' + options.ramSku });
          if (ram.stock < 1) return res.status(400).json({ message: 'RAM out of stock: ' + options.ramSku });

          total += ram.price;
          purchasedItems.push({
            sku: ram.sku,
            name: ram.name,
            qty: 1,
            price: ram.price,
            productId: ram._id
          });

          await Product.updateOne({ sku: ram.sku }, { $inc: { stock: -1 } });
        }

        if (options?.ssdSku) {
          const ssd = await Product.findOne({ sku: options.ssdSku });
          if (!ssd) return res.status(404).json({ message: 'SSD not found: ' + options.ssdSku });
          if (ssd.stock < 1) return res.status(400).json({ message: 'SSD out of stock: ' + options.ssdSku });

          total += ssd.price;
          purchasedItems.push({
            sku: ssd.sku,
            name: ssd.name,
            qty: 1,
            price: ssd.price,
            productId: ssd._id
          });

          await Product.updateOne({ sku: ssd.sku }, { $inc: { stock: -1 } });
        }
      }

      // ==============================
      // SAVE PURCHASE
      // ==============================
      const purchase = new Purchase({
        email,
        paymentType,
        items: purchasedItems,
        quantity: purchasedItems.reduce((s, i) => s + i.qty, 0),
        total,
        userId: user._id,
      });

      await purchase.save();

      // ==============================
      // SEND HTML RECEIPT
      // ==============================
      if (transporter) {
        const html = buildReceiptHTML(purchase);

        const mail = {
          from: process.env.FROM_EMAIL || 'no-reply@example.com',
          to: user.email,
          subject: 'Your Purchase Receipt',
          html
        };

        transporter.sendMail(mail).catch(err => console.error("Mail send error:", err));
      }

      return res.json({ message: 'Order created', purchase });
    } catch (err) {
      console.error("createOrder err", err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  getOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const purchase = await Purchase.findById(id);
      if (!purchase) return res.status(404).json({ message: 'Not found' });
      return res.json({ purchase });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
};
