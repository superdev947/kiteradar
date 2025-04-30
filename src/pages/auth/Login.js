import React, {useState, createRef, useEffect} from 'react';
import {
  View,
  Image,
  ImageBackground,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {StackActions} from '@react-navigation/routers';
import Icon from 'react-native-vector-icons/Ionicons';

import background from '../../assets/imgs/background_login.png';
import logo from '../../assets/imgs/logo2.png';
import IconGoogle from '../../assets/icons/Google';

import {Button} from '../../components';
import {InputLogin as Input} from './components';

const {width, height} = Dimensions.get('window');

import {setToken, setUser} from '../../store/modules/user/actions';
import api from '../../services/api';
import {displayName} from '../../../app.json';
import {resize} from '../../utils/font';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const passwordRef = createRef();

  const validateForm = () => {
    if (
      data.email.length < 0 ||
      !data.email.includes('@') ||
      !data.email.includes('.')
    )
      return false;
    if (data.password.length < 6) return false;
    return true;
  };

  const login = () => {
    setLoading(true);
    api
      .post('auth/login', data)
      .then((resp) => {
        setLoading(false);
        dispatch(setUser(resp.data.user));
        dispatch(setToken(resp.data.token));
        navigation.dispatch(StackActions.replace('Drawer'));
      })
      .catch((error) => {
        console.log('error', error);
        setLoading(false);

        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          Alert.alert(displayName, error.response.data.error);
        } else {
          console.log('Error', error.message);
          Alert.alert(
            displayName,
            'Não foi possível realizar o login. Tente novamente mais tarde',
          );
        }
      });
  };

  return (
    <ImageBackground
      style={styles.container}
      source={background}
      imageStyle={styles.background}>
      <View style={styles.containerInputs}>
        <View style={{flex: 1}} />
        <View style={styles.containerLogo}>
          <Image source={logo} style={styles.logo} />
        </View>
        <Text style={styles.textLogin}>Realize seu login</Text>
        <Input
          placeholder="E-mail"
          value={data.email}
          onChangeText={(text) => setData({...data, email: text})}
          returnKeyType="next"
          autoCapitalize="none"
          keyboardType="email-address"
          style={{paddingVertical:10}}
          onSubmitEditing={() => passwordRef.current.focus()}
        />
        <View style={{height: 10}} />
        <Input
          placeholder="Senha"
          value={data.password}
          secureTextEntry
          onChangeText={(text) => setData({...data, password: text})}
          ref={passwordRef}
          returnKeyType="send"
          style={{marginBottom: 10}}
        />
        <TouchableOpacity>
          <Text
            style={styles.buttonResetPassword}
            onPress={() => navigation.navigate('AuthRecoverPassword')}>
            Esqueceu sua senha?
          </Text>
        </TouchableOpacity>

        <View style={styles.containerSeparador}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>ou</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.containerSocial}>
          <TouchableOpacity style={styles.buttonSocialApple}>
            <Icon name="logo-apple" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSocialGoogle}>
            <IconGoogle size={25} />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}} />
        <Button
          type="login"
          title="Entrar"
          onPress={login}
          // disabled={!validateForm()}
          loading={loading}
        />
        <TouchableOpacity onPress={() => navigation.navigate('AuthRegister')}>
          <Text style={styles.buttonCreateAccount}>Criar conta</Text>
        </TouchableOpacity>
        <View style={{flex: 0.3}} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    resizeMode: 'cover',
    position: 'absolute',
    height: (height * 80) / 100,
    borderBottomRightRadius: resize(30),
    borderBottomLeftRadius: resize(30),
  },
  containerLogo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: (width * 50) / 100,
    height: (width * 50) / 100,
    resizeMode: 'contain',
  },
  textLogin: {
    fontSize: resize(16),
    //fontFamily: 'Montserrat-Bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 15,
  },
  containerInputs: {
    width: (width * 90) / 100,
    marginTop: 15,
    justifyContent: 'center',
    flex: 1,
  },
  containerButtons: {
    width: width,
    paddingHorizontal: (width * 5) / 100,
    flexDirection: 'column',
  },
  buttonResetPassword: {
    textAlign: 'right',
    marginBottom: 15,
    fontSize: resize(14),
    color: 'white',
    //fontFamily: 'Montserrat-Regular',
  },
  buttonCreateAccount: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: resize(16),
    //fontFamily: 'Montserrat-Regular',
  },
  containerSeparador: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: (height * 2) / 100,
    marginBottom: (height * 2) / 100,
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: 'white',
    marginTop: 5,
  },
  separatorText: {
    color: 'white',
    fontSize: resize(14),
    marginHorizontal: 10,
    ////fontFamily: 'Montserrat-Medium',
  },
  containerSocial: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonSocialApple: {
    backgroundColor: 'black',
    borderRadius: resize(10),
    flex: 1,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  buttonSocialGoogle: {
    backgroundColor: 'white',
    borderRadius: resize(10),
    marginLeft: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
});

export default Login;
