import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPercentage > 0;

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-image">
        {product.imageUrls && product.imageUrls.length > 0 ? (
          <img src={product.imageUrls[0]} alt={product.name} />
        ) : (
          <span style={{ color: "#999" }}>No image</span>
        )}
      </div>

      <h3 style={{ fontSize: 16, margin: "0 0 4px" }}>{product.name}</h3>
      <p style={{ fontSize: 13, color: "#666", margin: "0 0 8px" }}>{product.brand}</p>

      {product.numberOfReviews > 0 && (
        <p style={{ fontSize: 13, margin: "0 0 8px" }}>
          ⭐ {product.averageRating.toFixed(1)} ({product.numberOfReviews} reviews)
        </p>
      )}

      <div style={{ marginTop: "auto" }}>
        <span style={{ fontSize: 18, fontWeight: "bold" }}>
          ₹{product.finalPrice.toLocaleString()}
        </span>
        {hasDiscount && (
          <>
            <span style={{ fontSize: 13, color: "#999", textDecoration: "line-through", marginLeft: 8 }}>
              ₹{product.price.toLocaleString()}
            </span>
            <span style={{ fontSize: 13, color: "green", marginLeft: 8 }}>
              {product.discountPercentage}% off
            </span>
          </>
        )}
      </div>

      {!product.inStock && (
        <p style={{ color: "red", fontSize: 13, marginTop: 4 }}>Out of stock</p>
      )}
    </Link>
  );
}