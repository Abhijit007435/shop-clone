import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../api/cartApi";


export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await getCart();

      setCart(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (
    productId,
    currentQty,
    change,
    maxStock
  ) => {
    const newQty = currentQty + change;

    if (newQty < 1) return;

    if (newQty > maxStock) {
      alert("Maximum available stock reached.");
      return;
    }

    try {
      await updateCartItem(productId, {
        quantity: newQty,
      });

      setCart((prev) => {
        const updatedItems = prev.items.map((item) => {
          if (item.productId !== productId) return item;

          return {
            ...item,
            quantity: newQty,
            subtotal: item.priceAtAddTime * newQty,
          };
        });

        const totalItems = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        const totalPrice = updatedItems.reduce(
          (sum, item) => sum + item.subtotal,
          0
        );

        return {
          ...prev,
          items: updatedItems,
          totalItems,
          totalPrice,
        };
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update quantity."
      );
    }
  };

  const handleRemove = async (productId) => {
    if (!window.confirm("Remove this item?")) {
      return;
    }

    try {
      await removeCartItem(productId);

      fetchCart();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to remove item."
      );
    }
  };

  if (loading) {
    return (
      <div className="cart-page">
        <h2>Loading cart...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <h2>{error}</h2>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-cart">

        <h1>Your Cart is Empty</h1>

        <p>
          Looks like you haven't added anything yet.
        </p>

        <button
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>

      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-left">

        <h1>Shopping Cart</h1>

        {cart.items.map((item) => (

          <div
            className="cart-item"
            key={item.productId}
          >

            <img
              src={item.imageUrl}
              alt={item.productName}
              className="cart-image"
            />

            <div className="cart-info">

              <h2>{item.productName}</h2>

              <h3>
                ₹
                {item.priceAtAddTime.toLocaleString()}
              </h3>

              <p>
                Subtotal :
                ₹
                {item.subtotal.toLocaleString()}
              </p>

              {item.inStock ? (
                <p className="stock">
                  In Stock
                </p>
              ) : (
                <p className="out-stock">
                  Out of Stock
                </p>
              )}

              <div className="qty-box">

                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.quantity,
                      -1,
                      item.availableStock
                    )
                  }
                >
                  -
                </button>

                <span>
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.quantity,
                      1,
                      item.availableStock
                    )
                  }
                >
                  +
                </button>

              </div>

              <button
                className="remove-btn"
                onClick={() =>
                  handleRemove(item.productId)
                }
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>

      <div className="cart-right">

        <h2 className="texts">Order Summary</h2>

        <div className="summary-row">
          <span className="texts">Items</span>
          <span>{cart.totalItems}</span>
        </div>

        <div className="summary-row">
          <span className="texts">Subtotal</span>
          <span>
            ₹
            {cart.totalPrice.toLocaleString()}
          </span>
        </div>

        <div className="summary-row">
          <span className="texts">Shipping</span>
          <span>FREE</span>
        </div>

        <hr />

        <div className="summary-total">
          <span className="texts">Total</span>
          <span>
            ₹
            {cart.totalPrice.toLocaleString()}
          </span>
        </div>
                <button
          className="checkout-btn"
          onClick={() => navigate("/addresses")}
        >
          Proceed To Checkout
        </button>

        <button
          className="continue-btn"
          onClick={() => navigate("/")}
          
        >
          <span className="texts">Continue Shopping</span>
        </button>

      </div>

    </div>
  );
}