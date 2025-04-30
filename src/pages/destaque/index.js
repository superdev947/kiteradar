import * as React from 'react';
import {Platform, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Ionicons, Feather} from 'react-native-vector-icons';

import {colors} from '../../styles';
import List from './List';
import Details from './Details';
import Publish from './Publish';
import Abuses from './Abuses';
import Filter from './Filter';

import ChatsList from '../Chat/List';
import ChatDetails from '../Chat/Chat';

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
          title: 'Resenhas',
          headerLeft: () => (
            <Ionicons
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
            <View style={{flexDirection:'row', marginRight:10}}>
              <Ionicons
                color="white"
                name='add-circle'
                size={30}
                style={{marginLeft: 10}}
                onPress={() =>navigation.navigate('Publish')}
              />
              <Feather
                color="white"
                name='filter'
                size={30}
                style={{marginLeft: 10}}
                onPress={() =>navigation.navigate('Filter')}
              />
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={({navigation, route}) => ({
          title: 'Comentários',
        })}
      />
      <Stack.Screen
        name="Publish"
        component={Publish}
        options={({navigation, route}) => ({
          title: 'Publicar Resenha',
        })}
      />
      <Stack.Screen
        name="Abuses"
        component={Abuses}
        options={({navigation, route}) => ({
          title: 'Denunciar Abuso',
        })}
      />
      <Stack.Screen
        name="Filter"
        component={Filter}
        options={({navigation, route}) => ({
          title: 'Filtro',
        })}
      />
      <Stack.Screen
        name="ChatsList"
        component={ChatsList}
        options={({navigation, route}) => ({
          title: 'Chats'
        })}
      />
      <Stack.Screen name="ChatDetails" component={ChatDetails}/>
    </Stack.Navigator>
  );
}

export default App;