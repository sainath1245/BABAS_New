import { call, put, takeEvery } from "redux-saga/effects";
import { setProducts } from "../actions/product_action";
import product_service from "../services/product_service";
import { FETCH_PRODUCTS } from "../types/product_type";

function* fetchProducts() {
  try {
    const products = yield call(product_service.getAllProducts);
    yield put(setProducts(products));
  } catch (e) { }
}

export function* waitForFetchProducts() {
  yield takeEvery(FETCH_PRODUCTS, fetchProducts);
}
