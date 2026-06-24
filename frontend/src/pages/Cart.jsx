import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../api/cartApi";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await getCart();

      setCart(response.data);
    } catch (err) {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (
    productId,
    quantity
  ) => {
    try {
      await updateCartItem(productId, {
        quantity,
      });

      fetchCart();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update cart"
      );
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeCartItem(productId);

      fetchCart();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to remove item"
      );
    }
  };

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1>Shopping Cart</h1>

      {cart.items.map((item) => (
        <div
          key={item.productId}
          style={{
            display: "flex",
            gap: 20,
            padding: 16,
            borderBottom: "1px solid #ddd",
          }}
        >
          <img
            src={item.imageUrl}
            alt={item.productName}
            style={{
              width: 120,
              height: 120,
              objectFit: "contain",
            }}
          />

          <div style={{ flex: 1 }}>
            <h3>{item.productName}</h3>

            <p>
              ₹
              {item.priceAtAddTime.toLocaleString()}
            </p>

            <p>
              Subtotal: ₹
              {item.subtotal.toLocaleString()}
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <label>Qty:</label>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(
                    item.productId,
                    Number(e.target.value)
                  )
                }
                style={{ width: 70 }}
              />

              <button
                onClick={() =>
                  handleRemove(item.productId)
                }
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: 24,
          textAlign: "right",
        }}
      >
        <h2>
          Total: ₹
          {cart.totalPrice.toLocaleString()}
        </h2>

        <button
          style={{
            padding: "12px 24px",
            fontSize: 16,
          }}
        >
          Proceed To Checkout
        </button>
      </div>
    </div>
  );
}