import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';

import {colors} from '../../styles';

import notFound from '../../assets/imgs/not_found.png';

const NotFound = ({title}) => {
  return (
    <View style={styles.container}>
      <Image source={notFound} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: (Dimensions.get('window').width * 70) / 100,
    height: (Dimensions.get('window').height * 35) / 100,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 15,
    fontSize: 25,
    textAlign: 'center',
    color: colors.primary,
  },
});

export default NotFound;
