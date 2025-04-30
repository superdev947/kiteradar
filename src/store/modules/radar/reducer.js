import produce from 'immer';

const initialState = {
  radar: null,
  radarList: [],
  radarFList: [],

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
      case 'SET_RADAR':
        draft.radar = action.payload.radar;
        return;
      case 'SET_RADAR_LIST':
        draft.radarList = action.payload.radarList;
        return;
      case 'SET_RADAR_F_LIST':
        draft.radarFList = action.payload.radarFList;
        return;

      case 'SET_RADAR_FILTER':
        draft.filter = action.payload.filter;
        return;
      case 'SET_RADAR_STATE_LIST':
        draft.state = action.payload.state;
        return;
      case 'SET_RADAR_CITY_LIST':
        draft.city = action.payload.city;
        return;
      default:
        return state;
    }
  });
}
