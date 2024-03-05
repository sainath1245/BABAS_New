import { all } from "redux-saga/effects";
import { waitForFetchProducts } from "./sagas/product_saga";
import { waitForFetchLoginData } from "./sagas/login_saga";
import { waitForFetchChangePasswordData } from "./sagas/change_password_saga";

export default function* rootSaga() {
  yield all([waitForFetchProducts(), waitForFetchLoginData(), waitForFetchChangePasswordData()]);
}
