import React, { useEffect, useState } from "react";
import api from "../api.js";
import BtnTheme from "../components/BtnTheme";
import GoogleSignIn from "../components/GoogleSignIn.jsx";
import styles from "./css/order.module.css";

const PART_OPTIONS_FALLBACK = {
  gpus: [
    { sku: "GPU-ROG-3080", name: "ROG Strix RTX 3080", price: 70000 },
    { sku: "GPU-ROG-4080", name: "ROG Strix RTX 4080", price: 160000 },
  ],
  mobos: [{ sku: "MB-ROG-Z690", name: "ROG Strix Z690-E", price: 25000 }],
  psus: [{ sku: "PSU-ROG-850", name: "ROG Thor 850W", price: 12000 }],
  rams: [
    { sku: "RAM-ROG-16GB", name: "ROG 16GB DDR5", price: 8000 },
    { sku: "RAM-ROG-32GB", name: "ROG 32GB DDR5", price: 14000 },
  ],
  ssds: [
    { sku: "SSD-ROG-1TB", name: "ROG NVMe 1TB", price: 6000 },
    { sku: "SSD-ROG-2TB", name: "ROG NVMe 2TB", price: 11000 },
  ],
  hdds: [{ sku: "HDD-ROG-2TB", name: "ROG HDD 2TB", price: 3500 }],
  extras: [
    { sku: "FAN-ROG-120", name: "ROG 120mm Fan", price: 800 },
    { sku: "MOUSE-ROG", name: "ROG Mouse", price: 4000 },
    { sku: "KB-ROG", name: "ROG Keyboard", price: 6000 },
  ],
  cases: [{ sku: "CASE-ROG", name: "ROG Case", price: 7000 }],
};

function validEmail(e) {
  return /\S+@\S+\.\S+/.test(e);
}

export default function OrderPage() {
  const [email, setEmail] = useState(""); 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [mode, setMode] = useState("fullbuild");
  const [selectedBuildSku, setSelectedBuildSku] = useState("");
  const [selectedGpu, setSelectedGpu] = useState("");
  const [selectedMobo, setSelectedMobo] = useState("");
  const [selectedPsu, setSelectedPsu] = useState("");
  const [selectedRam, setSelectedRam] = useState("");
  const [selectedSsd, setSelectedSsd] = useState("");
  const [selectedHdd, setSelectedHdd] = useState("");
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [itemsParts, setItemsParts] = useState([{ sku: "", qty: 1 }]);
  const [paymentType, setPaymentType] = useState("gcash");
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [feedbackOpen, setFeedbackOpen] = useState({});
  const [feedbackText, setFeedbackText] = useState({});
  const [submittingFeedback, setSubmittingFeedback] = useState({});

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("pcshop_theme") || "light";
      document.body.classList.remove("light", "dark");
      document.body.classList.add(savedTheme);
    } catch (e) {}
    try {
      const savedEmail = localStorage.getItem("pcshop_email");
      if (savedEmail) setEmail(savedEmail);
    } catch (e) {}
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoadingProducts(true);
    try {
      const res = await api.get("/products");
      const list = res.data?.products || res.data || [];
      if (!Array.isArray(list) || list.length === 0) {
        setProducts(buildProductsFromFallback());
      } else {
        setProducts(list);
        const full = list.find(
          (p) => p.type === "fullbuild" || p.category === "fullbuild"
        );
        if (full) setSelectedBuildSku(full.sku);
        const g = list.find((p) => p.category === "gpu");
        if (g) setSelectedGpu(g.sku);
        const m = list.find((p) => p.category === "motherboard");
        if (m) setSelectedMobo(m.sku);
        const ps = list.find((p) => p.category === "psu");
        if (ps) setSelectedPsu(ps.sku);
        const r = list.find((p) => p.category === "ram");
        if (r) setSelectedRam(r.sku);
        const s = list.find((p) => p.category === "ssd");
        if (s) setSelectedSsd(s.sku);
      }
    } catch (err) {
      console.error("fetchProducts error", err);
      setProducts(buildProductsFromFallback());
    } finally {
      setLoadingProducts(false);
    }
  }

  function buildProductsFromFallback() {
    const out = [];
    const addList = (arr, cat, type = "part") => {
      arr.forEach((it) =>
        out.push({
          sku: it.sku,
          name: it.name,
          price: it.price,
          stock: it.stock ?? 10,
          category: cat,
          brand: "ASUS ROG",
          specs: it.specs || {},
          images: it.images || [],
          type,
        })
      );
    };
    addList(PART_OPTIONS_FALLBACK.gpus, "gpu");
    addList(PART_OPTIONS_FALLBACK.mobos, "motherboard");
    addList(PART_OPTIONS_FALLBACK.psus, "psu");
    addList(PART_OPTIONS_FALLBACK.rams, "ram");
    addList(PART_OPTIONS_FALLBACK.ssds, "ssd");
    addList(PART_OPTIONS_FALLBACK.hdds, "hdd");
    addList(PART_OPTIONS_FALLBACK.extras, "accessory");
    addList(PART_OPTIONS_FALLBACK.cases, "case");

    const fullPrice =
      PART_OPTIONS_FALLBACK.gpus[0].price +
      PART_OPTIONS_FALLBACK.mobos[0].price +
      PART_OPTIONS_FALLBACK.psus[0].price +
      PART_OPTIONS_FALLBACK.rams[0].price +
      PART_OPTIONS_FALLBACK.ssds[0].price +
      PART_OPTIONS_FALLBACK.cases[0].price;
    out.push({
      sku: "FULL-ROG-3080",
      name: "ROG Gaming Full Build (RTX 3080, 16GB, 1TB NVMe)",
      price: fullPrice,
      stock: 5,
      category: "fullbuild",
      type: "fullbuild",
      specs: {
        gpu: "GPU-ROG-3080",
        mobo: "MB-ROG-Z690",
        psu: "PSU-ROG-850",
        ram: "RAM-ROG-16GB",
        ssd: "SSD-ROG-1TB",
        case: "CASE-ROG",
      },
      images: [],
    });
    return out;
  }

  const skuToProduct = (sku) => products.find((p) => p.sku === sku) || null;

  // cart helpers (unchanged)
  function addToCart(sku, qty = 1) {
    if (!sku) return alert("Invalid product.");
    const p = skuToProduct(sku);
    if (!p) return alert("Product not found.");
    if (p.disabled)
      return alert("This product is disabled and cannot be purchased.");
    if ((p.stock ?? 0) <= 0) return alert("This product is out of stock.");
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.sku === sku);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].qty = copy[idx].qty + qty;
        return copy;
      }
      return [...prev, { sku, qty }];
    });
  }
  function removeFromCart(sku) {
    setCart((prev) => prev.filter((i) => i.sku !== sku));
  }
  function updateQty(sku, qty) {
    setCart((prev) =>
      prev.map((i) => (i.sku === sku ? { ...i, qty: Math.max(1, qty) } : i))
    );
  }

  function addFullbuildToCart() {
    if (!selectedBuildSku) return alert("Select a build first.");
    addToCart(selectedBuildSku, 1);
  }
  function addFullbuildAsPartsToCart() {
    const chosen = [
      selectedGpu,
      selectedMobo,
      selectedPsu,
      selectedRam,
      selectedSsd,
    ];
    chosen.forEach((sku) => {
      if (sku) addToCart(sku, 1);
    });
    if (selectedHdd) addToCart(selectedHdd, 1);
    selectedExtras.forEach((sku) => addToCart(sku, 1));
  }
  function toggleExtra(sku) {
    setSelectedExtras((prev) =>
      prev.includes(sku) ? prev.filter((x) => x !== sku) : [...prev, sku]
    );
  }

  function updatePartItem(index, key, value) {
    const copy = [...itemsParts];
    copy[index] = { ...copy[index], [key]: value };
    setItemsParts(copy);
  }
  function addPartRow() {
    setItemsParts((prev) => [
      ...prev,
      { sku: (products[0] && products[0].sku) || "", qty: 1 },
    ]);
  }
  function removePartRow(i) {
    setItemsParts((prev) => prev.filter((_, idx) => idx !== i));
  }

  function calcTotal() {
    if (!Array.isArray(cart) || cart.length === 0) return 0;
    return cart.reduce((s, it) => {
      const p = skuToProduct(it.sku);
      return s + (p ? (p.price || 0) * it.qty : 0);
    }, 0);
  }

  // ---------- SSO via GoogleSignIn ----------
  async function onGoogleSuccess(user) {
    try {
      const saved = localStorage.getItem("pcshop_email") || "";
      if (saved) setEmail(saved);
      else if (user?.email) {
        setEmail(user.email);
        try {
          localStorage.setItem("pcshop_email", user.email);
        } catch (e) {}
      }
      alert(`Signed in as ${user?.email || "unknown"}`);
    } catch (e) {
      console.warn(e);
    }
  }

  async function onGoogleError(err) {
    console.error("Google sign-in error", err);
    alert("Google sign in failed");
  }

  // sign out helper (clears SSO saved state)
  function signOut() {
    try {
      localStorage.removeItem("pcshop_email");
      localStorage.removeItem("pcshop_token");
      localStorage.removeItem("admin_token");
    } catch (e) {}
    setEmail("");
    alert("Signed out (local). Refresh the page to ensure a clean state.");
  }

  // placeOrder: now requires SSO email (from localStorage or state)
  async function placeOrder() {
    const ssoEmail = localStorage.getItem("pcshop_email") || email || "";
    if (!ssoEmail || !validEmail(ssoEmail))
      return alert("Please sign in with Google (SSO) before ordering.");

    let payload = { email: ssoEmail, paymentType };
    if (cart.length > 0) {
      payload.mode = "parts";
      payload.items = cart.map((i) => ({ sku: i.sku, qty: i.qty }));
    } else if (mode === "parts") {
      payload.mode = "parts";
      payload.items = itemsParts.map((it) => ({
        sku: it.sku,
        qty: parseInt(it.qty) || 1,
      }));
    } else {
      payload.mode = "fullbuild";
      const build = skuToProduct(selectedBuildSku);
      if (build && build.type === "fullbuild") {
        payload.buildSku = selectedBuildSku;
        payload.options = { extras: selectedExtras };
      } else {
        payload.buildSku = null;
        payload.options = {
          gpuSku: selectedGpu,
          moboSku: selectedMobo,
          psuSku: selectedPsu,
          ramSku: selectedRam,
          ssdSku: selectedSsd,
          hddSku: selectedHdd || null,
          extras: selectedExtras,
        };
      }
    }

    setLoading(true);
    try {
      const res = await api.post("/orders", payload);
      setReceipt(res.data.purchase || res.data);
      alert("Order placed. Receipt emailed if backend configured.");
      setCart([]);
      setItemsParts([{ sku: products[0]?.sku || "", qty: 1 }]);
      fetchProducts();
    } catch (err) {
      alert(err?.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitFeedbackForSku(sku) {
    const userEmail = localStorage.getItem("pcshop_email") || email || "";
    const comment = (feedbackText[sku] || "").trim();
    if (!userEmail) {
      return alert("Sign in with Google SSO to send feedback.");
    }
    if (!comment) return alert("Enter feedback before submitting.");

    try {
      setSubmittingFeedback((prev) => ({ ...prev, [sku]: true }));
      await api.post(`/products/${encodeURIComponent(sku)}/feedback`, {
        userEmail,
        comments: comment,
      });
      alert("Feedback submitted");
      await fetchProducts();
      setFeedbackText((prev) => ({ ...prev, [sku]: "" }));
      setFeedbackOpen((prev) => ({ ...prev, [sku]: false }));
    } catch (err) {
      alert(err?.response?.data?.message || "Feedback failed");
    } finally {
      setSubmittingFeedback((prev) => ({ ...prev, [sku]: false }));
    }
  }

  // receipt / helper functions (kept)
  function formatCurrency(n) {
    if (!n && n !== 0) return "₱0";
    return "₱" + Number(n).toLocaleString();
  }
  function formatDateISO(d) {
    try {
      const dt = new Date(d || Date.now());
      return dt.toLocaleString();
    } catch (e) {
      return d || "";
    }
  }
  function normalizeReceipt(r) {
    if (!r) return null;
    const out = {};
    out.id = r._id || r.id || r.purchase?.id || null;
    out.date = r.createdAt || r.purchasedAt || new Date().toISOString();
    out.fullname = r.fullname || "";
    out.email = r.email || localStorage.getItem("pcshop_email") || "";
    out.paymentType = r.paymentType || paymentType;
    let items = r.items || r.purchase?.items || [];
    if (!Array.isArray(items)) items = [];
    items = items.map((it) => {
      if (typeof it === "string")
        return {
          sku: it,
          name: skuToProduct(it)?.name || it,
          qty: 1,
          price: skuToProduct(it)?.price || 0,
        };
      const sku =
        it.sku ||
        it.productSku ||
        it.product ||
        it.code ||
        it.skuCode ||
        it.itemSku;
      const qty = it.qty || it.quantity || 1;
      const price = it.price || it.unitPrice || skuToProduct(sku)?.price || 0;
      const name = it.name || skuToProduct(sku)?.name || sku || it.title || "";
      return { sku, name, qty, price };
    });
    out.items = items;
    out.total =
      r.total ||
      r.amount ||
      out.items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
    return out;
  }
  function downloadReceiptPDF() {
    if (!receipt) return alert("No receipt to download.");
    const html = buildReceiptHTML(true);
    const w = window.open("", "_blank");
    if (!w) return alert("Popup blocked");
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }
  function buildReceiptHTML(forPrint) {
    const n = normalizeReceipt(receipt);
    if (!n) return "<div>No receipt</div>";
    const rows = (n.items || [])
      .map(
        (it) =>
          `<tr><td>${it.name}</td><td style="text-align:center">${
            it.qty
          }</td><td style="text-align:right">${formatCurrency(
            it.price
          )}</td><td style="text-align:right">${formatCurrency(
            (it.price || 0) * (it.qty || 1)
          )}</td></tr>`
      )
      .join("");
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Receipt</title></head><body><h2>Receipt</h2><div>${
      n.email
    }</div><table>${rows}</table><div>Total: ${formatCurrency(
      n.total
    )}</div></body></html>`;
    return html;
  }

  function getFullbuilds() {
    const backendFull = products.filter(
      (p) => p.type === "fullbuild" || p.category === "fullbuild"
    );
    if (backendFull.length >= 1) return backendFull;
    const fallback = buildProductsFromFallback().filter(
      (p) => p.type === "fullbuild"
    );
    return fallback;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <div className={styles.title}>Store - ASUS ROG Parts & Builds</div>
            <div className={styles.subtitle}>
              Choose a full build or pick parts - all ROG-branded (demo)
            </div>
          </div>

          <div className={styles.headerRight}>
            <BtnTheme />
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.form}>
            <div className={styles.row}>
              <div className={styles.label}>Sign in</div>

              {!email ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <div className={styles.small}>Sign in to make a purchase</div>

                  <GoogleSignIn
                    onSuccess={onGoogleSuccess}
                    onError={onGoogleError}
                  />
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <div className={styles.small}>Signed in as: {email}</div>

                  <button
                    className={styles.btn}
                    onClick={() => {
                      localStorage.removeItem("pcshop_email");
                      localStorage.removeItem("pcshop_token");

                      try {
                        if (window.google?.accounts?.id) {
                          window.google.accounts.id.disableAutoSelect();
                        }
                      } catch (e) {}

                      setEmail("");
                    }}
                  >
                    Change Account
                  </button>
                </div>
              )}
            </div>

            <hr className={styles.hr} />

            <div className={styles.row}>
              <div className={styles.label}>Order Mode</div>
              <div className={styles.radioGroup}>
                <label
                  className={`${styles.radioOption} ${
                    mode === "fullbuild" ? styles.selected : ""
                  }`}
                  onClick={() => setMode("fullbuild")}
                >
                  <input
                    type="radio"
                    checked={mode === "fullbuild"}
                    onChange={() => setMode("fullbuild")}
                  />
                  Full Build
                </label>

                <label
                  className={`${styles.radioOption} ${
                    mode === "parts" ? styles.selected : ""
                  }`}
                  onClick={() => setMode("parts")}
                >
                  <input
                    type="radio"
                    checked={mode === "parts"}
                    onChange={() => setMode("parts")}
                  />
                  Buy Parts
                </label>
              </div>
            </div>

            <hr className={styles.hr} />

            {mode === "fullbuild" && (
              <div className={styles.sectionBlock}>
                <div className={styles.subheading}>Full Builds</div>
                <div className={styles.gridProducts}>
                  {getFullbuilds().map((fb) => {
                    const img =
                      (fb.images && fb.images[0]) ||
                      fb.image ||
                      `data:image/svg+xml;utf8,${encodeURIComponent(
                        `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180'><rect width='100%' height='100%' fill='#eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#666' font-size='16'>${fb.sku}</text></svg>`
                      )}`;
                    const outOfStock = (fb.stock ?? 0) <= 0;

                    return (
                      <div key={fb.sku} className={styles.productItem}>
                        <div className={styles.thumbWrap}>
                          <img
                            src={img}
                            alt={fb.name}
                            className={styles.thumb}
                          />
                        </div>

                        <div className={styles.productContent}>
                          <div className={styles.productTitle}>{fb.name}</div>

                          <div className={styles.small}>
                            {fb.sku} • {fb.category || fb.type}
                          </div>

                          <p className={styles.paragraph}>
                            {fb.description ||
                              `Includes: GPU ${fb.specs?.gpu || "-"}, RAM ${
                                fb.specs?.ram || "-"
                              }`}
                          </p>

                          <div className={styles.rowInline}>
                            <div className={styles.price}>
                              ₱{(fb.price || 0).toLocaleString()}
                            </div>
                            <div className={styles.small}>
                              Stock: {fb.stock ?? "N/A"}
                            </div>
                          </div>

                          <div className={styles.mt8}>
                            {fb.disabled ? (
                              <div
                                className={`${styles.small} ${styles.statusDisabled}`}
                              >
                                DISABLED - cannot be purchased
                              </div>
                            ) : outOfStock ? (
                              <div
                                className={`${styles.small} ${styles.statusDisabled}`}
                              >
                                OUT OF STOCK - cannot be purchased
                              </div>
                            ) : (
                              <button
                                className={styles.btn}
                                onClick={() => addToCart(fb.sku)}
                              >
                                Add to cart
                              </button>
                            )}
                          </div>

                          <div className={styles.mt8}>
                            <div className={styles.flexRow}>
                              <button
                                className={`${styles.secondary} ${styles.fb}`}
                                onClick={() =>
                                  setFeedbackOpen((prev) => ({
                                    ...prev,
                                    [fb.sku]: !prev[fb.sku],
                                  }))
                                }
                              >
                                Feedback{" "}
                                {(fb.feedback && fb.feedback.length) || 0}
                              </button>
                            </div>

                            {feedbackOpen[fb.sku] && (
                              <div className={styles.mt8}>
                                <textarea
                                  className={styles.textarea}
                                  value={feedbackText[fb.sku] || ""}
                                  onChange={(e) =>
                                    setFeedbackText((prev) => ({
                                      ...prev,
                                      [fb.sku]: e.target.value,
                                    }))
                                  }
                                  placeholder="Write your feedback... (must have purchased before)"
                                />

                                <div className={styles.btnRow}>
                                  <button
                                    className={styles.btn}
                                    onClick={() => submitFeedbackForSku(fb.sku)}
                                    disabled={submittingFeedback[fb.sku]}
                                  >
                                    {submittingFeedback[fb.sku]
                                      ? "Sending..."
                                      : "Send Feedback"}
                                  </button>

                                  <button
                                    className={`${styles.btn} ${styles.secondary}`}
                                    onClick={() =>
                                      setFeedbackOpen((prev) => ({
                                        ...prev,
                                        [fb.sku]: false,
                                      }))
                                    }
                                  >
                                    Cancel
                                  </button>
                                </div>

                                {/* NEW BLOCK — FULL WITH ADMIN REPLY */}
                                {Array.isArray(fb.feedback) &&
                                  fb.feedback.length > 0 && (
                                    <div className={styles.recentFeedback}>
                                      <div className={styles.recentTitle}>
                                        Recent feedback
                                      </div>

                                      {fb.feedback
                                        .slice(-3)
                                        .reverse()
                                        .map((f, idx) => (
                                          <div
                                            key={idx}
                                            className={styles.recentItem}
                                          >
                                            <div
                                              className={styles.recentComment}
                                            >
                                              {f?.comments}
                                            </div>

                                            <div className={styles.recentMeta}>
                                              {f?.userEmail} ·{" "}
                                              {f?.date
                                                ? new Date(
                                                    f.date
                                                  ).toLocaleString()
                                                : ""}
                                            </div>

                                            {f?.reply && (
                                              <div
                                                className={styles.adminReply}
                                              >
                                                <div
                                                  className={
                                                    styles.adminReplyTitle
                                                  }
                                                >
                                                  Reply<br/>
                                                </div>

                                                <div
                                                  className={
                                                    styles.adminReplyText
                                                  }
                                                >
                                                  {f.reply.comment}
                                                </div>

                                                <div
                                                  className={styles.metaText}
                                                >
                                                  {f.reply.adminEmail ||
                                                    "admin"}{" "}
                                                  ·{" "}
                                                  {new Date(
                                                    f.reply.date
                                                  ).toLocaleString()}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {mode === "parts" && (
              <div className={styles.sectionBlock}>
                <div className={styles.subheading}>Shop Items</div>

                <div className={styles.gridProducts}>
                  {products
                    .filter((p) => (p.category || p.type) !== "fullbuild")
                    .map((p) => {
                      const img =
                        (p.images && p.images[0]) ||
                        p.image ||
                        `data:image/svg+xml;utf8,${encodeURIComponent(
                          `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180'><rect width='100%' height='100%' fill='#eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#666' font-size='16'>${p.sku}</text></svg>`
                        )}`;

                      const outOfStock = (p.stock ?? 0) <= 0;

                      return (
                        <div key={p.sku} className={styles.productItem}>
                          <div className={styles.thumbWrap}>
                            <img
                              src={img}
                              alt={p.name}
                              className={styles.thumb}
                            />
                          </div>

                          <div className={styles.productContent}>
                            {Array.isArray(p.variants) &&
                              p.variants.length > 0 && (
                                <select
                                  className={`${styles.select} ${styles.mb8}`}
                                >
                                  {p.variants.map((v) => (
                                    <option key={v.id} value={v.id}>
                                      {v.label}
                                    </option>
                                  ))}
                                </select>
                              )}

                            <div className={styles.productTitle}>{p.name}</div>

                            <div className={styles.small}>
                              {p.sku} • {p.category || p.type || "part"}
                            </div>

                            <p className={styles.paragraph}>
                              {p.description || p.specs?.short || ""}
                            </p>

                            <div className={styles.rowInline}>
                              <div className={styles.price}>
                                ₱{(p.price || 0).toLocaleString()}
                              </div>
                              <div className={styles.small}>
                                Stock: {p.stock ?? "N/A"}
                              </div>
                            </div>

                            <div className={styles.mt8}>
                              {p.disabled ? (
                                <div
                                  className={`${styles.small} ${styles.statusDisabled}`}
                                >
                                  DISABLED - cannot be purchased
                                </div>
                              ) : outOfStock ? (
                                <div
                                  className={`${styles.small} ${styles.statusDisabled}`}
                                >
                                  OUT OF STOCK - cannot be purchased
                                </div>
                              ) : (
                                <button
                                  className={styles.btn}
                                  onClick={() => addToCart(p.sku)}
                                >
                                  Add to cart
                                </button>
                              )}
                            </div>

                            <div className={styles.mt8}>
                              <div className={styles.flexRow}>
                                <button
                                  className={styles.secondary}
                                  onClick={() =>
                                    setFeedbackOpen((prev) => ({
                                      ...prev,
                                      [p.sku]: !prev[p.sku],
                                    }))
                                  }
                                >
                                  Feedback{" "}
                                  {(p.feedback && p.feedback.length) || 0}
                                </button>
                              </div>

                              {feedbackOpen[p.sku] && (
                                <div className={styles.mt8}>
                                  <textarea
                                    className={styles.textarea}
                                    value={feedbackText[p.sku] || ""}
                                    onChange={(e) =>
                                      setFeedbackText((prev) => ({
                                        ...prev,
                                        [p.sku]: e.target.value,
                                      }))
                                    }
                                    placeholder="Write your feedback... (must have purchased before)"
                                  />

                                  <div className={styles.btnRow}>
                                    <button
                                      className={styles.btn}
                                      onClick={() =>
                                        submitFeedbackForSku(p.sku)
                                      }
                                      disabled={submittingFeedback[p.sku]}
                                    >
                                      {submittingFeedback[p.sku]
                                        ? "Sending..."
                                        : "Send Feedback"}
                                    </button>

                                    <button
                                      className={`${styles.btn} ${styles.secondary}`}
                                      onClick={() =>
                                        setFeedbackOpen((prev) => ({
                                          ...prev,
                                          [p.sku]: false,
                                        }))
                                      }
                                    >
                                      Cancel
                                    </button>
                                  </div>

                                  {/* NEW USER VIEW FEEDBACK LIST W/ ADMIN REPLY */}
                                  {Array.isArray(p.feedback) &&
                                    p.feedback.length > 0 && (
                                      <div className={styles.recentFeedback}>
                                        <div className={styles.recentTitle}>
                                          Recent feedback
                                        </div>

                                        {p.feedback
                                          .slice(-3)
                                          .reverse()
                                          .map((f, idx) => (
                                            <div
                                              key={idx}
                                              className={styles.recentItem}
                                            >
                                              <div
                                                className={styles.recentComment}
                                              >
                                                {f?.comments}
                                              </div>

                                              <div
                                                className={styles.recentMeta}
                                              >
                                                {f?.userEmail} ·{" "}
                                                {f?.date
                                                  ? new Date(
                                                      f.date
                                                    ).toLocaleString()
                                                  : ""}
                                              </div>

                                              {f?.reply && (
                                                <div
                                                  className={styles.adminReply}
                                                >
                                                  <div
                                                    className={
                                                      styles.adminReplyTitle
                                                    }
                                                  >
                                                    Admin reply
                                                  </div>

                                                  <div
                                                    className={
                                                      styles.adminReplyText
                                                    }
                                                  >
                                                    {f.reply.comment}
                                                  </div>

                                                  <div
                                                    className={styles.metaText}
                                                  >
                                                    {f.reply.adminEmail ||
                                                      "admin"}{" "}
                                                    ·{" "}
                                                    {new Date(
                                                      f.reply.date
                                                    ).toLocaleString()}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          <aside className={styles.side}>
            <div className={styles.summaryTitle}>Cart</div>
            {cart.length === 0 && (
              <div className={styles.small}>Cart is empty</div>
            )}
            {cart.map((i) => {
              const p = skuToProduct(i.sku) || {};
              return (
                <div key={i.sku} className={styles.cartItem}>
                  <div className={styles.cartItemContent}>
                    <div className={styles.cartTitle}>{p.name || i.sku}</div>
                    <div className={styles.small}>
                      ₱{(p.price || 0).toLocaleString()}
                    </div>
                    <div className={styles.small}>
                      Stock: {p.stock ?? "N/A"}
                    </div>
                  </div>
                  <input
                    className={styles.qtyInput}
                    type="number"
                    value={i.qty}
                    min="1"
                    onChange={(e) =>
                      updateQty(i.sku, parseInt(e.target.value) || 1)
                    }
                  />
                  <button
                    className={styles.btn}
                    onClick={() => removeFromCart(i.sku)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}

            <div className={styles.total + " " + styles.mt12}>
              <div>Total</div>
              <div>₱{calcTotal().toLocaleString()}</div>
            </div>

            <div className={styles.mt12}>
              <div className={styles.label}>Payment</div>

              <div className={styles.radioGroup}>
                <label
                  className={`${styles.radioOption} ${
                    paymentType === "gcash" ? styles.selected : ""
                  } ${styles.payOption}`}
                  onClick={() => setPaymentType("gcash")}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentType === "gcash"}
                    onChange={() => setPaymentType("gcash")}
                  />
                  GCash
                </label>

                <label
                  className={`${styles.radioOption} ${
                    paymentType === "paymaya" ? styles.selected : ""
                  } ${styles.payOption}`}
                  onClick={() => setPaymentType("paymaya")}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentType === "paymaya"}
                    onChange={() => setPaymentType("paymaya")}
                  />
                  PayMaya
                </label>

                <label
                  className={`${styles.radioOption} ${
                    paymentType === "paypal" ? styles.selected : ""
                  } ${styles.payOption}`}
                  onClick={() => setPaymentType("paypal")}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentType === "paypal"}
                    onChange={() => setPaymentType("paypal")}
                  />
                  PayPal
                </label>
              </div>
            </div>

            <div className={styles.mt12 + " " + styles.flexRow}>
              <button
                className={styles.btn}
                onClick={placeOrder}
                disabled={loading}
              >
                Place Order
              </button>
              <button
                className={`${styles.btn} ${styles.secondary} ${styles.ml8}`}
                onClick={() => {
                  setCart([]);
                  setItemsParts([{ sku: products[0]?.sku || "", qty: 1 }]);
                  setSelectedExtras([]);
                }}
              >
                Reset
              </button>
            </div>

            {receipt && (
              <div className={styles.receipt + " " + styles.mt12}>
                <div className={styles.receiptHeader}>
                  <strong>Receipt</strong>
                  <div className={styles.receiptActions}>
                    <button className={styles.btn} onClick={downloadReceiptPDF}>
                      Download PDF
                    </button>
                  </div>
                </div>
                <div className={styles.receiptBody}>
                  <div className={styles.productTitle}>
                    {normalizeReceipt(receipt)?.fullname || ""}
                  </div>
                  <div className={styles.recentMeta}>
                    {normalizeReceipt(receipt)?.email ||
                      localStorage.getItem("pcshop_email") ||
                      ""}
                  </div>
                  <div className={styles.mt8}>
                    <div className={styles.rowInline}>
                      <div style={{ fontWeight: 700 }}>Item</div>
                      <div style={{ fontWeight: 700 }}>Total</div>
                    </div>
                    <div className={styles.mt8}>
                      {(normalizeReceipt(receipt)?.items || []).map(
                        (it, idx) => (
                          <div key={idx} className={styles.receiptRow}>
                            <div className={styles.receiptName}>{it.name}</div>
                            <div className={styles.receiptAmount}>
                              {formatCurrency((it.price || 0) * (it.qty || 1))}{" "}
                              <span className={styles.recentMeta}>
                                ×{it.qty}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    <div className={styles.receiptTotal}>
                      <div>Total</div>
                      <div>
                        {formatCurrency(normalizeReceipt(receipt)?.total)}
                      </div>
                    </div>
                    <div className={styles.mt8 + " " + styles.recentMeta}>
                      Payment:{" "}
                      {normalizeReceipt(receipt)?.paymentType || paymentType} ·
                      Date: {formatDateISO(normalizeReceipt(receipt)?.date)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.mt12 + " " + styles.small}>
              Note: Prices are demo / market examples.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
