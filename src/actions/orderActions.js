import {
  adminOrdersFail,
  adminOrdersRequest,
  adminOrdersSuccess,
  createOrderFail,
  createOrderRequest,
  createOrderSuccess,
  deleteOrderFail,
  deleteOrderRequest,
  deleteOrderSuccess,
  orderDetailFail,
  orderDetailRequest,
  orderDetailSuccess,
  updateOrderFail,
  updateOrderRequest,
  updateOrderSuccess,
  userOrdersFail,
  userOrdersRequest,
  userOrdersSuccess
} from "../slices/orderSlice";

import axios from "axios";
import api from "../utils/axios";

// ✅ Create Order
export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch(createOrderRequest());
    const { data } = await axios.post(`/api/v1/order/new`, order);
    dispatch(createOrderSuccess(data));
  } catch (error) {
    dispatch(createOrderFail(error.response?.data?.message));
  }
};

export const userOrders = () => async (dispatch) => {
  try {
    console.log("🔵 UserOrders Action Triggered");

    dispatch(userOrdersRequest());

    const { data } = await api.get("/api/v1/myorders");

    console.log("🟢 User Orders API Response:", data);

    dispatch(userOrdersSuccess(data.orders)); // ✅ send only orders array

  } catch (error) {
    console.log("🔴 User Orders Error:", error);

    dispatch(
      userOrdersFail(
        error.response?.data?.message || "Failed to fetch user orders"
      )
    );
  }
};

// ✅ Order Details
export const orderDetail = (id) => async (dispatch) => {
  try {
    console.log("🔵 OrderDetail Action Triggered");
    console.log("📌 Order ID:", id);

    dispatch(orderDetailRequest());

    const { data } = await api.get(`/api/v1/order/${id}`);

    console.log("🟢 API Response:", data);

    dispatch(orderDetailSuccess(data.order));

  } catch (error) {
    console.log("🔴 Order Detail Error:", error);
    dispatch(orderDetailFail(error.response?.data?.message));
  }
};

// ✅ Admin Orders (FIXED)
export const adminOrders = () => async (dispatch) => {
  try {
    dispatch(adminOrdersRequest());
    const { data } = await api.get(`/api/v1/admin/orders`);
    dispatch(adminOrdersSuccess(data));
  } catch (error) {
    dispatch(adminOrdersFail(error.response?.data?.message));
  }
};

// ✅ Delete Order
export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch(deleteOrderRequest());
    await api.delete(`/api/v1/admin/order/${id}`);
    dispatch(deleteOrderSuccess());
  } catch (error) {
    dispatch(deleteOrderFail(error.response?.data?.message));
  }
};

// ✅ Update Order
export const updateOrder = (id, orderData) => async (dispatch) => {
  try {
    dispatch(updateOrderRequest());
    const { data } = await api.put(
      `/api/v1/admin/order/${id}`,
      orderData
    );
    dispatch(updateOrderSuccess(data));
  } catch (error) {
    dispatch(updateOrderFail(error.response?.data?.message));
  }
};