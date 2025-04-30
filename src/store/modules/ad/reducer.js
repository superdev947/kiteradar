import produce from 'immer';

const initialState = {
  city: null,
  filter: {
    id_brand: -1,
    id_state: -1,
    year: -1,
    id_category: -1,
    search: '',
  },
  state: [],
  year: [],
  brand: [],
  category: [],
};

export default function reducer(state = initialState, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'SET_CITY':
        draft.city = action.payload.city;
        return;
      case 'SET_FILTER':
        draft.filter = action.payload.filter;
        return;
      case 'SET_STATE_LIST':
        draft.state = action.payload.state;
        return;
      case 'SET_YEAR_LIST':
        draft.year = action.payload.year;
        return;
      case 'SET_BRAND_LIST':
        draft.brand = action.payload.brand;
        return;
      case 'SET_CATEGORY_LIST':
        draft.category = action.payload.category;
        return;
      default:
        return state;
    }
  });
}
