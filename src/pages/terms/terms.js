import React from 'react';
import {View, StyleProp} from 'react-native';

import {NotFound} from '../../components';

const terms = () => {
  return (
    <View style={{flex: 1}}>
      <NotFound title="Nada encontrado" />
    </View>
  );
};

export default terms;
