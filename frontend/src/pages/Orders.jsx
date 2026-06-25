import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder } from "../api/orderApi";
import { useNavigate } from "react-router-dom";
import "../styles/Orders.css";

export default function Orders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {

      const response = await getMyOrders();

      setOrders(response.data);

    } catch (error) {

      alert("Failed to load orders");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchOrders();

  }, []);

  const handleCancel = async (orderId) => {

    if (!window.confirm("Cancel this order?")) {
      return;
    }

    try {

      await cancelOrder(orderId);

      fetchOrders();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to cancel order"
      );

    }

  };

  if (loading) {
    return (
      <div className="orders-page">
        <h2>Loading Orders...</h2>
      </div>
    );
  }

  if (orders.length === 0) {
    return (

      <div className="empty-orders">

        <h1>No Orders Yet</h1>

        <p>
          Looks like you haven't placed an order.
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

    <div className="orders-page">

      <h1>My Orders</h1>

      {orders.map(order => (

        <div
          key={order.orderId}
          className="order-card"
        >

          <div className="order-header">

            <div>

              <h3>
                Order #{order.orderId.slice(-8)}
              </h3>

              <p>

                {new Date(
                  order.orderedAt
                ).toLocaleString()}

              </p>

            </div>

            <div className={`status ${order.status.toLowerCase()}`}>

              {order.status}

            </div>

          </div>

          <div className="order-items">
                      {order.items.map(item => (

            <div
              key={item.productId}
              className="order-item"
            >

              <div>

                <h4>{item.productName}</h4>

                <p>
                  Quantity : {item.quantity}
                </p>

              </div>

              <div>

                ₹
                {item.subtotal.toLocaleString()}

              </div>

            </div>

          ))}

          </div>

          <hr />

          <div className="order-footer">

            <h2>

              Total :
              ₹
              {order.totalAmount.toLocaleString()}

            </h2>

            <div className="order-actions">

              <button
                className="details-btn"
                onClick={() =>
                  navigate(`/orders/${order.orderId}`)
                }
              >
                View Details
              </button>

              {order.status === "PENDING" && (

                <button
                  className="cancel-btn"
                  onClick={() =>
                    handleCancel(order.orderId)
                  }
                  style={{ "text-color": "#230707" }}
                >
                  Cancel Order
                </button>

              )}

            </div>

          </div>

        </div>

      ))}

    </div>

  );

}
          