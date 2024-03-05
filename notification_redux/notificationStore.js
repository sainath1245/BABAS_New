import { createStore } from "redux";

const defaultState = {
    count: '0',
};

function notificationStore(state = defaultState, action) {
    switch (action.type) {
        case "COUNT_CHANGE":
            return {
                ...state,
                count: action.payload.count,
            };
        default:
            return state;
    }
}
export default createStore(notificationStore);