require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcrypt');

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    const users = [
      { email: 'robeizagani@gmail.com', emailVerified: true },
      { email: 'ana.santos@example.com', emailVerified: true },
      { email: 'juan.delacruz@example.com', emailVerified: true },
      { email: 'marie.quezon@example.com', emailVerified: true },
      { email: 'test.user@example.com',  emailVerified: false }
    ];

    const plainPassword = 'password123';
    const hash = bcrypt.hashSync(plainPassword, 10);

    for (const u of users) {
      const found = await User.findOne({ email: u.email });
      if (!found) {
        const newUser = new User({
          email: u.email,
          name: u.name,
          emailVerified: u.emailVerified,
          password: hash 
        });
        await newUser.save();
        console.log('Created user:', u.email);
      } else {
        found.name = u.name;
        found.emailVerified = u.emailVerified;
        await found.save();
        console.log('Updated user:', u.email);
      }
    }

    console.log('Users seeding finished.');
    process.exit(0);
  } catch (err) {
    console.error('SeedUsers error:', err);
    process.exit(1);
  }
})();
