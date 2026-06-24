import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../api/productApi";
import { addToCart } from "../api/cartApi";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

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

  const handleAddToCart = async () => {
    try {
      setAdding(true);

      await addToCart({
        productId: product.id,
        quantity,
      });

      setAddedToCart(true);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add to cart."
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <p style={{ padding: 24 }}>Loading product...</p>;
  }

  if (error || !product) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: "red" }}>
          {error || "Product not found."}
        </p>

        <Link to="/">← Back to products</Link>
      </div>
    );
  }

  const hasDiscount = product.discountPercentage > 0;

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginBottom: 16,
        }}
      >
        ← Back to products
      </Link>

      <div
        style={{
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        {/* Product Image */}
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
          {product.imageUrls?.length > 0 ? (
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <span style={{ color: "#999" }}>
              No image available
            </span>
          )}
        </div>

        {/* Product Details */}
        <div style={{ flex: "1 1 300px" }}>
          <h1
            style={{
              fontSize: 28,
              marginBottom: 8,
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              color: "#666",
              marginBottom: 12,
            }}
          >
            {product.brand}
          </p>

          {product.numberOfReviews > 0 && (
            <p style={{ marginBottom: 12 }}>
              ⭐ {product.averageRating.toFixed(1)} (
              {product.numberOfReviews} reviews)
            </p>
          )}

          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                fontSize: 30,
                fontWeight: "bold",
              }}
            >
              ₹{product.finalPrice.toLocaleString()}
            </span>

            {hasDiscount && (
              <>
                <span
                  style={{
                    marginLeft: 10,
                    textDecoration: "line-through",
                    color: "#888",
                  }}
                >
                  ₹{product.price.toLocaleString()}
                </span>

                <span
                  style={{
                    marginLeft: 10,
                    color: "green",
                    fontWeight: "bold",
                  }}
                >
                  {product.discountPercentage}% OFF
                </span>
              </>
            )}
          </div>

          <p
            style={{
              color: product.inStock
                ? "green"
                : "red",
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            {product.inStock
              ? `In Stock (${product.stockQuantity} available)`
              : "Out of Stock"}
          </p>

          {/* Quantity */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                marginRight: 10,
                fontWeight: "bold",
              }}
            >
              Quantity
            </label>

            <select
              value={quantity}
              onChange={(e) => {
                setQuantity(Number(e.target.value));
                setAddedToCart(false);
              }}
            >
              {[...Array(Math.min(product.stockQuantity, 10))].map(
                (_, i) => (
                  <option
                    key={i + 1}
                    value={i + 1}
                  >
                    {i + 1}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Add To Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || adding}
            style={{
              padding: "12px 30px",
              backgroundColor: product.inStock
                ? "#FFD814"
                : "#ddd",
              border: "none",
              borderRadius: 6,
              cursor:
                !product.inStock || adding
                  ? "not-allowed"
                  : "pointer",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {adding
              ? "Adding..."
              : "Add To Cart"}
          </button>

          {/* Success Message */}
          {addedToCart && (
            <div
              style={{
                marginTop: 20,
                padding: 16,
                border: "1px solid #28a745",
                backgroundColor: "#f0fff4",
                borderRadius: 8,
              }}
            >
              <p
                style={{
                  color: "#28a745",
                  fontWeight: "bold",
                  marginBottom: 12,
                }}
              >
                ✓ Product added to cart successfully.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                }}
              >
                <button
                  onClick={() => navigate(-1)}
                  style={{
                    padding: "10px 20px",
                  }}
                >
                  Continue Shopping
                </button>

                <button
                  onClick={() =>
                    navigate("/cart")
                  }
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#FFD814",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Go To Cart
                </button>
              </div>
            </div>
          )}

          {/* Description */}
          <h3
            style={{
              marginTop: 30,
              marginBottom: 10,
            }}
          >
            Description
          </h3>

          <p
            style={{
              lineHeight: 1.7,
              color: "#444",
            }}
          >
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}