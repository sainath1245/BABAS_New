import { call, put, takeEvery } from "redux-saga/effects";
import { setChangePasswordData } from "../actions/change_password_action";
import change_password_service from "../services/change_password_service";
import { CHANGE_PASSWORD, FETCH_CHANGE_PASSWORD } from "../types/types";

function* fetchChangePassword(action) {
  const token = action.token;
  const userId = action.userId;
  const password = action.password;
  const confirmPassword = action.confirmPassword;
  try {
    const change_password_data = yield call(change_password_service.getChangePasswordData, token, userId, password, confirmPassword);
    yield put(setChangePasswordData(change_password_data));
  } catch (e) { }
}

export function* waitForFetchChangePasswordData() {
  yield takeEvery(FETCH_CHANGE_PASSWORD, fetchChangePassword);
}
