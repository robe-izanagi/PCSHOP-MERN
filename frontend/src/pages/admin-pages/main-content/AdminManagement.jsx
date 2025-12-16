import React, { useEffect, useState, useRef } from "react";
import api from "../../../api.js";
import styles from "../../css/management.module.css";

export default function AdminManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSku, setEditingSku] = useState(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [form, setForm] = useState({
    sku: "",
    name: "",
    brand: "ASUS ROG",
    category: "part",
    price: 0,
    stock: 0,
    type: "part",
    images: [],
    specs: {},
  });

  const [specsText, setSpecsText] = useState(() =>
    form?.specs && Object.keys(form.specs).length
      ? JSON.stringify(form.specs)
      : ""
  );

  useEffect(() => {
    setSpecsText(
      form?.specs && Object.keys(form.specs).length
        ? JSON.stringify(form.specs)
        : ""
    );
  }, [form.specs]);

  const [feedbackOpenForSku, setFeedbackOpenForSku] = useState({}); // { sku: true }
  const [feedbackReplyText, setFeedbackReplyText] = useState({}); // { sku: { idx: text } }
  const [submittingReply, setSubmittingReply] = useState({}); // { `${sku}-${idx}`: true }

  const fetchTimer = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    fetchTimer.current = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(fetchTimer.current);
  }, [query, categoryFilter]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await api.get("/products", {
        params: {
          q: query || undefined,
          category: categoryFilter || undefined,
        },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("fetchProducts err", err);
      alert(err?.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingSku(null);
    setForm({
      sku: "",
      name: "",
      brand: "ASUS ROG",
      category: "part",
      price: 0,
      stock: 0,
      type: "part",
      images: [],
      specs: {},
    });
  }

  function startEdit(p) {
    setEditingSku(p.sku);
    setForm({
      sku: p.sku,
      name: p.name || "",
      brand: p.brand || "ASUS ROG",
      category: p.category || "part",
      price: p.price || 0,
      stock: p.stock || 0,
      type: p.type || "part",
      images: p.images || [],
      specs: p.specs || {},
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct() {
    if (!form.sku || !form.name) return alert("SKU and Name are required");
    try {
      if (editingSku) {
        await api.put(`/products/${editingSku}`, form);
        alert("Product updated");
      } else {
        await api.post("/products", form);
        alert("Product created");
      }
      resetForm();
      // refresh immediately
      fetchProducts();
    } catch (err) {
      console.error("saveProduct err", err);
      alert(err?.response?.data?.message || "Save failed");
    }
  }

  async function addStockPrompt(sku) {
    const val = prompt("Add quantity (positive integer):", "10");
    if (!val) return;
    const qty = parseInt(val);
    if (!qty || qty <= 0) return alert("Enter a positive integer");
    try {
      await api.post(`/products/${sku}/add-stock`, { qty });
      alert("Stock added");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Add stock failed");
    }
  }

  async function toggleDisable(sku, currentDisabled) {
    const action = currentDisabled ? "Enable" : "Disable";
    if (!confirm(`${action} this product?`)) return;
    try {
      await api.post(`/products/${sku}/disable`, {
        disabled: !currentDisabled,
      });
      alert(`${action}d`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || `${action} failed`);
    }
  }

  async function deleteProduct(sku) {
    if (!confirm("DELETE this product permanently? This cannot be undone."))
      return;
    try {
      await api.delete(`/products/${sku}`);
      alert("Product deleted");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  }

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function toggleFeedbackPanel(sku) {
    setFeedbackOpenForSku((prev) => ({ ...prev, [sku]: !prev[sku] }));
  }

  function setReplyText(sku, idx, text) {
    setFeedbackReplyText((prev) => ({
      ...prev,
      [sku]: { ...(prev[sku] || {}), [idx]: text },
    }));
  }

  async function submitReply(sku, idx) {
    const text = (feedbackReplyText[sku] && feedbackReplyText[sku][idx]) || "";
    if (!text.trim()) return alert("Enter a reply before sending.");
    const key = `${sku}-${idx}`;
    try {
      setSubmittingReply((prev) => ({ ...prev, [key]: true }));
      await api.post(
        `/admin/products/${encodeURIComponent(sku)}/feedback/${idx}/reply`,
        {
          adminEmail: "asusgogshop@gmail.com",
          comment: text.trim(),
        }
      );
      alert("Reply saved");
      await fetchProducts();
      setFeedbackReplyText((prev) => ({
        ...(prev || {}),
        [sku]: { ...(prev?.[sku] || {}), [idx]: "" },
      }));
    } catch (err) {
      console.error("submitReply err", err);
      alert(err?.response?.data?.message || "Reply failed");
    } finally {
      setSubmittingReply((prev) => ({ ...prev, [key]: false }));
    }
  }

  // ---- render ----
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Product Management</h2>

      <div className={`${styles.searchRow} ${styles.mb12} ${styles.flexWrap}`}>
        <input
          placeholder="Search by name or sku..."
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchProducts();
          }}
        />
        <select
          className={styles.select}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All categories</option>
          <option value="gpu">GPU</option>
          <option value="motherboard">Motherboard</option>
          <option value="ram">RAM</option>
          <option value="ssd">SSD</option>
          <option value="hdd">HDD</option>
          <option value="psu">PSU</option>
          <option value="case">Case</option>
          <option value="cooler">Cooler</option>
          <option value="accessory">Accessory</option>
          <option value="fullbuild">Fullbuild</option>
        </select>
        <button
          className={`${styles.btn} ${styles.secondary}`}
          onClick={fetchProducts}
        >
          Refresh
        </button>
      </div>

      {/* Edit / Create form */}
      <div className={`${styles.card} ${styles.mb12}`}>
        <div
          className={`${styles.flexRow} ${styles.gap12} ${styles.flexWrap} ${styles.minWidth300}`}
        >
          <input
            className={`${styles.input} ${styles.w160}`}
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setField("sku", e.target.value)}
          />
          <input
            className={`${styles.input} ${styles.flex1}`}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
          />
          <input
            className={`${styles.input} ${styles.w160}`}
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => setField("brand", e.target.value)}
          />
          <select
            className={`${styles.select} ${styles.w160}`}
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
          >
            <option value="part">part</option>
            <option value="gpu">gpu</option>
            <option value="motherboard">motherboard</option>
            <option value="ram">ram</option>
            <option value="ssd">ssd</option>
            <option value="hdd">hdd</option>
            <option value="psu">psu</option>
            <option value="case">case</option>
            <option value="accessory">accessory</option>
            <option value="fullbuild">fullbuild</option>
          </select>
          <input
            className={`${styles.input} ${styles.w140}`}
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setField("price", Number(e.target.value) || 0)}
          />
          <input
            className={`${styles.input} ${styles.w120}`}
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setField("stock", Number(e.target.value) || 0)}
          />
        </div>

        <div
          className={`${styles.mt10} ${styles.flexRow} ${styles.gap8} ${styles.flexWrap}`}
        >
          <input
            className={`${styles.input} ${styles.flex1}`}
            placeholder="Image URLs (comma separated)"
            value={(form.images || []).join(",")}
            onChange={(e) =>
              setField(
                "images",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
          />
          <input
            className={`${styles.input} ${styles.flex1}`}
            placeholder='Specs as JSON e.g. {"vram":"10GB"}'
            value={specsText}
            onChange={(e) => {
              const v = e.target.value;
              setSpecsText(v);

              if (!v.trim()) {
                setField("specs", {});
                return;
              }

              try {
                const obj = JSON.parse(v);
                if (obj && typeof obj === "object") {
                  setField("specs", obj);
                }
              } catch (err) {
              }
            }}
          />

          <button className={styles.btn} onClick={saveProduct}>
            {editingSku ? "Save Changes" : "Create Product"}
          </button>
          <button
            className={`${styles.btn} ${styles.secondary}`}
            onClick={resetForm}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* product grid */}
      <div className={styles.productGrid}>
        {loading && <div>Loading...</div>}
        {!loading && products.length === 0 && (
          <div className={styles.small}>No products found.</div>
        )}
        {products.map((p) => (
          <div key={p.sku} className={styles.productItem}>
            <div className={styles.flexCol}>
              <img
                src={
                  (p.images && p.images[0]) ||
                  "https://via.placeholder.com/160x90?text=ROG"
                }
                alt={p.name}
                className={styles.thumb}
              />
              <div className={styles.itemContent}>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div className={styles.small}>
                  {p.sku} • {p.category} • {p.brand}
                </div>
                <div className={styles.price}>
                  ₱{(p.price || 0).toLocaleString()}
                </div>
                <div className={styles.small}>
                  Stock: {p.stock} •{" "}
                  {p.disabled ? (
                    <span className={styles.statusDisabled}>DISABLED</span>
                  ) : (
                    <span className={styles.statusActive}>ACTIVE</span>
                  )}
                </div>
                {p.stock < 1 && (
                  <div className={styles.small}>
                    <span className={styles.oos}>Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* action buttons */}
            <div
              className={`${styles.flexRow} ${styles.gap8} ${styles.mt10}`}
              style={{ justifyContent: "flex-end" }}
            >
              <button className={styles.btn} onClick={() => startEdit(p)}>
                Edit
              </button>
              <button
                className={`${styles.btn} ${styles.secondary}`}
                onClick={() => addStockPrompt(p.sku)}
              >
                Add Stock
              </button>
              <button
                className={`${styles.btn} ${styles.secondary}`}
                onClick={() => toggleDisable(p.sku, !!p.disabled)}
              >
                {p.disabled ? "Enable" : "Disable"}
              </button>
              <button
                className={`${styles.btn} ${styles.secondary}`}
                onClick={() => deleteProduct(p.sku)}
              >
                Delete
              </button>
            </div>

            {/* feedback list + reply UI */}
            <div className={styles.feedbackBlock}>
              <div className={styles.feedbackHeader}>
                <div style={{ fontWeight: 700 }}>Feedback</div>
                <div>
                  <button
                    className={`${styles.btn} ${styles.secondary}`}
                    onClick={() => toggleFeedbackPanel(p.sku)}
                  >
                    {feedbackOpenForSku[p.sku]
                      ? "Hide"
                      : `Show (${(p.feedback && p.feedback.length) || 0})`}
                  </button>
                </div>
              </div>

              {feedbackOpenForSku[p.sku] && (
                <div className={styles.mt10}>
                  {!p.feedback || p.feedback.length === 0 ? (
                    <div className={styles.small}>No feedback yet.</div>
                  ) : (
                    <div>
                      {p.feedback.map((f, idx) => (
                        <div key={idx} className={styles.feedbackItem}>
                          <div className={styles.commentText}>{f.comments}</div>
                          <div className={styles.metaText}>
                            {f.userEmail} · {new Date(f.date).toLocaleString()}
                          </div>

                          {/* existing admin reply (if any) */}
                          {f.reply && (
                            <div className={styles.adminReply}>
                              <div className={styles.adminReplyTitle}>
                                Admin reply
                              </div>
                              <div style={{ fontSize: 13 }}>
                                {f.reply.comment}
                              </div>
                              <div className={styles.metaText}>
                                {f.reply.adminEmail || "admin"} ·{" "}
                                {new Date(f.reply.date).toLocaleString()}
                              </div>
                            </div>
                          )}

                          {/* reply input */}
                          <div className={styles.replyArea}>
                            <textarea
                              className={styles.textarea}
                              value={
                                (feedbackReplyText[p.sku] &&
                                  feedbackReplyText[p.sku][idx]) ||
                                ""
                              }
                              onChange={(e) =>
                                setReplyText(p.sku, idx, e.target.value)
                              }
                              placeholder="Write admin reply..."
                            />
                            <div className={styles.btnRow}>
                              <button
                                className={styles.btn}
                                onClick={() => submitReply(p.sku, idx)}
                                disabled={submittingReply[`${p.sku}-${idx}`]}
                              >
                                {submittingReply[`${p.sku}-${idx}`]
                                  ? "Sending..."
                                  : "Send reply"}
                              </button>
                              <button
                                className={`${styles.btn} ${styles.secondary}`}
                                onClick={() => setReplyText(p.sku, idx, "")}
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
