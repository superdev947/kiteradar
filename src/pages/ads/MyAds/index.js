import * as React from 'react';
import {Platform, Alert} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import {colors} from '../../../styles';
import List from './List';
import Details from '../Details';
import Edit from './Edit';
import Create from './Create';
import FilterCity from '../FilterCity';

import {displayName} from '../../../../app.json';

const Stack = createStackNavigator();

function App() {
  const backAction = (navigation) => {
    Alert.alert(
      displayName,
      'Tem certeza que deseja sair? Suas alterações não serão salvas.',
      [
        {
          text: 'Cancelar',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'Sim', onPress: () => navigation.goBack()},
      ],
    );
  };

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
          title: 'Meus anúncios',
          headerLeft: () => (
            <Icon
              color="white"
              name={
                Platform.OS === 'ios' ? 'ios-chevron-back' : 'md-arrow-back'
              }
              size={30}
              style={{marginLeft: 10}}
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
          headerRight: () => (
            <Icon
              color="white"
              name="add"
              size={25}
              style={{marginRight: 10}}
              onPress={() => {
                navigation.navigate('AdCreate');
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
          headerRight: () => (
            <Icon
              name="share-social-outline"
              size={30}
              color="white"
              style={{marginRight: 10}}
            />
          ),
        })}
      />
      <Stack.Screen
        name="AdEdit"
        component={Edit}
        options={({navigation, route}) => ({
          title: 'Editar anúncio',
          headerLeft: () => (
            <Icon
              color="white"
              name={Platform.OS === 'android' ? 'arrow-back' : 'chevron-back'}
              size={25}
              style={{marginLeft: 10}}
              onPress={() => {
                backAction(navigation);
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="AdCreate"
        component={Create}
        options={({navigation, route}) => ({
          title: 'Criar anúncio',
          headerLeft: () => (
            <Icon
              color="white"
              name={Platform.OS === 'android' ? 'arrow-back' : 'chevron-back'}
              size={25}
              style={{marginLeft: 10}}
              onPress={() => {
                backAction(navigation);
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="FilterCity"
        component={FilterCity}
        options={({navigation, route}) => ({
          title: 'Cidades',
        })}
      />
    </Stack.Navigator>
  );
}

export default App;
