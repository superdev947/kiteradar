import React, {forwardRef} from 'react';
import {TextInput, Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../styles';
import {resize} from '../../utils/font';

function TextArea(
  {
    changeText,
    value,
    placeholder,
    password,
    icon,
    error,
    returnKeyType,
    onSubmit,
    label,
    max = 524288,
    disabled = false,
  },
  ref,
) {
  const borderColor = error ? colors.danger : '#c4c4c4';
  return (
    <View style={styles.container}>
      {label && <Text style={styles.textLabel}>{label}</Text>}
      <View style={[styles.containerInput, {borderColor: borderColor}]}>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder={placeholder}
          placeholderTextColor="#9c9c9c"
          secureTextEntry={password}
          autoCapitalize="sentences"
          ref={ref}
          value={value}
          onChangeText={changeText}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmit}
          maxLength={max}
          numberOfLines={10}
          multiline={true}
          editable={!disabled}
        />
        {icon && <Icon name={icon} size={18} color="gray" />}
      </View>
      {error && <Text style={styles.textError}>{error}</Text>}
    </View>
  );
}

TextArea.defaultProps = {
  changeText: () => {},
  value: '',
  placeholder: '',
  password: false,
  icon: null,
  error: false,
  errorMessage: '',
  keyboardType: 'default',
  returnKeyType: 'go',
  onSubmit: () => {},
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  textLabel: {
    marginVertical: 5,
  },
  containerInput: {
    flexDirection: 'row',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 2,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 2,
    backgroundColor: 'white',
  },
  input: {
    color: 'black',
    flex: 1,
    height: 120,
    textAlignVertical: 'top',
    fontSize: resize(16),
    paddingTop:5,
    //fontFamily: 'Montserrat-Light',
  },
  textError: {
    color: colors.danger,
    marginLeft: 10,
  },
});

export default forwardRef(TextArea);
