import React from 'react';
import styles from '../pages/order.module.css';

export default function ProductCard({ product, onAdd }) {
  const img = (product.images && product.images[0]) || product.image || `https://via.placeholder.com/320x180?text=${encodeURIComponent(product.sku)}`;
  const outOfStock = (product.stock ?? 0) <= 0;
  return (
    <div className={styles.productCard}>
      <div className={styles.productMedia}>
        <img src={img} alt={product.name} className={styles.productImage} />
        {(product.disabled || outOfStock) && (
          <div className={styles.productOverlay}>
            {product.disabled ? <span className={styles.overlayText}>DISABLED</span> : <span className={styles.overlayText}>OUT OF STOCK</span>}
          </div>
        )}
      </div>

      <div className={styles.productBody}>
        <div className={styles.productTitle}>{product.name}</div>
        <div className={styles.productMeta}>
          <div className={styles.small}>{product.sku} • {product.category || product.type || 'part'}</div>
          <div style={{ fontWeight: 800 }}>₱{(product.price || 0).toLocaleString()}</div>
          <div className={styles.small}>Stock: {product.stock ?? 'N/A'}</div>
        </div>

        <div className={styles.productActions}>
          {/* If product has variants (not in seed) you could render a select here.
              For now show Add to Cart button which is disabled when product.disabled or outOfStock */}
          <button
            className={styles.btn}
            onClick={() => onAdd(product.sku)}
            disabled={product.disabled || outOfStock}
            title={product.disabled ? 'Disabled by admin' : (outOfStock ? 'Out of stock' : 'Add to cart')}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
