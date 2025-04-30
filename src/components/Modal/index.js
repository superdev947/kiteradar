import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

const ModalComponent = ({visible, setVisible, children}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => setModalFoto(false)}>
      <View style={styles.containerModal}>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={{flex: 1}} />
        </TouchableWithoutFeedback>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});

export default ModalComponent;
