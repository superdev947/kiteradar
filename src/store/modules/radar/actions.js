export function setRadar(radar) {
  return {
    type: 'SET_RADAR',
    payload: {radar},
  };
}

export function setRadarList(radarList) {
  return {
    type: 'SET_RADAR_LIST',
    payload: {radarList},
  };
}

export function setRadarFList(radarFList) {
  return {
    type: 'SET_RADAR_F_LIST',
    payload: {radarFList},
  };
}



export function setFilterRadar(filter) {
  return {
    type: 'SET_RADAR_FILTER',
    payload: {filter},
  };
}

export function setRadarStateList(state) {
  return {
    type: 'SET_RADAR_STATE_LIST',
    payload: {state},
  };
}

export function setRadarCityList(city) {
  return {
    type: 'SET_RADAR_CITY_LIST',
    payload: {city},
  };
}