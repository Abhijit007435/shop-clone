import axiosClient from "./axiosClient";

// params can include: category, search, page, size
export const getProducts = (params = {}) => {
  return axiosClient.get("/products", { params });
};

export const getProductById = (id) => {
  return axiosClient.get(`/products/${id}`);
};