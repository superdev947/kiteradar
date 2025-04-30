import * as React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFeather from 'react-native-vector-icons/Feather';

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
          title: 'Invites',
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
                navigation.navigate('InviteFilter');
              }}
            />
          ),
        })}
      />

      <Stack.Screen
        name="Details"
        component={Details}
        options={({navigation, route}) => ({
          title: 'Invite',
        })}
      />

      <Stack.Screen
        name="InviteFilter"
        component={Filter}
        options={({navigation, route}) => ({
          title: 'Filtro',
        })}
      />
    </Stack.Navigator>
  );
}

export default App;
