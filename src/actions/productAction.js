import api from "../utils/axios";
import {
  productRequest,
  productSuccess,
  productFail,
 
} from "../slices/productSlice";

import {
  adminProductsRequest,
  adminProductsSuccess,
  adminProductsFail,} 
from "../slices/productsSlice";

import {  createReviewRequest, createReviewSuccess, createReviewFail, newProductRequest, newProductSuccess, newProductFail, deleteProductRequest, deleteProductSuccess, deleteProductFail, updateProductRequest, updateProductSuccess, updateProductFail, reviewsRequest, reviewsSuccess, reviewsFail, deleteReviewRequest, deleteReviewSuccess, deleteReviewFail } from '../slices/productSlice';


export const getProduct = (id) => async (dispatch) => {
  try {
    dispatch(productRequest());

    console.log("Calling API for product:", id);

    const { data } = await api.get(`/api/v1/product/${id}`);

    console.log("API RESPONSE:", data);

    // 🔥 VERY IMPORTANT
    dispatch(productSuccess(data.product));

  } catch (error) {
    console.log("API ERROR:", error.response?.data);

    dispatch(
      productFail(
        error.response?.data?.message || "Failed to fetch product"
      )
    );
  }
};


// ✅ Create Review
export const createReview = (reviewData) => async (dispatch) => {
  try {
    dispatch(createReviewRequest());

    const { data } = await api.put(
      "/api/v1/review",
      reviewData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    dispatch(createReviewSuccess(data));
  } catch (error) {
    dispatch(
      createReviewFail(
        error.response?.data?.message || "Review failed"
      )
    );
  }
};

export const getAdminProducts  =  async (dispatch) => {

    try {  
        dispatch(adminProductsRequest()) 
        const { data }  =  await api.get(`/api/v1/admin/products`);
        dispatch(adminProductsSuccess(data))
    } catch (error) {
        //handle error
        dispatch(adminProductsFail(error.response.data.message))
    }
    
}

export const createNewProduct = productData => async (dispatch) => {
  try {
    dispatch(newProductRequest());

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await api.post(
      `/api/v1/product/new`,
      productData,
      config
    );

    dispatch(newProductSuccess(data));

  } catch (error) {
    dispatch(newProductFail(error.response?.data?.message));
  }
};

export const deleteProduct  =  id => async (dispatch) => {

    try {  
        dispatch(deleteProductRequest()) 
        await api.delete(`/api/v1/admin/product/${id}`);
        dispatch(deleteProductSuccess())
    } catch (error) {
        //handle error
        dispatch(deleteProductFail(error.response.data.message))
    }
    
}

export const updateProduct  =  (id, productData) => async (dispatch) => {

    try {  
        dispatch(updateProductRequest()) 
        const { data }  =  await api.put(`/api/v1/admin/product/${id}`, productData);
        dispatch(updateProductSuccess(data))
    } catch (error) {
        //handle error
        dispatch(updateProductFail(error.response.data.message))
    }
    
}


export const getReviews =  id => async (dispatch) => {

    try {  
        dispatch(reviewsRequest()) 
        const { data }  =  await api.get(`/api/v1/admin/reviews`,{params: {id}});
        console.log("API RESPONSE 👉", data);
        dispatch(reviewsSuccess(data));
    } catch (error) {
        //handle error
        dispatch(reviewsFail(error.response.data.message))
    }
    
}

export const deleteReview =  (productId, id) => async (dispatch) => {

    try {  
        dispatch(deleteReviewRequest()) 
        await api.delete(`/api/v1/admin/review`,{params: {productId, id}});
        dispatch(deleteReviewSuccess())
    } catch (error) {
        //handle error
        dispatch(deleteReviewFail(error.response.data.message))
    }
    
}