import { CHANGE_PASSWORD, SET_CHANGE_PASSWORD } from "../types/types";

export const changePasswordInitialState = [];

const change_password_reducer = (state = changePasswordInitialState, action) => {
  switch (action.type) {
    case SET_CHANGE_PASSWORD:
      return action.payload;
    default:
      return state;
  }
};

export default change_password_reducer;
