import React from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import {colors} from '../../styles';

export default function PickerComponent({
  value,
  changeValue,
  items = [],
  placeholder,
  error,
  label,
}) {
  const borderColor = error ? colors.danger : '#c4c4c4';
  let list = items;
  if (placeholder) {
    list = [{label: placeholder, value: null}, ...items];
  }

  return (
    <View style={styles.container}>
      <View style={[styles.containerPicker]}>
        <Picker
          mode="dropdown"
          selectedValue={value}
          style={{height: Platform.OS === 'android' ? 50 : 80, flex: 1}}
          onValueChange={(itemValue, itemIndex) => {
            changeValue(itemValue);
          }}>
          {list.map((item, index) => (
            <Picker.Item
              key={String(index)}
              color={item.value ? 'black' : '#858585'}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
      {error && <Text style={styles.textError}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  textLabel: {
    marginVertical: 5,
  },
  containerPicker: {
    flexDirection: 'row',
    borderRadius: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginHorizontal: 2,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
  },
  textError: {
    color: colors.danger,
    marginLeft: 10,
  },
});
