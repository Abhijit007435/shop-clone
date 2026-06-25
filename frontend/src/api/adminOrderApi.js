import axiosClient from "./axiosClient";

export const getAllOrders = () => {
  return axiosClient.get("/orders/admin");
};

export const updateOrderStatus = (orderId, status) => {
  return axiosClient.put(`/orders/admin/${orderId}`, {
    status,
  });
};