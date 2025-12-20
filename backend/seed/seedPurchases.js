require('dotenv').config();
const connectDB = require('../config/db');
const Purchase = require('../models/Purchase');

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    const purchases = [


      {
        email: 'juan@gmail.com',
        paymentType: 'gcash',
        quantity: 1,
        total: 29995,
        items: [
          {
            sku: 'GPU-ROG-RTX4060TI',
            name: 'ASUS ROG Strix GeForce RTX 4060 Ti 8GB',
            price: 29995,
            qty: 1
          }
        ],
        purchasedAt: new Date('2025-12-01T10:15:00Z')
      },

      {
        email: 'maria@gmail.com',
        paymentType: 'paymaya',
        quantity: 2,
        total: 25990,
        items: [
          {
            sku: 'ACC-ROG-MOUSE-GLADIUS3',
            name: 'ASUS ROG Gladius III Wireless',
            price: 5995,
            qty: 1
          },
          {
            sku: 'ACC-ROG-KB-FALCHION',
            name: 'ASUS ROG Falchion Keyboard',
            price: 8995,
            qty: 1
          }
        ],
        purchasedAt: new Date('2025-12-03T13:42:00Z')
      },

      {
        email: 'kevin@gmail.com',
        paymentType: 'gcash',
        quantity: 1,
        total: 115970,
        items: [
          {
            sku: 'FULL-ROG-4060Ti-STARTER',
            name: 'ROG Entry Gaming Build (RTX 4060 Ti)',
            price: 115970,
            qty: 1
          }
        ],
        purchasedAt: new Date('2025-12-05T08:21:00Z')
      },

      {
        email: 'angela@gmail.com',
        paymentType: 'credit_card',
        quantity: 1,
        total: 171965,
        items: [
          {
            sku: 'FULL-ROG-4070Ti-PRO',
            name: 'ROG Pro Gaming PC (RTX 4070 Ti SUPER)',
            price: 171965,
            qty: 1
          }
        ],
        purchasedAt: new Date('2025-12-07T19:55:00Z')
      },

      {
        email: 'robeizagani@gmail.com',
        paymentType: 'paymaya',
        quantity: 2,
        total: 131965,
        items: [
          {
            sku: 'ACC-ROG-HEADSET-DELTA',
            name: 'ASUS ROG Delta S Gaming Headset',
            price: 9995,
            qty: 1
          },
          {
            sku: 'FULL-ROG-4070-BALANCED',
            name: 'ROG Balanced Build (RTX 4070 OC)',
            price: 121970,
            qty: 1
          }
        ],
        purchasedAt: new Date('2025-12-12T07:44:42Z')
      },

      {
        email: 'cb@gmail.com',
        paymentType: 'gcash',
        quantity: 1,
        total: 206965,
        items: [
          {
            sku: 'FULL-ROG-4080S-ELITE',
            name: 'ROG Elite Build (RTX 4080 SUPER)',
            price: 206965,
            qty: 1
          }
        ],
        purchasedAt: new Date('2025-12-13T02:02:52Z')
      },


      {
        email: 'techbuyer@gmail.com',
        paymentType: 'gcash',
        quantity: 3,
        total: 54985,
        items: [
          {
            sku: 'SSD-ROG-HYPERION-1TB',
            name: 'ASUS ROG SQ7 1TB SSD',
            price: 8995,
            qty: 1
          },
          {
            sku: 'RAM-ROG-STRIX-32GB',
            name: 'ASUS ROG Strix 32GB DDR5',
            price: 16995,
            qty: 1
          },
          {
            sku: 'PSU-ROG-LOKI-850',
            name: 'ASUS ROG Loki 850W',
            price: 14995,
            qty: 1
          }
        ],
        purchasedAt: new Date('2025-12-15T15:10:00Z')
      },


      {
        email: 'gamer@gmail.com',
        paymentType: 'credit_card',
        quantity: 1,
        total: 289965,
        items: [
          {
            sku: 'FULL-ROG-ULTIMATE-4090',
            name: 'ROG Ultimate Gaming Rig (RTX 4090)',
            price: 289965,
            qty: 1
          }
        ],
        purchasedAt: new Date('2025-12-20T20:30:00Z')
      }

    ];

    await Purchase.deleteMany(); 
    await Purchase.insertMany(purchases);

    console.log('✅ Purchases seeded successfully');
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
