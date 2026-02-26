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

      createReviewRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        createReviewSuccess(state, action){
            return {
                ...state,
                loading: false,
                isReviewSubmitted: true
            }
        },
        createReviewFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload
            }
        },
        clearReviewSubmitted(state, action) {
            return {
                ...state,
                isReviewSubmitted: false
            }
        },
        clearProduct(state, action) {
            return{ ...state,
                product : {}
            }
        },
        newProductRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        newProductSuccess(state, action){
            return {
                ...state,
                loading: false,
                product: action.payload.product,
                isProductCreated: true
            }
        },
        newProductFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload,
                isProductCreated: false
            }
        },
        clearProductCreated(state, action) {
            return {
                ...state,
                isProductCreated: false
            }
        },
      
        deleteProductRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        deleteProductSuccess(state, action){
            return {
                ...state,
                loading: false,
                isProductDeleted: true
            }
        },
        deleteProductFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload,
            }
        },
        clearProductDeleted(state, action) {
            return {
                ...state,
                isProductDeleted: false
            }
        },

        updateProductRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        updateProductSuccess(state, action){
            return {
                ...state,
                loading: false,
                product: action.payload.product,
                isProductUpdated: true
            }
        },
        updateProductFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload,
            }
        },
        clearProductUpdated(state, action) {
            return {
                ...state,
                isProductUpdated: false
            }
        },

        reviewsRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        reviewsSuccess(state, action){
            return {
                ...state,
                loading: false,
                reviews: action.payload.reviews
            }
        },
        reviewsFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload
            }
        },
        deleteReviewRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        deleteReviewSuccess(state, action){
            return {
                ...state,
                loading: false,
                isReviewDeleted: true
            }
        },
        deleteReviewFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload,
            }
        },
        clearReviewDeleted(state, action) {
            return {
                ...state,
                isReviewDeleted: false
            }
        },
  },
});

export const {
  productsRequest,
  productsSuccess,
  productsFail,
  clearError,
    createReviewFail,
    createReviewRequest,
    createReviewSuccess,
    
    clearReviewSubmitted,
    clearProduct,
   
    clearProductCreated,
    deleteProductFail,
    deleteProductRequest,
    deleteProductSuccess,
    clearProductDeleted,
    updateProductFail,
    updateProductRequest,
    updateProductSuccess,
    clearProductUpdated,
    reviewsRequest,
    reviewsFail,
    reviewsSuccess,
    deleteReviewFail,
    deleteReviewRequest,
    deleteReviewSuccess,
    clearReviewDeleted
} = productsSlice.actions;

export default productsSlice.reducer;
