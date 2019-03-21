import { FETCH_FULFILLED, FETCH_FAILED, SET_STATUS, RESET } from './actions';

const initialState = {
  data: [],
  status: 'idle', // "idle" | "pending" | "success" | "failure";
  messages: [],
};

export default function beersReducers(state = initialState, action) {
  switch (action.type) {
    case SET_STATUS: {
      return {
        ...state,
        status: action.payload,
      };
    }
    case RESET: {
      return {
        ...state,
        status: 'idle',
        messages: [],
      };
    }
    case FETCH_FULFILLED: {
      return {
        ...state,
        status: 'success',
        data: action.payload,
        messages: [],
      };
    }
    case FETCH_FAILED: {
      return {
        ...state,
        status: 'failure',
        messages: [
          {
            type: 'error',
            text: action.payload,
          },
        ],
      };
    }
    default:
      return state;
  }
}
