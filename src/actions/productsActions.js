import axios from "axios";
import {
  productsRequest,
  productsSuccess,
  productsFail,
} from "../slices/productsSlice";

export const getProducts = (
  keyword = "",
  currentPage,
  price,
  category,
  rating
) => async (dispatch) => {
  try {
    dispatch(productsRequest());

    let link = `http://localhost:8000/api/v1/products?page=${currentPage}`;

    if (keyword) link += `&keyword=${keyword}`;
    if (price) link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
    if (category) link += `&category=${category}`;
    if (rating) link += `&ratings=${rating}`;

    const { data } = await axios.get(link);
    dispatch(productsSuccess(data));
  } catch (error) {
    dispatch(productsFail(error.response?.data?.message));
  }
};



