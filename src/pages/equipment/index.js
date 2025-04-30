import * as React from 'react';
import {Platform, Alert} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFeather from 'react-native-vector-icons/Feather';

import {colors} from '../../styles';
import Home from './Home';
import Register from './Register';
import Details from './Details';
import Transfer from './Transfer';
import CreateOccurrence from './CreateOccurrence';
import Edit from './Edit';
import FilterCity from '../ads/FilterCity';
import {displayName} from '../../../app.json';

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
        name="Home"
        component={Home}
        options={({navigation, route}) => ({
          title: 'Meus equipamentos',
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
              name="add-circle"
              size={30}
              style={{marginRight: 10}}
              onPress={() => {
                navigation.navigate('Register');
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="EquipmentDetails"
        component={Details}
        options={({navigation, route}) => ({
          title: 'Meu equipamento',
          headerRight: () => (
            <IconFeather
              color="white"
              name="edit"
              size={30}
              style={{marginRight: 10}}
              onPress={() => {
                const {item} = route.params;
                navigation.navigate('Edit', {item});
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Edit"
        component={Edit}
        options={({navigation, route}) => ({
          title: 'Editar Equipamento',
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
        name="Register"
        component={Register}
        options={({navigation, route}) => ({
          title: 'Registrar Equipamento',
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
        name="EquipmentTransfer"
        component={Transfer}
        options={({navigation, route}) => ({
          title: 'Transferir equipamento',
        })}
      />
      <Stack.Screen
        name="CreateOccurrence"
        component={CreateOccurrence}
        options={({navigation, route}) => ({
          title: 'Criar ocorrência',
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
