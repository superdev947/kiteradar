import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Radar from '../radar';
import RadarFavorite from '../radar/Favorite';
import Profile from '../profile';
import Ads from '../ads';
import MyAds from '../ads/MyAds';
import Equipment from '../equipment';
import Notification from '../Notification';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Radares" component={Radar} />
      <Drawer.Screen name="Notification" component={Notification} />
      <Drawer.Screen name="Favoritos" component={RadarFavorite} />
      <Drawer.Screen name="Anúncios" component={Ads} />
      <Drawer.Screen name="Perfil" component={Profile} />
      <Drawer.Screen name="Meus Anúncios" component={MyAds} />
      <Drawer.Screen name="Meus Equipamentos" component={Equipment} />
    </Drawer.Navigator>
  );
}
