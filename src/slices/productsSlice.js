import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
  loading: false,
  products: [],
  productsCount: 0,
  resPerPage: 0,
  error: null,
},

  reducers: {
    productsRequest: (state) => {
      state.loading = true;
    },
    productsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.products; // ✅ array
      state.productsCount = action.payload.count; // ✅ count
      state.resPerPage = action.payload.resPerPage; // ✅ per page
    },
    productsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

      adminProductsRequest(state, action){
            return {
                loading: true
            }
        },
        adminProductsSuccess(state, action){
            return {
                loading: false,
                products: action.payload.products,
            }
        },
        adminProductsFail(state, action){
            return {
                loading: false,
                error:  action.payload
            }
        },
       
  },
});

export const {
  productsRequest, 
    productsSuccess, 
    productsFail,
    adminProductsFail,
    adminProductsRequest,
    adminProductsSuccess

} = productsSlice.actions;

export default productsSlice.reducer;
