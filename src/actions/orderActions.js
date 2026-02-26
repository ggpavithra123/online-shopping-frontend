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

// ✅ User Orders (FIXED)
export const userOrders = () => async (dispatch) => {
  try {
    dispatch(userOrdersRequest());
    const { data } = await axios.get(`/api/v1/myorders`);
    dispatch(userOrdersSuccess(data));
  } catch (error) {
    dispatch(userOrdersFail(error.response?.data?.message));
  }
};

// ✅ Order Details
export const orderDetail = (id) => async (dispatch) => {
  try {
    console.log("🔵 OrderDetail Action Triggered");
    console.log("📌 Order ID:", id);

    dispatch(orderDetailRequest());

    const { data } = await axios.get(`/api/v1/order/${id}`);

    console.log("🟢 API Response:", data);

    dispatch(orderDetailSuccess(data));

    console.log("✅ orderDetailSuccess dispatched");
  } catch (error) {
    console.log("🔴 Order Detail Error:", error);
    console.log("🔴 Error Response:", error.response);

    dispatch(
      orderDetailFail(error.response?.data?.message)
    );
  }
};

// ✅ Admin Orders (FIXED)
export const adminOrders = () => async (dispatch) => {
  try {
    dispatch(adminOrdersRequest());
    const { data } = await axios.get(`/api/v1/admin/orders`);
    dispatch(adminOrdersSuccess(data));
  } catch (error) {
    dispatch(adminOrdersFail(error.response?.data?.message));
  }
};

// ✅ Delete Order
export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch(deleteOrderRequest());
    await axios.delete(`/api/v1/admin/order/${id}`);
    dispatch(deleteOrderSuccess());
  } catch (error) {
    dispatch(deleteOrderFail(error.response?.data?.message));
  }
};

// ✅ Update Order
export const updateOrder = (id, orderData) => async (dispatch) => {
  try {
    dispatch(updateOrderRequest());
    const { data } = await axios.put(
      `/api/v1/admin/order/${id}`,
      orderData
    );
    dispatch(updateOrderSuccess(data));
  } catch (error) {
    dispatch(updateOrderFail(error.response?.data?.message));
  }
};