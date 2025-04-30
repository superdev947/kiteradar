import produce from 'immer';

const initialState = {
  spotlights: null,
  filter: {
    id_city: -1,
    id_state: -1,
    search: '',
  },
  state: [],
  city: [],
};

export default function reducer(state = initialState, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'SET_SPOTLIGHTS':
        draft.spotlights = action.payload.spotlights;
        return;
      case 'SET_SPOTLIGHTS_FILTER':
        draft.filter = action.payload.filter;
        return;
      case 'SET_SPOTLIGHTS_STATE_LIST':
        draft.state = action.payload.state;
        return;
      case 'SET_SPOTLIGHTS_CITY_LIST':
        draft.city = action.payload.city;
        return;
      default:
        return state;
    }
  });
}
