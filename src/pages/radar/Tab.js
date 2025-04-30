import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Detalhes from './Details';
import Comments from './Comments';
import Radar from './Radar';
import Information from './Information';
import {colors} from '../../styles';

const Tab = createMaterialTopTabNavigator();

const TabScreen = ({navigation, route}) => {
  return (
    <Tab.Navigator
      backBehavior="initialRoute"
      tabBarOptions={{
        activeTintColor: 'white',
        inactiveTintColor: 'white',
        style: {backgroundColor: colors.primary},
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
      <Tab.Screen name="LOCAL">
        { props => <Detalhes {...props}  navigation={navigation} route={route} /> }
      </Tab.Screen>
      <Tab.Screen name="RADAR">
        { props => <Radar {...props}  navigation={navigation} route={route} /> }
      </Tab.Screen>
      <Tab.Screen name="RESENHAS">
        { props => <Comments {...props}  navigation={navigation} route={route} /> }
      </Tab.Screen>
      <Tab.Screen name="VELEJO">
        { props => <Information {...props}  navigation={navigation} route={route} /> }
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabScreen;
