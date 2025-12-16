import React, { useEffect, useState, useMemo, useRef } from "react";
import api from "../../../api.js";
import styles from "../../css/dashboard.module.css";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name"); // 'name', 'sales', 'quantity'
  const [filterName, setFilterName] = useState("");
  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const res = await api.get("/admin/dashboard-data");
      setData(res.data);
    } catch (err) {
      console.error("fetchDashboardData err", err);
      alert(
        `Failed to load dashboard data: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  }

  async function exportXML(type) {
    try {
      setShowExport(false);
      const response = await api.get(`/admin/export/${type}.xml`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}.xml`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(`Export ${type} error`, err);
      alert(`Failed to export ${type}.xml`);
    }
  }

  useEffect(() => {
    function onDocClick(e) {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setShowExport(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filteredAndSortedRanking = useMemo(() => {
    if (!data || !data.productRanking) return [];
    let filtered = data.productRanking.filter((item) =>
      item.productName.toLowerCase().includes(filterName.toLowerCase())
    );
    if (sortBy === "name") {
      filtered.sort((a, b) => a.productName.localeCompare(b.productName));
    } else if (sortBy === "sales") {
      filtered.sort((a, b) => b.salesProduct - a.salesProduct);
    } else if (sortBy === "quantity") {
      filtered.sort((a, b) => b.quantityPurchased - a.quantityPurchased);
    }
    return filtered;
  }, [data, sortBy, filterName]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!data) return <div className={styles.loading}>No data</div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>DASHBOARD</h2>

        <div className={styles.exportWrapper} ref={exportRef}>
          <button
            className={`${styles.btn} ${styles.exportBtn}`}
            onClick={() => setShowExport((s) => !s)}
            aria-expanded={showExport}
          >
            Export XML
          </button>

          {showExport && (
            <div className={styles.exportDropdown}>
              <button
                className={styles.exportItem}
                onClick={() => exportXML("users")}
              >
                Export Users XML
              </button>
              <button
                className={styles.exportItem}
                onClick={() => exportXML("purchases")}
              >
                Export Purchases XML
              </button>
              <button
                className={styles.exportItem}
                onClick={() => exportXML("products")}
              >
                Export Products XML
              </button>
            </div>
          )}
        </div>
      </header>

      <main className={styles.grid}>
        {/* Left: small summary cards */}
        <section className={styles.leftColumn}>
          <div className={styles.summaryGrid}>
            <div className={styles.card}> {/* Card 1 */}
              <div className={styles.cardInner}>
                <h4>Total Sales</h4>
                <div className={styles.cardValue}>₱{data.totalSales.toLocaleString()}</div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardInner}>
                <h4>Active Products</h4>
                <div className={styles.cardValue}>{data.activeProducts}</div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardInner}>
                <h4>Inactive Products</h4>
                <div className={styles.cardValue}>{data.inActiveProducts}</div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardInner}>
                <h4>Total Users</h4>
                <div className={styles.cardValue}>{data.totalUsers}</div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardInner}>
                <h4>Purchased Product</h4>
                <div className={styles.cardValue}>{data.totalPurchasedProduct}</div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardInner}>
                <h4>Transaction Made</h4>
                <div className={styles.cardValue}>{data.totalTransactionMade}</div>
              </div>
            </div>
          </div>
        </section>

        <aside className={styles.rightColumn}>
          <div className={styles.rankCard}>
            <h3>Product ranking</h3>

            <div className={styles.rankControls}>
              <input
                type="text"
                placeholder="Filter by name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className={styles.input}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.select}
              >
                <option value="name">Sort by Name</option>
                <option value="sales">Sort by Sales Made</option>
                <option value="quantity">Sort by Quantity Purchased</option>
              </select>
            </div>

            <ul className={styles.rankList}>
              {filteredAndSortedRanking.map((item, idx) => (
                <li key={idx} className={styles.rankListItem}>
                  <div className={styles.rankName}>{item.productName}</div>
                  <div className={styles.rankMeta}>
                    <span>₱{item.salesProduct.toLocaleString()}</span>
                    <span>{item.quantityPurchased} pcs</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className={styles.fullWidth}>
          <div className={styles.recentCard}>
            <h3>Recent purchased</h3>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentPurchases.map((purchase, idx) =>
                    purchase.items.map((item, itemIdx) => (
                      <tr key={`${idx}-${itemIdx}`}>
                        {itemIdx === 0 && (
                          <>
                            <td rowSpan={purchase.items.length}>{purchase.email}</td>
                            <td rowSpan={purchase.items.length}>{new Date(purchase.date).toLocaleString()}</td>
                          </>
                        )}
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>₱{item.amount.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div> {/* .tableWrap */}
          </div>
        </section>
      </main>
    </div>
  );
}
