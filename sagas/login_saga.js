import { setLoginData } from "../actions/login_action";
import login_service from "../services/login_service";
import { FETCH_LOGIN } from "../types/types";
import { call, put, takeEvery } from "redux-saga/effects";

function* fetchLogin(action) {
  const email = action.email;
  const password = action.password;
  try {
    const login_data = yield call(login_service.getLoginData, email, password);
    yield put(setLoginData(login_data));
  } catch (e) { }
}

export function* waitForFetchLoginData() {
  yield takeEvery(FETCH_LOGIN, fetchLogin);
}
