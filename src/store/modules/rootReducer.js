import {combineReducers} from 'redux';

import user from './user/reducer';
import ad from './ad/reducer';
import radar from './radar/reducer';
import spotlights from './spotlights/reducer';

export default combineReducers({
  user,
  ad,
  radar,
  spotlights,
});
