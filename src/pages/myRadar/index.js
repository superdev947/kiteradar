import * as React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import {colors} from '../../styles';
import Details from './Details';
import Profile from '../profile/Details';
import ProfileEdit from '../profile/Edit';
import Equipment from '../equipment';
import MyAds from '../ads/MyAds';
import MyInvites from '../invites/myInvites';
import CreateInvites from '../invites/myInvites/Create';
import EditInvites from '../invites/myInvites/Edit';

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
          title: 'Meu Radar',
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

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={({navigation, route}) => ({
          title: 'Meu Perfil',
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            backgroundColor: colors.primary,
          },
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
        component={ProfileEdit}
        options={{
          title: 'Editar Perfil',
        }}
      />
      <Stack.Screen
        name="Equipment"
        component={Equipment}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MyAds"
        component={MyAds}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MyInvites"
        component={MyInvites}
        options={({navigation, route}) => ({
          title: 'Meus Invites',
          headerRight: () => (
            <Icon
              color="white"
              name="add-circle"
              size={30}
              style={{marginRight: 10}}
              onPress={() => {
                navigation.navigate('CreateInvites');
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="CreateInvites"
        component={CreateInvites}
        options={{
          title: 'Criar Invite',
        }}
      />
      <Stack.Screen
        name="EditInvites"
        component={EditInvites}
        options={{
          title: 'Editar Invite',
        }}
      />
    </Stack.Navigator>
  );
}

export default App;
