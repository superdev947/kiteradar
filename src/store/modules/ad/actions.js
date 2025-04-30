export function setCity(city) {
  return {
    type: 'SET_CITY',
    payload: {city},
  };
}

export function setFilterAd(filter) {
  return {
    type: 'SET_FILTER',
    payload: {filter},
  };
}

export function setYearList(year) {
  return {
    type: 'SET_YEAR_LIST',
    payload: {year},
  };
}

export function setStateList(state) {
  return {
    type: 'SET_STATE_LIST',
    payload: {state},
  };
}

export function setBrandList(brand) {
  return {
    type: 'SET_BRAND_LIST',
    payload: {brand},
  };
}

export function setCategoryList(category) {
  return {
    type: 'SET_CATEGORY_LIST',
    payload: {category},
  };
}
