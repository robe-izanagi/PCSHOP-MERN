// frontend/src/pages/AdminAnalytics.jsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../../../api.js";
import { Line } from "react-chartjs-2";
import styles from "../../css/analytics.module.css";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function AdminAnalytics() {
  const [data, setData] = useState({ sales: [], users: [], transactions: [], products: [] });
  const [groupBy, setGroupBy] = useState("days");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchProducts();
  }, [groupBy]);

  async function fetchAnalytics() {
    try {
      const res = await api.get("/admin/analytics", { params: { range: groupBy } });
      setData(res.data);
    } catch (err) {
      console.error("fetchAnalytics err", err);
      alert("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  async function fetchProducts() {
    try {
      const res = await api.get("/products");
      const prods = res.data.products || [];
      setProducts(prods);
      // Set default to highest sales product
      if (prods.length > 0) {
        const highest = prods.reduce((prev, curr) => {
          const prevSales = data.products.filter(p => p.sku === prev.sku).reduce((s, p) => s + p.sales, 0);
          const currSales = data.products.filter(p => p.sku === curr.sku).reduce((s, p) => s + p.sales, 0);
          return currSales > prevSales ? curr : prev;
        });
        setSelectedProduct(highest.sku);
      }
    } catch (err) {
      console.error("fetchProducts err", err);
    }
  }

  const salesLabels = data.sales.map(d => d.period);
  const usersLabels = data.users.map(d => d.period);
  const transactionsLabels = data.transactions.map(d => d.period);

  const productData = useMemo(() => {
    if (!selectedProduct) return { labels: [], sales: [], qty: [] };
    const filtered = data.products.filter(p => p.sku === selectedProduct);
    const periods = [...new Set(filtered.map(p => p.period))].sort();
    const sales = periods.map(p => filtered.find(f => f.period === p)?.sales || 0);
    const qty = periods.map(p => filtered.find(f => f.period === p)?.qty || 0);
    return { labels: periods, sales, qty };
  }, [data.products, selectedProduct]);

  if (loading) return <div className={styles.loading}>Loading analytics…</div>;

  return (
    <div className={styles.analyticsContainer}>
      <h1>Analytics</h1>
      <div className={styles.tableContent}>
        <table>
          <thead>
            <tr>
              <h2>Sales & Analytics</h2>
              <div>
                <label>Group by:</label>
                <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </tr>
          </thead>
          <tbody className={styles.chartContainer}>
            {/* Sales / Income */}
            <tr>
              <h3>Sales / Income (₱)</h3>
              <Line
                data={{
                  labels: salesLabels,
                  datasets: [{
                    label: "Total Sales",
                    data: data.sales.map(d => d.total),
                    fill: false,
                    borderColor: "rgba(75, 192, 192, 1)",
                    tension: 0.3,
                    pointRadius: 3,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </tr>

            {/* Users */}
            <tr>
              <h3>Users Registered</h3>
              <Line
                data={{
                  labels: usersLabels,
                  datasets: [{
                    label: "Users",
                    data: data.users.map(d => d.count),
                    fill: false,
                    borderColor: "rgba(54, 162, 235, 1)",
                    tension: 0.3,
                    pointRadius: 3,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </tr>

            {/* Transaction Made */}
            <tr>
              <h3>Transaction Made</h3>
              <Line
                data={{
                  labels: transactionsLabels,
                  datasets: [{
                    label: "Transactions",
                    data: data.transactions.map(d => d.count),
                    fill: false,
                    borderColor: "rgba(255, 99, 132, 1)",
                    tension: 0.3,
                    pointRadius: 3,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </tr>

            {/* Per Product Sales */}
            <tr>
              <h3>Per Product Sales (₱)</h3>
              <div style={{ marginBottom: 10 }}>
                <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                  {products.map(p => (
                    <option key={p.sku} value={p.sku}>{p.name}</option>
                  ))}
                </select>
              </div>
              <Line
                data={{
                  labels: productData.labels,
                  datasets: [{
                    label: "Sales",
                    data: productData.sales,
                    fill: false,
                    borderColor: "rgba(255, 159, 64, 1)",
                    tension: 0.3,
                    pointRadius: 3,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </tr>

            {/* Per Product Purchased Quantity */}
            <tr>
              <h3>Per Product Purchased Quantity</h3>
              <div style={{ marginBottom: 10 }}>
                <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                  {products.map(p => (
                    <option key={p.sku} value={p.sku}>{p.name}</option>
                  ))}
                </select>
              </div>
              <Line
                data={{
                  labels: productData.labels,
                  datasets: [{
                    label: "Quantity",
                    data: productData.qty,
                    fill: false,
                    borderColor: "rgba(153, 102, 255, 1)",
                    tension: 0.3,
                    pointRadius: 3,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}