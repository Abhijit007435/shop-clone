import { useEffect, useState } from "react";
import {
  getAddresses,
  addAddress,
  deleteAddress,
} from "../api/addressApi";
import { placeOrder } from "../api/orderApi";
import { useNavigate } from "react-router-dom";
import "../styles/Addresses.css";

export default function Addresses() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] =
    useState("");

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const fetchAddresses = async () => {
    try {
      const response = await getAddresses();

      setAddresses(response.data);

      if (response.data.length > 0) {
        setSelectedAddress(response.data[0].id);
      }
    } catch (err) {
      alert("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await addAddress(formData);

      setFormData({
        fullName: "",
        phoneNumber: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      });

      setShowForm(false);

      fetchAddresses();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add address"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete address?")) {
      return;
    }

    try {
      await deleteAddress(id);

      fetchAddresses();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete"
      );
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select an address");
      return;
    }

    try {
      const response = await placeOrder({
        addressId: selectedAddress,
      });

      alert("Order placed successfully!");

      navigate(`/orders/${response.data.orderId}`);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to place order"
      );
    }
  };

  if (loading) {
    return (
      <div className="address-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="address-page">

      <div className="address-header">

        <h1>My Addresses</h1>

        <button
          className="add-address-btn"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          {showForm
            ? "Cancel"
            : "+ Add Address"}
        </button>

      </div>

      {showForm && (

        <form
          className="address-form"
          onSubmit={handleAddAddress}
        >

          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />

          <input
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleChange}
            required
          />

          <input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <input
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
          />

          <input
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />

          <input
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Address"}
          </button>

        </form>

      )}

      <div className="address-list">
              {addresses.length === 0 ? (

        <div className="no-address">

          <h3>No Address Added</h3>

          <p>
            Please add an address before placing
            your order.
          </p>

        </div>

      ) : (

        addresses.map((address) => (

          <div
            className="address-card"
            key={address.id}
          >

            <div className="address-top">

              <input
                type="radio"
                checked={
                  selectedAddress === address.id
                }
                onChange={() =>
                  setSelectedAddress(address.id)
                }
              />

              <div>

                <h3>{address.fullName}</h3>

                <p>{address.street}</p>

                <p>
                  {address.city},{" "}
                  {address.state}
                </p>

                <p>
                  {address.pincode},{" "}
                  {address.country}
                </p>

                <p>{address.phoneNumber}</p>

              </div>

            </div>

            <button
              className="delete-address-btn"
              onClick={() =>
                handleDelete(address.id)
              }
            >
              Delete
            </button>

          </div>

        ))

      )}

      {addresses.length > 0 && (

        <div className="place-order-section">

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>

        </div>

      )}

    </div>

  </div>
);
}