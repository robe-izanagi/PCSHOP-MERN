// frontend/src/components/Products.jsx
import React, { useState, useEffect } from "react";
import styles from "./product.module.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

//
// =======================
// HARD-CODED PRODUCTS
// =======================
//

// PARTS – top per subcategory
const parts = [
  {
    id: "psu-1200w",
    name: "ASUS ROG Thor 1200W Platinum II",
    image: "https://dlcdnwebimgs.asus.com/gain/684DD066-82FC-4C2B-A0DB-7957EA004D40",
    specs: "1200W • 80+ Platinum",
    category: "psu",
    width: "400px"
  },
  {
    id: "gpu-4080s",
    name: "ASUS ROG Strix GeForce RTX 4080 SUPER OC 16GB",
    image:
    "https://dlcdnwebimgs.asus.com/files/media/090C91F5-62E1-4C17-8A58-53D4C941795D/v1/img/aura/aura-pd.png",
    specs: "16GB GDDR6X • RTX 4080 SUPER • OC Edition",
    category: "gpu",
    width: "500px"
  },
  {
    id: "mobo-hero",
    name: "ASUS ROG Crosshair X670E Hero",
    image:
    "https://dlcdnwebimgs.asus.com/files/media/0CBC145C-59B8-4B51-BF1A-DA0749FA1522/v1/img/cooling/headers/header-base.png",
    specs: "X670E • AM5 • DDR5",
    category: "motherboard",
    width: "400px"
  },
  {
    id: "ram-32gb-6400",
    name: "ASUS ROG Strix 32GB DDR5 6400MHz",
    image:
    "https://mizzostore.com/cdn/shop/files/p_lancer_ddr5_rog_5_700x_4060f5e3-a0d1-4687-a2fd-1055ec6c3255.webp?v=1731693639&width=700",
    specs: "32GB • 6400MHz • DDR5",
    category: "ram",
    width: "450px"
  },
  {
    id: "ssd-1tb",
    name: "ASUS ROG Strix SQ7 NVMe PCIe 4.0 1TB",
    image: "https://dlcdnwebimgs.asus.com/gain/FC3B53D4-55AC-46C0-922B-1309F5765ECE",
    specs: "1TB • NVMe PCIe 4.0",
    category: "ssd",
    width: "450px"
  },
  {
    id: "case-helios",
    name: "ASUS ROG Strix Helios GX601",
    image:
    "https://dlcdnwebimgs.asus.com/gain/24CDD4E4-1FC5-4034-A289-8212BE7F4573/w1000/h732",
    specs: "Mid Tower • RGB",
    category: "case",
    width: "500px"
  },
  {
    id: "cooler-ryujin3",
    name: "ASUS ROG Ryujin III 360 ARGB",
    image: "https://dlcdnwebimgs.asus.com/gain/A1D6D78A-00BE-4F89-A360-2790312CDDAD",
    specs: "AIO 360mm • 3.5” LCD",
    category: "cooler",
    width: "400px"
  },
];

// ACCESSORY – ALL
const accessory = [
  {
    id: "acc-kb",
    name: "ASUS ROG Falchion 65% Wireless Keyboard",
    image: "https://ecommerce.datablitz.com.ph/cdn/shop/products/3_55ad5a45-95a7-413f-9d4b-2357a35202d3_800x.png?v=1676808420",
    specs: "Wireless • ROG RX Switches",
    width: "650px"
  },
  {
    id: "acc-mouse",
    name: "ASUS ROG Gladius III Wireless",
    image:
    "https://dlcdnwebimgs.asus.com/gain/F38517C3-9D47-468A-9232-13D8DD7F6D28/w260/fwebp",
    specs: "26000 DPI • Wireless",
    width: "350px"
  },
  {
    id: "acc-headset",
    name: "ASUS ROG Delta S Gaming Headset",
    image:
    "https://dlcdnwebimgs.asus.com/files/media/E4C7EB4C-9C4F-4A00-826E-B581BE704F8A/v1/img/kv/rog-delta-s-core.png",
    specs: "AI Noise Canceling • Hi-Res Audio",
    width: "400px"
  },
  {
    id: "acc-monitor",
    name: 'ASUS ROG Strix XG27AQ 27" 170Hz IPS',
    image: "https://dlcdnwebimgs.asus.com/gain/AEEEEB76-572C-4F85-8727-77DCCA3073F0",
    specs: "170Hz • 1440p IPS",
    width: "600px"
  },
];

// FULLBUILD – ALL
const fullbuild = [
  {
    id: "fb-4090",
    name:
    "ROG Ultimate Gaming Rig",
    image: "https://rog.asus.com/media/1754655347369.png",
    specs: "RTX 4090 • 64GB DDR5 • 2TB • Z790-E • Helios • Ryujin III",
    width: "500px"
  },
  {
    id: "fb-4080s",
    name:
    "ROG Elite Build",
    image:
    "https://dlcdnwebimgs.asus.com/files/media/87F606EE-FB9D-483A-AE34-FC745A967C99/v2/img/white/color-white.png",
    specs: "RTX 4080 SUPER • 32GB DDR5 • 2TB • Hyperion",
    width: "500px"
  },
  {
    id: "fb-4070ti",
    name:
    "ROG Pro Gaming PC",
    image:
    "https://dlcdnimgs.asus.com/websites/global/products/g2Pl47nZaToiPUKg/img/pic_FLEXIBLE_GRAPHICS_b.png",
    specs: "RTX 4070 Ti SUPER • 32GB DDR5 • 1TB • Helios",
    width: "400px"
  },
  {
    id: "fb-4060ti",
    name:
    "ROG Entry Gaming Build",
    image:
    "https://www.ekfluidgaming.com/media/catalog/product/cache/6/image/x800/9df78eab33525d08d6e5fb8d27136e95/e/k/ek-fluidgaming-titan-hero-image_1.png",
    specs: "RTX 4060 Ti • 32GB DDR5 • 1TB • Hyperion",
    width: "500px"
  },
];

//
// =======================
// COMPONENT
// =======================
//

export default function Products({ viewedProduct }) {
  const [index, setIndex] = useState(0);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    let arr = [];

    if (viewedProduct === "parts") arr = parts;
    else if (viewedProduct === "accessory") arr = accessory;
    else if (viewedProduct === "fullbuild") arr = fullbuild;

    setCards(arr);
    setIndex(0);
  }, [viewedProduct]);

  const n = cards.length;

  useEffect(() => {
    if (n === 0) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % n), 8000);
    return () => clearInterval(t);
  }, [n]);

  const prev = () => setIndex((i) => (i - 1 + n) % n);
  const next = () => setIndex((i) => (i + 1) % n);

  const relPos = (i) => {
    const diff = (i - index + n) % n;
    if (diff === 0) return 0;
    if (diff === 1) return 1;
    if (diff === n - 1) return -1;
    return 2;
  };

  const current = cards[index] || {};

  return (
    <section className={styles.container}>
      <div className={styles.left}>
        <h1 className={styles.title}>{current.name || "—"}</h1>
        <p className={styles.lead}>{current.specs || ""}</p>
      </div>

      <div className={styles.right}>
        <div className={styles.carousel}>
          {cards.map((d, i) => {
            const pos = relPos(i);
            const classes = [
              styles.card,
              pos === 0 ? styles.center : "",
              pos === 1 ? styles.rightCard : "",
              pos === -1 ? styles.leftCard : "",
              pos === 2 ? styles.hidden : "",
            ].join(" ");

            return (
              <div key={d.id} className={classes}>
                <img
                  src={d.image}
                  alt={d.name}
                  className={styles.img}
                  style={{ width: d.width, height: "auto" }}
                />
              </div>
            );
          })}

          {n > 0 && (
            <>
              <button className={styles.arrowLeft} onClick={prev}>
                <FaArrowLeft />
              </button>
              <button className={styles.arrowRight} onClick={next}>
                <FaArrowRight />
              </button>
            </>
          )}
        </div>

        <div className={styles.dots}>
          {cards.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${
                i === index ? styles.dotActive : ""
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
