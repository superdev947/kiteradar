import React, {forwardRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import {resize} from '../../../../utils/font';

const Input = ({style, label, disabled, onPress, ...props}, ref) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={style}>
        <View style={styles.container}>
          <TextInput
            {...props}
            ref={ref}
            editable={!disabled}
            style={[styles.input]}
            placeholderTextColor="#4E7ED8"
            autoCompleteType="off"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
    backgroundColor: '#DDEFFF',
    marginHorizontal: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    borderRadius: resize(10),
  },

  input: {
    fontSize: resize(16),
    paddingVertical:10,
    //fontFamily: 'Montserrat-Light',
    color: '#4E7ED8',
    flex: 1,
    paddingHorizontal: 15,
  },
});

export default forwardRef(Input);
