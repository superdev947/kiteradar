import * as React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import {colors} from '../../styles';
import ChatsList from './List';
import ChatDetails from './Chat';

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
        name="ChatsList"
        component={ChatsList}
        options={({navigation, route}) => ({
          title: 'Chats',
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
        })}
      />
      <Stack.Screen name="ChatDetails" component={ChatDetails}/>
    </Stack.Navigator>
  );
}

export default App;