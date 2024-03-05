import { CLEAR_LOGIN, FETCH_LOGIN, SET_LOGIN } from "../types/types";

export const login = (email, password) => {
  return { type: FETCH_LOGIN, email, password };
};

export const clearLogin = () => {
  return { type: CLEAR_LOGIN };
};

export const setLoginData = (login_data = null) => {
  if (login_data) {
    return {
      type: SET_LOGIN,
      payload: login_data,
    };
  }
};
