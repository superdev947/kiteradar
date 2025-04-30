import React, {forwardRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Input = (
  {style, label, disabled, onPress, icon, onPressIcon, ...props},
  ref,
) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={style}>
        <View style={styles.container}>
          <TextInput
            {...props}
            ref={ref}
            editable={!disabled}
            style={[styles.input]}
            placeholderTextColor="#C4C4C4"
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: 'black',
    marginBottom: 3,
  },
  input: {
    paddingVertical:10,
    fontSize: 16,
    color: 'black',
    flex: 1,
  },
});

export default forwardRef(Input);
