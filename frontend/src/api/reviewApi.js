import axiosClient from "./axiosClient";

export const addReview = (data) => {
    return axiosClient.post("/reviews", data);
};

export const getProductReviews = (productId) => {
    return axiosClient.get(`/reviews/product/${productId}`);
};