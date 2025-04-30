import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Splash from './pages/splash';

import AuthLogin from './pages/auth/Login';
import AuthRegister from './pages/auth/Register';
import AuthRecoverPassword from './pages/auth/RecoverPassword';

import Drawer from './pages/drawer/drawer';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="AuthLogin" component={AuthLogin} />
        <Stack.Screen name="AuthRegister" component={AuthRegister} />
        <Stack.Screen
          name="AuthRecoverPassword"
          component={AuthRecoverPassword}
        />
        <Stack.Screen name="Drawer" component={Drawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
