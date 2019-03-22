import { SET_CONFIG } from './actions';

const initialState = {
  apiBase: 'https://api.punkapi.com/v2/beers',
  perPage: 10,
};

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CONFIG: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}
