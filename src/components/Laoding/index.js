import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

import {colors} from '../../styles';

const Laoding = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Laoding;
