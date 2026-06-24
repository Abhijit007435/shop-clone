import axiosClient from "./axiosClient";

export const getAddresses = () => {
    return axiosClient.get("/addresses");
};

export const addAddress = (data) => {
    return axiosClient.post("/addresses", data);
};

export const deleteAddress = (id) => {
    return axiosClient.delete(`/addresses/${id}`);
};