import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import Ativos from './Ativos';
import Expirados from './Expirados';
import Encerrados from './Encerrados';

import {colors} from '../../../styles';

const Tab = createMaterialTopTabNavigator();

const myInvites = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        backBehavior="initialRoute"
        tabBarOptions={{
          activeTintColor: 'white',
          inactiveTintColor: 'white',
          style: styles.tabs,
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
        <Tab.Screen name="Ativos" component={Ativos} />
        <Tab.Screen name="Expirados" component={Expirados} />
        <Tab.Screen name="Encerrados" component={Encerrados} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    margin: 8,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});

export default myInvites;
