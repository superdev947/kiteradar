import * as React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import {colors} from '../../styles';
import List from './List';
import Details from './Details';
import Filter from './Filter';

const Stack = createStackNavigator();

function App() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: 'white',
      }}>
      <Stack.Screen
        name="List"
        component={List}
        options={({navigation, route}) => ({
          title: 'Anúncios',
          headerLeft: () => (
            <Icon
              color="white"
              name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
              size={30}
              style={{marginLeft: 10}}
              onPress={() => {
                navigation.toggleDrawer();
              }}
            />
          ),
          headerRight: () => (
            <Icon
              color="white"
              name={
                Platform.OS === 'ios'
                  ? 'ios-funnel-outline'
                  : 'md-funnel-outline'
              }
              size={25}
              style={{marginRight: 10}}
              onPress={() => {
                navigation.navigate('AdFilter');
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="AdDetails"
        component={Details}
        options={({navigation, route}) => ({
          title: 'Anúncio',
        })}
      />
      <Stack.Screen
        name="AdFilter"
        component={Filter}
        options={{title: 'Filtro'}}
      />
    </Stack.Navigator>
  );
}

export default App;
