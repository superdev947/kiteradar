import React from 'react';
import {Dimensions, Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {colors} from '../../styles';
import List from './Tab1';
import Details from './Tab';
import Filter from './Filter';
import { Feather, Ionicons } from 'react-native-vector-icons';
const {height, width} = Dimensions.get('window');

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
          title: 'Radares',
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
            <Feather
              color="white"
              name={'filter'}
              size={24}
              style={{marginHorizontal: (width * 5) / 100}}
              onPress={()=>navigation.navigate('RadarFilter')}
            />
          ),
        })}
      />
      <Stack.Screen name="Details" component={Details}/>
      <Stack.Screen name="RadarFilter" component={Filter} options={{title: 'Filtro'}}/>
    </Stack.Navigator>
  );
}

export default App;
