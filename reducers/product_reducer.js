import { SET_PRODUCTS } from "../types/product_type";

export const productsInitialState = [];

const product_reducer = (state = productsInitialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return [...action.payload];
    default:
      return state;
  }
};

export default product_reducer;
