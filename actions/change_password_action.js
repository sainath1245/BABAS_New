import { FETCH_CHANGE_PASSWORD, SET_CHANGE_PASSWORD } from "../types/types";

export const changePassword = (token, userId, password, confirmPassword) => {
  return { type: FETCH_CHANGE_PASSWORD, token, userId, password, confirmPassword };
};

export const setChangePasswordData = (change_password_data = null) => {
  if (change_password_data) {
    return {
      type: SET_CHANGE_PASSWORD,
      payload: change_password_data,
    };
  }
};
