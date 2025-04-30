import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import {Footer} from '../../components';
import {resize} from '../../utils/font';

const myRadar = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ItemList
        name="Perfil"
        icon="user"
        onPress={() => navigation.navigate('Profile')}
      />
      <ItemList
        name="Meus Equipamentos"
        icon="archive"
        onPress={() => navigation.navigate('Equipment')}
      />
      <ItemList
        name="Meus Invites"
        icon="mail"
        onPress={() => navigation.navigate('MyInvites')}
      />
      <ItemList
        name="Meus Anúncios"
        icon="dollar-sign"
        onPress={() => navigation.navigate('MyAds')}
      />
      <ItemList name="Assinatura" icon="star" />
      <Footer />
    </View>
  );
};

const ItemList = ({icon, name, onPress}) => (
  <TouchableOpacity style={styles.containerItem} onPress={onPress}>
    <Icon name={icon} size={25} color="#0062FF" />
    <Text style={styles.textItem}>{name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 10,
  },
  textItem: {
    color: '#ACACAC',
    marginLeft: 10,
    fontSize: resize(16),
    //fontFamily: 'Montserrat-Regular',
  },
  containerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 2,
    backgroundColor: 'white',
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
});
export default myRadar;
