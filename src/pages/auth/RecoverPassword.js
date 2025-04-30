import React from 'react';
import {
  View,
  Image,
  ImageBackground,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import background from '../../assets/imgs/background_login.png';
import logo from '../../assets/imgs/logo.png';

import {Input, Button} from '../../components';

const {width, height} = Dimensions.get('window');

const Login = ({navigation}) => {
  return (
    <ImageBackground style={styles.container} source={background}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text>Informe seu e-mail</Text>
        <View style={styles.containerInputs}>
          <Input placeholder="E-mail" />
          <View style={{height: (height * 3) / 100}} />
          <Button title="Recuperar" />
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.buttonBack}>Voltar</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: (width * 50) / 100,
    height: (width * 50) / 100,
    resizeMode: 'contain',
  },
  containerInputs: {
    width: (width * 70) / 100,
    marginTop: 15,
  },
  buttonBack: {
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: (height * 2) / 100,
  },
});

export default Login;
