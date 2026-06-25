import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
} from "../api/adminOrderApi";
import "../styles/AdminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (err) {
      alert("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    try {
      await updateOrderStatus(orderId, status);

      fetchOrders();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update order"
      );
    }
  };

  return (
    <div className="admin-orders">

      <h1>All Orders</h1>

      {orders.map((order) => (

        <div
          key={order.orderId}
          className="order-card"
        >

          <div>

            <h3>
              Order #{order.orderId}
            </h3>

            <p>
              ₹
              {order.totalAmount.toLocaleString()}
            </p>

            <p>
              {new Date(
                order.orderedAt
              ).toLocaleString()}
            </p>

          </div>

          <div className="status-area">

            <select
              defaultValue={order.status}
              onChange={(e) =>
                handleStatusChange(
                  order.orderId,
                  e.target.value
                )
              }
            >
              <option>PENDING</option>
              <option>CONFIRMED</option>
              <option>SHIPPED</option>
              <option>DELIVERED</option>
              <option>CANCELLED</option>
            </select>

          </div>

        </div>

      ))}

    </div>
  );
}