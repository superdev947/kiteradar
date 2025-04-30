import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {StackActions} from '@react-navigation/routers';

import Logo from '../../assets/imgs/logo.png';
import background from '../../assets/imgs/background.png';

const {width, height} = Dimensions.get('window');

const Splash = ({navigation}) => {
  const {token} = useSelector((store) => store.user);

  useEffect(() => {
    setTimeout(() => {
      if (token) {
        navigation.dispatch(StackActions.replace('Drawer'));
      } else {
        navigation.dispatch(StackActions.replace('AuthLogin'));
      }
    }, 2000);
  }, []);

  return (
    <ImageBackground style={styles.container} source={background}>
      <Image style={styles.logo} source={Logo} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: (width * 50) / 100,
    height: (width * 50) / 100,
    resizeMode: 'contain',
  },
});

export default Splash;
