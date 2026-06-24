import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAddresses,
  addAddress,
  deleteAddress,
} from "../api/addressApi";
import { placeOrder } from "../api/orderApi";

export default function Addresses() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(true);

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

      if (
        response.data.length > 0 &&
        !selectedAddress
      ) {
        setSelectedAddress(response.data[0].id);
      }
    } catch (error) {
      console.error(error);
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

      fetchAddresses();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add address"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);

      fetchAddresses();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete address"
      );
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select an address");
      return;
    }

    try {
      await placeOrder({
        addressId: selectedAddress,
      });

      alert("Order placed successfully");

      navigate("/orders");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to place order"
      );
    }
  };

  if (loading) {
    return <p>Loading addresses...</p>;
  }

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1>Addresses</h1>

      <h2>Saved Addresses</h2>

      {addresses.length === 0 ? (
        <p>No addresses found.</p>
      ) : (
        addresses.map((address) => (
          <div
            key={address.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginBottom: 12,
            }}
          >
            <input
              type="radio"
              checked={
                selectedAddress === address.id
              }
              onChange={() =>
                setSelectedAddress(address.id)
              }
            />

            <strong>
              {address.fullName}
            </strong>

            <p>
              {address.street},{" "}
              {address.city},{" "}
              {address.state}
            </p>

            <p>
              {address.pincode},{" "}
              {address.country}
            </p>

            <p>{address.phoneNumber}</p>

            <button
              onClick={() =>
                handleDelete(address.id)
              }
            >
              Delete
            </button>
          </div>
        ))
      )}

      <button
        onClick={handlePlaceOrder}
        style={{
          padding: "12px 24px",
          marginBottom: 30,
        }}
      >
        Place Order
      </button>

      <h2>Add Address</h2>

      <form onSubmit={handleAddAddress}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="street"
          placeholder="Street"
          value={formData.street}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
        />

        <br />
        <br />

        <button type="submit">
          Add Address
        </button>
      </form>
    </div>
  );
}