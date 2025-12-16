const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'pcshopfarol@admin-cics.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin-cics-3103-sia';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt';

// google client
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || null;
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const transporter = (process.env.SMTP_HOST && process.env.SMTP_USER)
  ? nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  })
  : null;

if (transporter) {
  transporter.verify().then(() => console.log('SMTP verified')).catch(() => console.warn('SMTP verify failed'));
}

function validEmail(e) {
  return /\S+@\S+\.\S+/.test(e);
}

module.exports = {
  adminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ role: 'admin', email }, JWT_SECRET, { expiresIn: '12h' });
      return res.json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  registerUser: async (req, res) => {
    try {
      const { fullname, email, phone } = req.body;
      if (!email || !validEmail(email)) return res.status(400).json({ message: 'Valid email required' });

      let user = await User.findOne({ email });
      if (user) {
        if (user.emailVerified) return res.status(400).json({ message: 'Email already verified and registered.' });
        const token = require('crypto').randomBytes(20).toString('hex');
        // const token = require('crypto').randomBytes(20).toString('hex');
        user.emailToken = token;
        await user.save();
        const verifyUrl = `${req.protocol}://${req.get('host')}/auth/verify-email?token=${token}`;
        const mail = { from: process.env.FROM_EMAIL || 'no-reply@example.com', to: email, subject: 'Verify your email', text: `Click to verify: ${verifyUrl}`, html: `<p>Click <a href="${verifyUrl}">here</a> to verify.</p>` };
        if (transporter) transporter.sendMail(mail).catch(e => console.warn('mail fail', e));
        return res.json({ message: 'Verification email resent', verifyUrl });
      }

      const newUser = new User({ email, emailVerified: false, name: fullname || null });
      await newUser.save();

      const token = require('crypto').randomBytes(20).toString('hex');
      newUser.emailToken = token;
      await newUser.save();

      const verifyUrl = `${req.protocol}://${req.get('host')}/auth/verify-email?token=${token}`;
      const mail = { from: process.env.FROM_EMAIL || 'no-reply@example.com', to: email, subject: 'Verify your email', text: `Click to verify: ${verifyUrl}`, html: `<p>Click <a href="${verifyUrl}">here</a> to verify.</p>` };
      if (transporter) transporter.sendMail(mail).catch(e => console.warn('mail fail', e));
      return res.json({ message: 'Registered. Check your email for verification link.', verifyUrl });
    } catch (err) {
      console.error('registerUser err', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // verifyEmail: async (req, res) => {
  //   try {
  //     const { token } = req.query;
  //     if (!token) return res.status(400).send('Token missing');
  //     const user = await User.findOne({ emailToken: token });
  //     if (!user) return res.status(400).send('Invalid token');
  //     user.emailVerified = true;
  //     user.emailToken = null;
  //     await user.save();
  //     const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:'}/verify-success`;
  //     return res.redirect(redirectUrl);
  //   } catch (err) {
  //     console.error('verifyEmail err', err);
  //     return res.status(500).send('Server error');
  //   }
  // },

  googleAuth: async (req, res) => {
    try {
      const { id_token } = req.body;
      if (!id_token) return res.status(400).json({ message: 'id_token required' });
      if (!googleClient) return res.status(500).json({ message: 'Google client not configured on server' });

      // verify token
      const ticket = await googleClient.verifyIdToken({
        idToken: id_token,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const email = payload.email;
      const googleId = payload.sub;
      const name = payload.name || null;
      const emailVerified = Boolean(payload.email_verified);

      if (!email) return res.status(400).json({ message: 'Google token missing email' });

      // find or create user
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({ email, emailVerified: true, googleId, name });
        await user.save();
      } else {
        let changed = false;
        if (!user.googleId && googleId) { user.googleId = googleId; changed = true; }
        if (!user.emailVerified && emailVerified) { user.emailVerified = true; changed = true; }
        if (!user.name && name) { user.name = name; changed = true; }
        if (changed) await user.save();
      }

      const mail = {
        from: process.env.FROM_EMAIL || 'no-reply@example.com',
        to: email,
        subject: 'You are registered (SSO)',
        text: `Hi ${name || ""}, your account (${email}) has been registered via Google SSO.`,
        html: `<p>Hi ${name || ""},</p><p>Your account <strong>${email}</strong> has been registered and verified via Google Sign-in. You can now place orders.</p>`
      };
      if (transporter) {
        transporter.sendMail(mail).catch(err => console.warn('mail failed', err));
      } else {
        console.log('=== SSO REGISTRATION EMAIL (SMTP not configured) ===');
        console.log(mail);
      }

      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '12h' });

      return res.json({ success: true, token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (err) {
      console.error('googleAuth err', err);
      return res.status(500).json({ message: 'Google authentication failed' });
    }
  }
};
