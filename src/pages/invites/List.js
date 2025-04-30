import React from 'react';
import {View, StyleSheet} from 'react-native';

import {CardInvite} from '../../components';

const invites = ({navigation}) => {
  return (
    <View style={styles.container}>
      <CardInvite onPress={() => navigation.navigate('Details')} />
      <CardInvite onPress={() => navigation.navigate('Details')} />
      <CardInvite onPress={() => navigation.navigate('Details')} />
      <CardInvite onPress={() => navigation.navigate('Details')} />
      <CardInvite onPress={() => navigation.navigate('Details')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default invites;
