import React, {useEffect, useRef} from 'react';
import {Dimensions, StyleSheet, Keyboard, Animated, Image} from 'react-native';

import footer from '../../assets/imgs/footer.png';
const {height, width} = Dimensions.get('window');

const Footer = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const _keyboardDidHide = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.Image
      source={footer}
      style={[
        styles.container,
        {
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [(height * 50) / 100, 0],
          }),
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: (height * 4) / 100,
    width: width,
  },
});

export default Footer;
