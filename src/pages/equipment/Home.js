import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import ListEquipments from './ListEquipments';
import ListOccurrence from './ListOccurrence';

import {colors} from '../../styles';
import {resize} from '../../utils/font';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      backBehavior="initialRoute"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Meus Equipamentos') {
            iconName = 'archive';
          } else if (route.name === 'Minhas ocorrências') {
            iconName = 'alert-octagon';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'white',
        inactiveTintColor: 'rgba(255,255,255,0.5)',
        style: styles.tabs,
        tabStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 10,
        },
        labelStyle: {
          marginVertical: 5,
          //fontFamily: 'Montserrat-Bold',
          fontSize: resize(12),
        },
      }}>
      <Tab.Screen name="Meus Equipamentos" component={ListEquipments} />
      <Tab.Screen name="Minhas ocorrências" component={ListOccurrence} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    margin: 8,
    borderRadius: resize(5),
    backgroundColor: colors.primary,
  },
});
