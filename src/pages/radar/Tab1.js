import React from 'react';
import {StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import List from './List';
import FavoritosList from './FavoritosList';
import {colors} from '../../styles';
const Tab = createMaterialTopTabNavigator();

const TabScreen = ({navigation, route}) => {
  return (
    <Tab.Navigator
      backBehavior="initialRoute"
      tabBarOptions={{
        activeTintColor: 'white',
        inactiveTintColor: 'white',
        style: {backgroundColor:colors.primary},
        tabStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        indicatorStyle: {
          backgroundColor: 'white',
          height: 5,
          borderRadius: 5,
        },
      }}>
      <Tab.Screen name="RADARES">
        { props => <List {...props}  navigation={navigation} route={route} /> }
      </Tab.Screen>
      <Tab.Screen name="FAVORITOS">
        { props => <FavoritosList {...props}  navigation={navigation} route={route} /> }
      </Tab.Screen>
    </Tab.Navigator>
  );
};


export default TabScreen;
