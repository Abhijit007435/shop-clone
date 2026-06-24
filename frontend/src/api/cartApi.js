import axiosClient from "./axiosClient";

export const getCart = () => {
    return axiosClient.get("/cart");
};

export const addToCart = (data) => {
    return axiosClient.post("/cart/add", data);
};

export const updateCartItem = (productId, data) => {
    return axiosClient.put(`/cart/${productId}`, data);
};

export const removeCartItem = (productId) => {
    return axiosClient.delete(`/cart/${productId}`);
};

export const clearCart = () => {
    return axiosClient.delete("/cart/clear");
};