import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';

import api from '../../services/api';
import {resize} from '../../utils/font';

import {colors} from '../../styles';
import {setUser} from '../../store/modules/user/actions';

import profile from '../../assets/imgs/profile.png';
import bg from '../../assets/imgs/background_profile.png';

import {Footer} from '../../components';

const {height, width} = Dimensions.get('window');

const Details = ({navigation}) => {
  const dispatch = useDispatch();

  const {user} = useSelector((store) => store.user);
  console.log('user details', user);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUser();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUser = () => {
    api.get(`user/list/${user.id}`).then((resp) => {
      dispatch(setUser(resp.data));
      console.log('data', resp.data);
    });
  };

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={bg} />
      <View style={styles.containerProfile}>
        <View style={styles.containerImage}>
          <Image
            style={styles.image}
            source={user.photo ? {uri: user.photo.url} : profile}
          />
          <View style={styles.containerName}>
            <Text style={styles.textName}>{user.name}</Text>
            <Text style={styles.textCity} numberOfLines={1}>
              {user.state && user.state.name} - {user.state && user.state.uf}
            </Text>
          </View>
        </View>
        <View style={styles.containerInfo}>
          {user.whats && (
            <ItemInformation
              icon="md-call-outline"
              title={user.whats}
              dataDetectorType="phoneNumber"
            />
          )}
          {user.email && (
            <ItemInformation icon="md-mail-outline" title={user.email} />
          )}
          {user.cpf && (
            <ItemInformation icon="md-document-text-outline" title={user.cpf} />
          )}
          {user.cep && (
            <ItemInformation icon="md-map-outline" title={user.cep} />
          )}
        </View>
      </View>
      <Footer />
    </View>
  );
};

const ItemInformation = ({icon, title}) => (
  <View style={styles.containerItemInformation}>
    <Icon name={icon} size={resize(25)} color={colors.primary} />
    <Text style={styles.textInformation} selectable>
      {title}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  containerProfile: {
    paddingTop: (height * 10) / 100,
    paddingHorizontal: (width * 10) / 100,
    flex: 1,
  },
  containerInfo: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: resize(10),
    marginHorizontal: -(width * 8) / 100,
    paddingVertical: (height * 1) / 100,
    paddingHorizontal: (width * 3) / 100,
  },
  containerLogout: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#C4C4C4',
  },
  textLogout: {
    color: colors.primary,
    fontSize: 18,
  },
  containerImage: {
    flexDirection: 'row',
    marginBottom: (height * 5) / 100,
  },
  image: {
    height: resize(116),
    width: resize(116),
    borderRadius: resize(116),
  },
  containerName: {
    marginLeft: (width * 5) / 100,
    marginTop: (height * 4) / 100,
    justifyContent: 'center',
    flex: 1,
  },
  textName: {
    color: colors.black,
    fontSize: resize(18),
    //fontFamily: 'Montserrat-Regular',
  },
  textCity: {
    color: colors.black,
    fontSize: resize(16),
    //fontFamily: 'Montserrat-Regular',
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: (height * 15) / 100,
    borderBottomRightRadius: resize(20),
    resizeMode: 'cover',
    width: width,
  },
  containerItemInformation: {
    flexDirection: 'row',
    marginVertical: (height * 2) / 100,
  },
  textInformation: {
    color: colors.textPrimary,
    marginLeft: (width * 4) / 100,
    fontSize: resize(18),
    //fontFamily: 'Montserrat-Light',
  },
});

export default Details;
