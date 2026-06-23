import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../api/productApi";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function fetchProduct() {
      setLoading(true);
      setError("");
      try {
        const response = await getProductById(id);
        if (!isCancelled) {
          setProduct(response.data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError("Product not found.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p style={{ padding: 24 }}>Loading product...</p>;
  }

  if (error || !product) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: "red" }}>{error || "Product not found."}</p>
        <Link to="/">← Back to products</Link>
      </div>
    );
  }

  const hasDiscount = product.discountPercentage > 0;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <Link to="/" style={{ display: "inline-block", marginBottom: 16 }}>
        ← Back to products
      </Link>

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        {/* Image */}
        <div
          style={{
            flex: "1 1 300px",
            height: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {product.imageUrls && product.imageUrls.length > 0 ? (
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
            />
          ) : (
            <span style={{ color: "#999" }}>No image available</span>
          )}
        </div>

        {/* Details */}
        <div style={{ flex: "1 1 300px" }}>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>{product.name}</h1>
          <p style={{ color: "#666", marginBottom: 12 }}>{product.brand}</p>

          {product.numberOfReviews > 0 && (
            <p style={{ marginBottom: 12 }}>
              ⭐ {product.averageRating.toFixed(1)} ({product.numberOfReviews} reviews)
            </p>
          )}

          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 28, fontWeight: "bold" }}>
              ₹{product.finalPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span
                  style={{
                    fontSize: 16,
                    color: "#999",
                    textDecoration: "line-through",
                    marginLeft: 10,
                  }}
                >
                  ₹{product.price.toLocaleString()}
                </span>
                <span style={{ fontSize: 16, color: "green", marginLeft: 10 }}>
                  {product.discountPercentage}% off
                </span>
              </>
            )}
          </div>

          <p
            style={{
              marginBottom: 16,
              fontWeight: "bold",
              color: product.inStock ? "green" : "red",
            }}
          >
            {product.inStock ? `In stock (${product.stockQuantity} available)` : "Out of stock"}
          </p>

          <button
            disabled={!product.inStock}
            style={{
              padding: "12px 32px",
              fontSize: 16,
              backgroundColor: product.inStock ? "#ffd814" : "#ddd",
              border: "none",
              borderRadius: 6,
              cursor: product.inStock ? "pointer" : "not-allowed",
              marginBottom: 24,
            }}
          >
            Add to Cart
          </button>

          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Description</h3>
          <p style={{ color: "#444", lineHeight: 1.6 }}>{product.description}</p>
        </div>
      </div>
    </div>
  );
}