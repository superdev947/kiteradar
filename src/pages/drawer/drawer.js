import React, {useState, useEffect} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Feather';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {StackActions} from '@react-navigation/routers';

import Radar from '../radar';
import RadarFavorite from '../radar/Favorite';
import Profile from '../profile';
import Ads from '../ads';
import MyAds from '../ads/MyAds';
import Equipment from '../equipment';
import Terms from '../terms';
import LostFound from '../lostFound';
import Invites from '../invites';
import MyRadar from '../myRadar';
import Destaque from '../destaque';
import notification from '../Notification';
import chat from '../Chat';

import {colors} from '../../styles';
import {resize} from '../../utils/font';

import profile from '../../assets/imgs/profile.png';
import {setUser, setToken} from '../../store/modules/user/actions';

const Drawer = createDrawerNavigator();

const {width, height} = Dimensions.get('window');

export default function App() {
  return (
    <View style={{flex: 1}}>
      <Drawer.Navigator
        initialRouteName="Destaque"
        backBehavior="initialRoute"
        drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Destaque" component={Destaque} />
        <Drawer.Screen name="notification" component={notification} />
        <Drawer.Screen name="Chat" component={chat} />
        <Drawer.Screen name="Radares" component={Radar} />
        <Drawer.Screen name="Favoritos" component={RadarFavorite} />
        <Drawer.Screen name="Anúncios" component={Ads} />
        <Drawer.Screen name="AchadosPerdidos" component={LostFound} />
        <Drawer.Screen name="Meu Radar" component={MyRadar} />
        <Drawer.Screen name="Meus Anúncios" component={MyAds} />
        <Drawer.Screen name="Meus Equipamentos" component={Equipment} />
        <Drawer.Screen name="Sair" component={Logout} />
        <Drawer.Screen name="Termos" component={Terms} />
        <Drawer.Screen name="Invites" component={Invites} />
      </Drawer.Navigator>
    </View>
  );
}

const Logout = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setToken(null));
    navigation.dispatch(StackActions.replace('AuthLogin'));
  }, []);

  return <></>;
};

function CustomDrawerContent(props) {
  const [drawerItems, setDrawerItems] = useState([
    {
      drawerLabel: 'Destaques',
      drawerIcon: 'trending-up',
      routeName: 'Destaque',
      group: '',
    },
    {
      drawerLabel: 'Chat',
      drawerIcon: 'message-circle',
      routeName: 'Chat',
      group: '',
    },
    {
      drawerLabel: 'Notificações',
      drawerIcon: 'bell',
      routeName: 'notification',
      group: '',
    },
    {
      drawerLabel: 'Radares',
      drawerIcon: 'aperture',
      routeName: 'Radares',
      group: '',
    },
    {
      drawerLabel: 'Favoritos',
      drawerIcon: 'star',
      routeName: 'Favoritos',
      group: '',
    },
    {
      drawerLabel: 'Anúncios',
      drawerIcon: 'award',
      routeName: 'Anúncios',
      group: '',
    },
    {
      drawerLabel: 'Invites',
      drawerIcon: 'award',
      routeName: 'Invites',
      group: '',
    },
    {
      drawerLabel: 'Achados e perdidos',
      drawerIcon: 'alert-triangle',
      routeName: 'AchadosPerdidos',
      group: '',
    },
    {
      drawerLabel: 'Meu Radar',
      drawerIcon: 'user',
      routeName: 'Meu Radar',
      group: '1',
    },
    // {
    //   drawerLabel: 'Meus Anúncios',
    //   drawerIcon: 'dollar-sign',
    //   routeName: 'Meus Anúncios',
    //   group: '',
    // },
    // {
    //   drawerLabel: 'Meus Equipamentos',
    //   drawerIcon: 'archive',
    //   routeName: 'Meus Equipamentos',
    //   group: '',
    // },
    {
      drawerLabel: 'Termos',
      drawerIcon: 'bookmark',
      routeName: 'Termos',
      group: '',
    },
    {
      drawerLabel: 'Sair',
      drawerIcon: 'log-out',
      routeName: 'Sair',
      group: '',
    },
  ]);
  const [drawerSelected, setDrawerSelected] = useState(0);

  const {user} = useSelector((store) => store.user);

  const ItemHeader = ({item, index}) => {
    const indexPosition = drawerItems.findIndex(
      (obj) => obj.group === item.group,
    );
    if (indexPosition === index && item.group !== '') {
      return <View style={styles.divider} />;
    } else {
      return <></>;
    }
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.containerHeader}>
        <Image
          source={user.photo ? {uri: user.photo.url} : profile}
          style={styles.imageProfile}
        />
        <Text style={styles.textName}>{user.name}</Text>
        <Text numberOfLines={1} style={styles.textEmail}>
          {user.email}
        </Text>
      </View>
      <View style={styles.containerContent}>
        <FlatList
          data={drawerItems}
          keyExtractor={(item, index) => String(index + JSON.stringify(item))}
          renderItem={({item, index}) => (
            <>
              <ItemHeader item={item} index={index} />
              <DrawerItem
                label={item.drawerLabel}
                icon={({color, size}) => (
                  <Icon name={item.drawerIcon} color={'white'} size={size} />
                )}
                labelStyle={styles.textDrawerItem}
                onPress={() => {
                  setDrawerSelected(index);
                  props.navigation.navigate(item.routeName);
                }}
              />
            </>
          )}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    paddingBottom: (height * 3) / 100,
  },
  containerHeader: {
    paddingTop: (height * 4) / 100,
    paddingBottom: (height * 2) / 100,
    paddingLeft: (width * 7) / 100,
    backgroundColor: colors.primaryDark,
    borderBottomRightRadius: resize(10),
    borderBottomLeftRadius: resize(10),
    marginTop: -(height * 1) / 100,
  },
  containerContent: {
    flex: 1,
    marginHorizontal: (width * 2) / 100,
    paddingBottom: (height * 5) / 100,
    paddingTop: (height * 1) / 100,
  },
  imageProfile: {
    width: (width * 15) / 100,
    height: (width * 15) / 100,
    borderRadius: (width * 15) / 100,
  },
  textName: {
    marginTop: (height * 1.5) / 100,
    fontSize: resize(16),
    color: 'white',
    //fontFamily: 'Montserrat-Bold',
  },
  textEmail: {
    fontSize: resize(12),
    color: 'white',
    //fontFamily: 'Montserrat-Regular',
  },
  divider: {
    height: 1,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: (height * 2.5) / 100,
  },
  textDrawerItem: {
    fontSize: resize(16),
    color: 'white',
    //fontFamily: 'Montserrat-SemiBold',
    marginLeft: -((width * 5) / 100),
  },
});
