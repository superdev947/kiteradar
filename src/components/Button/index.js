import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {colors} from '../../styles';
import {hexToRGB} from '../../utils/colors';
import {resize} from '../../utils/font';

const Button = ({
  title = '',
  style = {},
  titleStyle = {},
  type = 'primary',
  loading,
  disabled,
  icon,
  ...rest
}) => {
  const bgColor =
    type === 'primary'
      ? colors.primary
      : type === 'light'
      ? 'white'
      : type === 'danger'
      ? '#EE1C28'
      : colors.secondary;
  const textColor =
    type === 'primary'
      ? colors.white
      : type === 'light'
      ? 'black'
      : colors.white;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && {backgroundColor: hexToRGB(colors.primary, 0.6)},
        {backgroundColor: bgColor},
        style,
      ]}
      disabled={disabled || loading}
      {...rest}>
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <>
          {icon && <Icon name={icon} size={20} color="white" />}
          <Text style={[styles.title, {color: textColor}, titleStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: resize(5),
    paddingVertical: 10,
    flexDirection: 'row',
  },
  title: {
    color: 'white',
    fontSize: resize(16),
    ////fontFamily: 'Montserrat-Medium',
  },
});

export default Button;
