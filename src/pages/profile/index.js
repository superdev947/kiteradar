import * as React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import {colors} from '../../styles';
import Details from './Details';
import Edit from './Edit';

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
        name="Details"
        component={Details}
        options={({navigation, route}) => ({
          title: 'Meu Perfil',
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            backgroundColor: colors.primary,
          },
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
              name={'create-outline'}
              size={25}
              style={{marginRight: 10}}
              onPress={() => {
                navigation.navigate('ProfileEdit');
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={Edit}
        options={{
          title: 'Editar Perfil',
        }}
      />
    </Stack.Navigator>
  );
}

export default App;
