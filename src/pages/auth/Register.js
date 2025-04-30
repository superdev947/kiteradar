import React, {useState, createRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconIon from 'react-native-vector-icons/Ionicons';

import {MaskService} from 'react-native-masked-text';
import {useDispatch} from 'react-redux';
import {StackActions} from '@react-navigation/routers';

import {Input, Button, Footer} from '../../components';
import {setToken, setUser} from '../../store/modules/user/actions';

import background from '../../assets/imgs/main_background.png';
import logo from '../../assets/imgs/logo3.png';
import footer from '../../assets/imgs/footer.png';
import IconGoogle from '../../assets/icons/Google';

import api from '../../services/api';
import {displayName} from '../../../app.json';
import {resize} from '../../utils/font';

const {width, height} = Dimensions.get('window');

const Register = ({navigation}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    name: '',
    last_name: '',
    email: '',
    cpf: '',
    whats: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const lastNameRef = createRef();
  const emailRef = createRef();
  const cpfRef = createRef();
  const phoneRef = createRef();
  const passwordRef = createRef();
  const cepRef = createRef();

  const validateForm = () => {
    if (data.name.length < 2) return false;
    if (data.last_name.length < 2) return false;
    if (
      data.email.length < 0 ||
      !data.email.includes('@') ||
      !data.email.includes('.')
    )
      return false;
    if (data.cpf.length < 11) return false;
    if (data.whats.length < 8) return false;
    if (data.password.length < 6) return false;
    return true;
  };

  const maskCPF = (text) => {
    return MaskService.toMask('cpf', text);
  };

  const maskCEP = (text) => {
    return MaskService.toMask('zip-code', text);
  };

  const maskPhone = (text) => {
    return MaskService.toMask('cel-phone', text, {
      maskType: 'BRL',
      withDDD: true,
      dddMask: '(99) ',
    });
  };

  const register = () => {
    // if (!cpf(data.cpf)) {
    //   return Alert.alert(displayName, 'CPF inválido');
    // }
    console.log(data)
    setLoading(true);
    api
      .post('auth/create', data)
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
          // Request made and server responded
          console.log('error.response', error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          Alert.alert(displayName, error.response.data.error);
        } else {
          Alert.alert(
            displayName,
            'Não foi possível realizar o cadastro. Tente novamente mais tarde',
          );
          console.log('Error', error.message);
        }
      });
  };

  function cpf(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    var result = true;
    [9, 10].forEach(function (j) {
      var soma = 0,
        r;
      cpf
        .split(/(?=)/)
        .splice(0, j)
        .forEach(function (e, i) {
          soma += parseInt(e) * (j + 2 - (i + 1));
        });
      r = soma % 11;
      r = r < 2 ? 0 : 11 - r;
      if (r != cpf.substring(j, j + 1)) result = false;
    });
    return result;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground style={styles.containerContent} source={background}>
        <View style={styles.containerInputs}>
          <View style={styles.containerLogo}>
            <Image source={logo} />
          </View>
          <Input
            placeholder="Nome"
            style={styles.input}
            value={data.name}
            onChangeText={(text) => setData({...data, name: text})}
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current.focus()}
          />
          <Input
            placeholder="Sobrenome"
            style={styles.input}
            value={data.last_name}
            onChangeText={(text) => setData({...data, last_name: text})}
            ref={lastNameRef}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
          />
          <Input
            placeholder="E-mail"
            style={styles.input}
            value={data.email}
            onChangeText={(text) => setData({...data, email: text})}
            ref={emailRef}
            autoCapitalize="none"
            returnKeyType="next"
            keyboardType="email-address"
            onSubmitEditing={() => cpfRef.current.focus()}
          />
          <Input
            placeholder="CPF"
            style={styles.input}
            value={data.cpf}
            onChangeText={(text) => setData({...data, cpf: maskCPF(text)})}
            keyboardType="numeric"
            ref={cpfRef}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current.focus()}
          />
          <Input
            placeholder="Whatsapp"
            style={styles.input}
            value={data.whats}
            onChangeText={(text) => setData({...data, whats: maskPhone(text)})}
            keyboardType="number-pad"
            ref={phoneRef}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
          />
          <Input
            placeholder="Senha"
            style={styles.input}
            value={data.password}
            secureTextEntry
            onChangeText={(text) => setData({...data, password: text})}
            ref={passwordRef}
            returnKeyType="next"
            onSubmitEditing={() => cepRef.current.focus()}
          />
          <Input
            placeholder="CEP"
            style={styles.input}
            value={data.cep}
            keyboardType="number-pad"
            onChangeText={(text) => setData({...data, cep: maskCEP(text)})}
            ref={cepRef}
            returnKeyType="send"
          />
          <Text style={styles.textOu}>OU</Text>

          <TouchableOpacity style={styles.buttonSocialApple}>
            <IconIon name="logo-apple" size={25} color="white" />
            <Text style={styles.titleButtonSocialApple}>
              Criar conta com Apple
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSocialGoogle}>
            <IconGoogle size={25} />
            <Text style={styles.titleButtonSocialGoogle}>
              Criar conta com Google
            </Text>
          </TouchableOpacity>
          <View style={{flex: 1}} />
        </View>
        <Button
          title="Criar"
          style={styles.buttonCreate}
          disabled={!validateForm()}
          loading={loading}
          onPress={register}
          type="light"
        />
        <TouchableOpacity
          style={styles.containerButtonBack}
          onPress={() => navigation.goBack()}>
          <Icon name="keyboard-backspace" size={20} color="white" />
          <Text style={styles.textButtonBack}>Fazer Login</Text>
        </TouchableOpacity>
        <Footer />
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerContent: {
    paddingTop: (height * 2) / 100,
    minHeight: (height * 100) / 100,
    paddingHorizontal: (width * 3) / 100,
    flex: 1,
  },
  containerInputs: {
    backgroundColor: '#F9F9F9',
    borderRadius: resize(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    paddingHorizontal: (width * 3) / 100,
    paddingTop: (height * 5) / 100,
    flex: 1,
  },
  containerLogo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: (height * 5) / 100,
  },
  buttonCreate: {
    marginTop: (height * 3) / 100,
    marginHorizontal: (width * 3) / 100,
  },
  input: {
    marginTop: (height * 1) / 100,
  },
  containerButtonBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: (height * 3) / 100,
    marginBottom: (height * 5) / 100,
  },
  textButtonBack: {
    fontSize: resize(16),
    marginLeft: (width * 2) / 100,
    ////fontFamily: 'Montserrat-Medium',
    color: 'white',
  },
  textOu: {
    marginVertical: (height * 2) / 100,
    textAlign: 'center',
    //fontFamily: 'Montserrat-Regular',
    fontSize: resize(16),
    color: 'black',
  },
  buttonSocialApple: {
    backgroundColor: 'black',
    borderRadius: resize(5),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    flexDirection: 'row',
  },
  buttonSocialGoogle: {
    backgroundColor: 'white',
    borderRadius: resize(5),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 3,
    marginVertical: 15,
    marginBottom: 20,
  },
  titleButtonSocialApple: {
    color: 'white',
    //fontFamily: 'Montserrat-Regular',
    fontSize: resize(16),
    marginLeft: 20,
  },
  titleButtonSocialGoogle: {
    color: 'black',
    //fontFamily: 'Montserrat-Regular',
    fontSize: resize(16),
    marginLeft: 20,
  },
});

export default Register;
