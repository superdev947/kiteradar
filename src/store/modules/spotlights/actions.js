export function setSpotlights(spotlights) {
  return {
    type: 'SET_SPOTLIGHTS',
    payload: {spotlights},
  };
}

export function setFilterSpotlights(filter) {
  return {
    type: 'SET_SPOTLIGHTS_FILTER',
    payload: {filter},
  };
}

export function setSpotlightsStateList(state) {
  return {
    type: 'SET_SPOTLIGHTS_STATE_LIST',
    payload: {state},
  };
}

export function setSpotlightsCityList(city) {
  return {
    type: 'SET_SPOTLIGHTS_CITY_LIST',
    payload: {city},
  };
}