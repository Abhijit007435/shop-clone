import axiosClient from "./axiosClient";

export const placeOrder = (data) => {
  return axiosClient.post("/orders/place", data);
};

export const getMyOrders = () => {
  return axiosClient.get("/orders");
};

export const getOrderById = (id) => {
  return axiosClient.get(`/orders/${id}`);
};

export const cancelOrder = (id) => {
  return axiosClient.put(`/orders/${id}/cancel`);
};