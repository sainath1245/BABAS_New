import { CLEAR_LOGIN, SET_LOGIN } from "../types/types";

export const loginInitialState = [];

const login_reducer = (state = loginInitialState, action) => {
  switch (action.type) {
    case SET_LOGIN:
      return action.payload;
    case CLEAR_LOGIN:
      return loginInitialState;
    default:
      return state;
  }
};

export default login_reducer;
