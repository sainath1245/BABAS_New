import { combineReducers } from "redux";

import product_reducer from "./reducers/product_reducer";
import login_reducer from "./reducers/login_reducer";
import change_password_reducer from "./reducers/change_password_reducer";

const rootReducer = combineReducers({
  products: product_reducer,
  login_data: login_reducer,
  change_password_data: change_password_reducer,
});

export default rootReducer;
