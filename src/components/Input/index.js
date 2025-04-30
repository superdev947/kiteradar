import React, {forwardRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import {resize} from '../../utils/font';
import {colors} from '../../styles';

const Input = (
  {style, label, disabled, onPress, icon, onPressIcon, ...props},
  ref,
) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={style}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.container}>
          <TextInput
            {...props}
            ref={ref}
            editable={!disabled}
            style={[styles.input]}
            placeholderTextColor={colors.textSecondary}
          />
          {icon && (
            <Icon name={icon} size={25} color="black" onPress={onPressIcon} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 2,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: resize(14),
    color: colors.textPrimary,
    //fontFamily: 'Montserrat-Regular',
    marginBottom: 3,
  },
  input: {
    fontSize: resize(16),
    color: 'black',
    paddingVertical:10,
    //fontFamily: 'Montserrat-Light',
    flex: 1,
  },
});

export default forwardRef(Input);
