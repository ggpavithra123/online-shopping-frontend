import api from "../utils/axios";
import {
  productRequest,
  productSuccess,
  productFail,
  createReviewRequest,
  createReviewSuccess,
  createReviewFail,
  newProductRequest,
  newProductSuccess,
  newProductFail,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFail,
  updateProductRequest,
  updateProductSuccess,
  updateProductFail,
  reviewsRequest,
  reviewsSuccess,
  reviewsFail,
  deleteReviewRequest,
  deleteReviewSuccess,
  deleteReviewFail,
} from "../slices/productSlice";


// ✅ Get Single Product
export const getProduct = (id) => async (dispatch) => {
  try {
    dispatch(productRequest());

    const { data } = await api.get(`/api/v1/product/${id}`);

    dispatch(productSuccess(data));
  } catch (error) {
    dispatch(
      productFail(error.response?.data?.message || "Product not found")
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