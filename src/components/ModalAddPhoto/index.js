import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import IconFeather from 'react-native-vector-icons/Feather';

import {colors} from '../../styles';
import Modal from '../Modal';

const {width, height} = Dimensions.get('window');

const ModalAddPhoto = ({
  visible,
  setVisible,
  onPresslaunchCamera,
  onPresslaunchGallery,
}) => {
  return (
    <Modal visible={visible} setVisible={() => setVisible(false)}>
      <View style={styles.containerContentModal}>
        <ItemIcon
          icon="camera"
          title="Tirar foto"
          onPress={onPresslaunchCamera}
        />
        <ItemIcon
          icon="image"
          title="Escolher existente..."
          onPress={onPresslaunchGallery}
        />
        <View style={{height: (height * 1) / 100}} />
        <ItemIcon icon="x" title="Cancelar" onPress={() => setVisible(false)} />
      </View>
    </Modal>
  );
};
const ItemIcon = ({icon, title, onPress}) => (
  <TouchableOpacity style={styles.containerItemIcon} onPress={onPress}>
    <IconFeather
      name={icon}
      size={(width * 7) / 100}
      color={colors.textPrimary}
    />
    <Text style={styles.textItemIcon}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  containerContentModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: (height * 15) / 100,
    backgroundColor: 'white',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    paddingVertical: (height * 2) / 100,
  },
  containerItemIcon: {
    flexDirection: 'row',
    paddingHorizontal: (10 * width) / 100,
    paddingTop: (height * 1) / 100,
    alignItems: 'center',
    marginBottom: (height * 2) / 100,
  },
  textItemIcon: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: (width * 3) / 100,
  },
});

export default ModalAddPhoto;
