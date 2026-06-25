import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../api/orderApi";
import "../styles/OrderDetails.css";

export default function OrderDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchOrder() {

      try {

        const response =
          await getOrderById(id);

        setOrder(response.data);

      } catch (error) {

        alert("Order not found");

        navigate("/orders");

      } finally {

        setLoading(false);

      }

    }

    fetchOrder();

  }, [id]);

  if (loading) {

    return (
      <div className="order-details">
        <h2>Loading...</h2>
      </div>
    );

  }

  return (

    <div className="order-details">

      <h1>

        Order Details

      </h1>

      <div className="order-box">

        <h3>

          Order #
          {order.orderId}

        </h3>

        <div className={`status ${order.status.toLowerCase()}`}>
  {order.status}
</div>

        <p>

          Ordered On :

          {new Date(
            order.orderedAt
          ).toLocaleString()}

        </p>

        <hr />

        <h2>

          Products

        </h2>
                {order.items.map((item) => (

          <div
            key={item.productId}
            className="product-row"
          >

            <div>

              <h3>{item.productName}</h3>

              <p>
                Quantity : {item.quantity}
              </p>

            </div>

            <h3>
              ₹
              {item.subtotal.toLocaleString()}
            </h3>

          </div>

        ))}

        <hr />

        <h2 className="shipping-header">

          Shipping Address

        </h2>

        <div className="shipping-box">

          <p>
            <strong>
              {order.shippingAddress.fullName}
            </strong>
          </p>

          <p>
            {order.shippingAddress.street}
          </p>

          <p>

            {order.shippingAddress.city},
            {" "}
            {order.shippingAddress.state}

          </p>

          <p>

            {order.shippingAddress.pincode},
            {" "}
            {order.shippingAddress.country}

          </p>

          <p>

            {order.shippingAddress.phoneNumber}

          </p>

        </div>

        <hr />

        <div className="total-row">

          <h2>

            Total

          </h2>

          <h2>

            ₹
            {order.totalAmount.toLocaleString()}

          </h2>

        </div>

      </div>

    </div>

  );

}