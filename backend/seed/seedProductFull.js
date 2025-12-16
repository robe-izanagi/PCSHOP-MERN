require('dotenv').config({ path: '.env.local' });
const connectDB = require('../config/db');
const Product = require('../models/Product');

(async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/pcshop_db');
    const products = [
      {
        sku: 'GPU-ROG-RTX4090-OC',
        name: 'ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB GDDR6X',
        brand: 'ASUS ROG',
        category: 'gpu',
        price: 149995,
        stock: 5,
        type: 'part',
        disabled: false,
        specs: { vram: '24GB GDDR6X', model: 'RTX 4090', boost: '2640 MHz' },
        images: ['https://dlcdnwebimgs.asus.com/gain/7B5FEBFE-4494-4AAB-AFB8-BFEB034E7C24/w1000/h732']
      },
      {
        sku: 'GPU-ROG-RTX4080S-OC',
        name: 'ASUS ROG Strix GeForce RTX 4080 SUPER OC 16GB',
        brand: 'ASUS ROG',
        category: 'gpu',
        price: 98995,
        stock: 7,
        type: 'part',
        disabled: false,
        specs: { vram: '16GB GDDR6X', model: 'RTX 4080 SUPER', boost: '2640 MHz' },
        images: ['https://dlcdnwebimgs.asus.com/files/media/090C91F5-62E1-4C17-8A58-53D4C941795D/v1/img/aura/aura-pd.png']
      },
      {
        sku: 'GPU-ROG-RTX4070TI-S',
        name: 'ASUS ROG Strix GeForce RTX 4070 Ti SUPER 16GB',
        brand: 'ASUS ROG',
        category: 'gpu',
        price: 67995,
        stock: 10,
        type: 'part',
        disabled: false,
        specs: { vram: '16GB GDDR6X', model: 'RTX 4070 Ti SUPER' },
        images: ['https://dlcdnwebimgs.asus.com/files/media/798C35E3-EF80-4568-9071-F2B4A0F86703/v1/img/aura/aura-pd.png']
      },
      {
        sku: 'GPU-ROG-RTX4070-OC',
        name: 'ASUS ROG Strix GeForce RTX 4070 OC 12GB',
        brand: 'ASUS ROG',
        category: 'gpu',
        price: 47995,
        stock: 12,
        type: 'part',
        disabled: false,
        specs: { vram: '12GB GDDR6X', model: 'RTX 4070' },
        images: ['https://dlcdnwebimgs.asus.com/gain/9F703D1B-01A8-4FD1-87D2-B389262C6835/w1000/h732']
      },
      {
        sku: 'GPU-ROG-RTX4060TI',
        name: 'ASUS ROG Strix GeForce RTX 4060 Ti 8GB',
        brand: 'ASUS ROG',
        category: 'gpu',
        price: 29995,
        stock: 15,
        type: 'part',
        disabled: false,
        specs: { vram: '8GB GDDR6', model: 'RTX 4060 Ti' },
        images: ['https://dlcdnwebimgs.asus.com/files/media/D062DBDD-12EF-4D57-93D2-21E98671085C/v1/img/kv/pd.png']
      },

      // Motherboards
      {
        sku: 'MB-ROG-Z790-E',
        name: 'ASUS ROG Strix Z790-E Gaming WiFi II',
        brand: 'ASUS ROG',
        category: 'motherboard',
        price: 31995,
        stock: 8,
        type: 'part',
        disabled: false,
        specs: { chipset: 'Z790', socket: 'LGA1700', ram: 'DDR5' },
        images: ['https://dlcdnwebimgs.asus.com/files/media/E8F9316B-CB25-42B5-9422-CA99338CDB38/v1/img/performance/pcie-5.0.png']
      },
      {
        sku: 'MB-ROG-B760-F',
        name: 'ASUS ROG Strix B760-F Gaming WiFi',
        brand: 'ASUS ROG',
        category: 'motherboard',
        price: 16995,
        stock: 12,
        type: 'part',
        disabled: false,
        specs: { chipset: 'B760', socket: 'LGA1700', ram: 'DDR5' },
        images: ['https://dlcdnwebimgs.asus.com/files/media/53D30A49-0B79-48F2-AD43-DEB7F954AE2B/v1/img/performance/pcie-pd.png']
      },
      {
        sku: 'MB-ROG-X670E-E',
        name: 'ASUS ROG Crosshair X670E Hero',
        brand: 'ASUS ROG',
        category: 'motherboard',
        price: 39995,
        stock: 6,
        type: 'part',
        disabled: false,
        specs: { chipset: 'X670E', socket: 'AM5', ram: 'DDR5' },
        images: ['https://dlcdnwebimgs.asus.com/files/media/0CBC145C-59B8-4B51-BF1A-DA0749FA1522/v1/img/cooling/headers/header-base.png']
      },

      // PSUs
      {
        sku: 'PSU-ROG-THOR-1200P2',
        name: 'ASUS ROG Thor 1200W Platinum II',
        brand: 'ASUS ROG',
        category: 'psu',
        price: 22995,
        stock: 10,
        type: 'part',
        disabled: false,
        specs: { watt: '1200W', rating: '80+ Platinum' },
        images: ['https://dlcdnwebimgs.asus.com/gain/684DD066-82FC-4C2B-A0DB-7957EA004D40']
      },
      {
        sku: 'PSU-ROG-LOKI-850',
        name: 'ASUS ROG Loki 850W Platinum SFX-L',
        brand: 'ASUS ROG',
        category: 'psu',
        price: 14995,
        stock: 14,
        type: 'part',
        disabled: false,
        specs: { watt: '850W', rating: 'Platinum' },
        images: ['https://dlcdnwebimgs.asus.com/files/media/20346B84-3DC1-40D9-81A5-12D6E90E2386/v1/img/overview/ROG-Loki-SFX-L-850W-Platinum.png']
      },

      // RAM
      {
        sku: 'RAM-ROG-STRIX-32GB',
        name: 'ASUS ROG Strix 32GB (2×16) DDR5 6400MHz',
        brand: 'ASUS ROG',
        category: 'ram',
        price: 16995,
        stock: 20,
        type: 'part',
        disabled: false,
        specs: { size: '32GB', speed: '6400MHz', type: 'DDR5' },
        images: ['https://mizzostore.com/cdn/shop/files/p_lancer_ddr5_rog_5_700x_4060f5e3-a0d1-4687-a2fd-1055ec6c3255.webp?v=1731693639&width=700']
      },
      {
        sku: 'RAM-ROG-STRIX-64GB',
        name: 'ASUS ROG Strix 64GB (2×32) DDR5 6000MHz',
        brand: 'ASUS ROG',
        category: 'ram',
        price: 29995,
        stock: 10,
        type: 'part',
        disabled: false,
        specs: { size: '64GB', speed: '6000MHz', type: 'DDR5' },
        images: ['https://mizzostore.com/cdn/shop/files/p_lancer_ddr5_rog_5_700x_4060f5e3-a0d1-4687-a2fd-1055ec6c3255.webp?v=1731693639&width=700']
      },

      // SSD
      {
        sku: 'SSD-ROG-HYPERION-1TB',
        name: 'ASUS ROG Strix SQ7 NVMe PCIe 4.0 1TB SSD',
        brand: 'ASUS ROG',
        category: 'ssd',
        price: 8995,
        stock: 30,
        type: 'part',
        disabled: false,
        specs: { size: '1TB', type: 'NVMe PCIe 4.0' },
        images: ['https://dlcdnwebimgs.asus.com/gain/FC3B53D4-55AC-46C0-922B-1309F5765ECE']
      },
      {
        sku: 'SSD-ROG-HYPERION-2TB',
        name: 'ASUS ROG Strix SQ7 NVMe PCIe 4.0 2TB SSD',
        brand: 'ASUS ROG',
        category: 'ssd',
        price: 15995,
        stock: 25,
        type: 'part',
        disabled: false,
        specs: { size: '2TB', type: 'NVMe PCIe 4.0' },
        images: ['https://dlcdnwebimgs.asus.com/gain/FC3B53D4-55AC-46C0-922B-1309F5765ECE']
      },

      // Cases
      {
        sku: 'CASE-ROG-HELIOS',
        name: 'ASUS ROG Strix Helios GX601',
        brand: 'ASUS ROG',
        category: 'case',
        price: 15995,
        stock: 10,
        type: 'part',
        disabled: false,
        specs: { type: 'Mid Tower', rgb: true },
        images: ['https://dlcdnwebimgs.asus.com/gain/24CDD4E4-1FC5-4034-A289-8212BE7F4573/w1000/h732']
      },
      {
        sku: 'CASE-ROG-HYPERION',
        name: 'ASUS ROG Hyperion GR701',
        brand: 'ASUS ROG',
        category: 'case',
        price: 27995,
        stock: 6,
        type: 'part',
        disabled: false,
        specs: { type: 'Full Tower', rgb: true },
        images: ['https://dlcdnwebimgs.asus.com/gain/28DBE018-16C0-47B6-9F9E-FDFB9DD66DBF/w1000/h732']
      },
      {
        sku: 'CASE-ROG-HELIOS II',
        name: 'ASUS Strix Helios II GX601S',
        brand: 'ASUS ROG',
        category: 'case',
        price: 27995,
        stock: 3,
        type: 'part',
        disabled: false,
        specs: { type: 'Mid Tower', rgb: true },
        images: ['https://dlcdnwebimgs.asus.com/gain/0B4F32D6-B7C0-442A-99E9-AB513DE9C891']
      },

      // Coolers
      {
        sku: 'COOLER-ROG-RYUJIN3-360',
        name: 'ASUS ROG Ryujin III 360 ARGB',
        brand: 'ASUS ROG',
        category: 'cooler',
        price: 22995,
        stock: 9,
        type: 'part',
        disabled: false,
        specs: { type: 'AIO 360mm', screen: '3.5\" LCD' },
        images: ['https://dlcdnwebimgs.asus.com/gain/A1D6D78A-00BE-4F89-A360-2790312CDDAD']
      },
      {
        sku: 'COOLER-ROG-RYUO3-240',
        name: 'ASUS ROG Ryuo III 240 ARGB',
        brand: 'ASUS ROG',
        category: 'cooler',
        price: 14995,
        stock: 12,
        type: 'part',
        disabled: false,
        specs: { type: 'AIO 240mm' },
        images: ['https://dlcdnwebimgs.asus.com/gain/D2ADE251-2A00-4CD4-968B-31A325793FC0/w717/h525/fwebp']
      },

      // Accessories
      {
        sku: 'ACC-ROG-KB-FALCHION',
        name: 'ASUS ROG Falchion 65% Wireless Mechanical Keyboard',
        brand: 'ASUS ROG',
        category: 'accessory',
        price: 8995,
        stock: 15,
        type: 'part',
        disabled: false,
        specs: { type: 'Wireless', switches: 'ROG RX' },
        images: ['https://ecommerce.datablitz.com.ph/cdn/shop/products/3_55ad5a45-95a7-413f-9d4b-2357a35202d3_800x.png?v=1676808420']
      },
      {
        sku: 'ACC-ROG-MOUSE-GLADIUS3',
        name: 'ASUS ROG Gladius III Wireless',
        brand: 'ASUS ROG',
        category: 'accessory',
        price: 5995,
        stock: 20,
        type: 'part',
        disabled: false,
        specs: { dpi: '26000 DPI', wireless: true },
        images: ['https://dlcdnwebimgs.asus.com/gain/F38517C3-9D47-468A-9232-13D8DD7F6D28/w260/fwebp']
      },
      {
        sku: 'ACC-ROG-HEADSET-DELTA',
        name: 'ASUS ROG Delta S Gaming Headset',
        brand: 'ASUS ROG',
        category: 'accessory',
        price: 9995,
        stock: 12,
        type: 'part',
        disabled: false,
        specs: { mic: 'AI Noise Canceling', audio: 'Hi-Res' },
        images: ['https://dlcdnwebimgs.asus.com/files/media/E4C7EB4C-9C4F-4A00-826E-B581BE704F8A/v1/img/kv/rog-delta-s-core.png']
      },
      {
        sku: 'ACC-ROG-MONITOR-XG27AQ',
        name: 'ROG Strix OLED XG27ACDNG | 27 to 31.5 Inches',
        brand: 'ASUS ROG',
        category: 'accessory',
        price: 24995,
        stock: 8,
        type: 'part',
        disabled: false,
        specs: { refresh: '170Hz', resolution: '1440p' },
        images: ['https://dlcdnwebimgs.asus.com/gain/AEEEEB76-572C-4F85-8727-77DCCA3073F0']
      },

      {
        sku: 'FULL-ROG-ULTIMATE-4090',
        name: 'ROG Ultimate Gaming Rig (RTX 4090 + Z790-E + 64GB DDR5 + 2TB SQ7 + Helios Case)',
        brand: 'ASUS ROG',
        category: 'fullbuild',
        price: 289965,
        stock: 3,
        type: 'fullbuild',
        disabled: false,
        specs: {
          gpu: 'GPU-ROG-RTX4090-OC',
          mobo: 'MB-ROG-Z790-E',
          psu: 'PSU-ROG-THOR-1200P2',
          ram: 'RAM-ROG-STRIX-64GB',
          ssd: 'SSD-ROG-HYPERION-2TB',
          case: 'CASE-ROG-HELIOS',
          cooler: 'COOLER-ROG-RYUJIN3-360'
        },
        images: ['https://rog.asus.com/media/1754655347369.png'],
        feedback: [
          { userEmail: 'robeizagani@gmail.com', comments: 'Ang mahal, mas mahal pa sa kidney ko.', date: new Date('2025-12-12T07:58:16.626Z'), reply: { adminEmail: 'asusgogshop@gmail.com', comment: 'Benta mo lahat ng laman loob mo para maka bili ka.', date: new Date('2025-12-12T08:00:24.662Z') } },
          { userEmail: 'robeizagani@gmail.com', comments: 'Pwede hulugan?', date: new Date('2025-12-12T07:59:45.283Z'), reply: { adminEmail: 'asusgogshop@gmail.com', comment: 'Baka patay kana dimo pa nababayaran.', date: new Date('2025-12-12T08:00:49.680Z') } }
        ]
      },
      {
        sku: 'FULL-ROG-4080S-ELITE',
        name: 'ROG Elite Build (RTX 4080 SUPER + B760-F + 32GB DDR5 + 2TB SQ7 + Hyperion Case)',
        brand: 'ASUS ROG',
        category: 'fullbuild',
        price: 206965,
        stock: 4,
        type: 'fullbuild',
        disabled: false,
        specs: {
          gpu: 'GPU-ROG-RTX4080S-OC',
          mobo: 'MB-ROG-B760-F',
          psu: 'PSU-ROG-LOKI-850',
          ram: 'RAM-ROG-STRIX-32GB',
          ssd: 'SSD-ROG-HYPERION-2TB',
          case: 'CASE-ROG-HYPERION',
          cooler: 'COOLER-ROG-RYUO3-240'
        },
        images: ['https://dlcdnwebimgs.asus.com/files/media/87F606EE-FB9D-483A-AE34-FC745A967C99/v2/img/white/color-white.png']
      },
      {
        sku: 'FULL-ROG-4070Ti-PRO',
        name: 'ROG Pro Gaming PC (RTX 4070 Ti SUPER + Z790-E + 32GB DDR5 + 1TB SQ7 + Helios Case)',
        brand: 'ASUS ROG',
        category: 'fullbuild',
        price: 171965,
        stock: 6,
        type: 'fullbuild',
        disabled: false,
        specs: {
          gpu: 'GPU-ROG-RTX4070TI-S',
          mobo: 'MB-ROG-Z790-E',
          psu: 'PSU-ROG-LOKI-850',
          ram: 'RAM-ROG-STRIX-32GB',
          ssd: 'SSD-ROG-HYPERION-1TB',
          case: 'CASE-ROG-HELIOS',
          cooler: 'COOLER-ROG-RYUO3-240'
        },
        images: ['https://dlcdnimgs.asus.com/websites/global/products/g2Pl47nZaToiPUKg/img/pic_FLEXIBLE_GRAPHICS_b.png']
      },
      {
        sku: 'FULL-ROG-4070-BALANCED',
        name: 'ROG Balanced Build (RTX 4070 OC + B760-F + 32GB DDR5 + 1TB SQ7 + Helios Case)',
        brand: 'ASUS ROG',
        category: 'fullbuild',
        price: 121970,
        stock: 7,
        type: 'fullbuild',
        disabled: true, // matches XML
        specs: {
          gpu: 'GPU-ROG-RTX4070-OC',
          mobo: 'MB-ROG-B760-F',
          psu: 'PSU-ROG-LOKI-850',
          ram: 'RAM-ROG-STRIX-32GB',
          ssd: 'SSD-ROG-HYPERION-1TB',
          case: 'CASE-ROG-HELIOS'
        },
        images: ['https://dlcdnimgs.asus.com/websites/global/products/g2Pl47nZaToiPUKg/img/pic_FLEXIBLE_GRAPHICS_b.png'],
        feedback: [
          { userEmail: 'robeizagani@gmail.com', comments: 'Pwede na, pwede na itapon', date: new Date('2025-12-12T07:48:21.265Z'), reply: { adminEmail: 'asusgogshop@gmail.com', comment: "who care's", date: new Date('2025-12-12T07:48:45.021Z') } }
        ]
      },
      {
        sku: 'FULL-ROG-4060Ti-STARTER',
        name: 'ROG Entry Gaming Build (RTX 4060 Ti + B760-F + 32GB DDR5 + 1TB SQ7 + Hyperion Case)',
        brand: 'ASUS ROG',
        category: 'fullbuild',
        price: 115970,
        stock: 10,
        type: 'fullbuild',
        disabled: false,
        specs: {
          gpu: 'GPU-ROG-RTX4060TI',
          mobo: 'MB-ROG-B760-F',
          psu: 'PSU-ROG-LOKI-850',
          ram: 'RAM-ROG-STRIX-32GB',
          ssd: 'SSD-ROG-HYPERION-1TB',
          case: 'CASE-ROG-HYPERION'
        },
        images: ['https://www.ekfluidgaming.com/media/catalog/product/cache/6/image/x800/9df78eab33525d08d6e5fb8d27136e95/e/k/ek-fluidgaming-titan-hero-image_1.png']
      },

      {
        sku: 'CASE-ROG-HELIOS II',
        name: 'ASUS Strix Helios II GX601S',
        brand: 'ASUS ROG',
        category: 'case',
        price: 27995,
        stock: 3,
        type: 'part',
        disabled: false,
        specs: { type: 'Mid Tower', rgb: true },
        images: ['https://dlcdnwebimgs.asus.com/gain/0B4F32D6-B7C0-442A-99E9-AB513DE9C891']
      }
    ];

    for (const p of products) {
      const exists = await Product.findOne({ sku: p.sku });
      if (!exists) {
        await Product.create(p);
        console.log('Seeded:', p.sku);
      } else {
        exists.name = p.name;
        exists.brand = p.brand;
        exists.price = p.price;
        exists.stock = p.stock;
        exists.specs = p.specs;
        exists.images = p.images;
        exists.category = p.category;
        exists.disabled = p.disabled || false;
        await exists.save();
        console.log('Updated:', p.sku);
      }
    }

    console.log('Products seeding finished.');
    process.exit(0);
  } catch (err) {
    console.error('SeedProducts error:', err);
    process.exit(1);
  }
})();
