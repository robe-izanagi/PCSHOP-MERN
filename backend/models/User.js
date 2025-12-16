const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  emailVerified: { type: Boolean, default: true },
  googleId: { type: String, default: null },
  name: { type: String, default: null },
  emailToken: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
