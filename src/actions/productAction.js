import axios from "axios";
import {
  productRequest,
  productSuccess,
  productFail,
} from "../slices/productSlice";
import {  createReviewRequest, createReviewSuccess, createReviewFail, newProductRequest, newProductSuccess, newProductFail, deleteProductRequest, deleteProductSuccess, deleteProductFail, updateProductRequest, updateProductSuccess, updateProductFail, reviewsRequest, reviewsSuccess, reviewsFail, deleteReviewRequest, deleteReviewSuccess, deleteReviewFail } from '../slices/productSlice';
export const getProduct = (id) => async (dispatch) => {
  try {
    dispatch(productRequest());

    const { data } = await axios.get(
      `http://localhost:8000/api/v1/product/${id}`,
      { withCredentials: true }
    );

    dispatch(productSuccess(data));
  } catch (error) {
    dispatch(
      productFail(
        error.response?.data?.message || "Product not found"
      )
    );
  }
};

export const createReview = reviewData => async (dispatch) => {

    try {  
        dispatch(createReviewRequest()) 
        const config = {
            headers : {
                'Content-type': 'application/json'
            }
        }
        const { data }  =  await axios.put(`http://localhost:8000/api/v1/review`,reviewData, config);
        dispatch(createReviewSuccess(data))
    } catch (error) {
        //handle error
        dispatch(createReviewFail(error.response.data.message))
    }
    
}
