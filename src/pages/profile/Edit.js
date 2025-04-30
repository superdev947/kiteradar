import React, {useState, useEffect, createRef} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {MaskService} from 'react-native-masked-text';

import {Button, Input, Picker, ModalAddPhoto} from '../../components';
import api from '../../services/api';
import {resize} from '../../utils/font';

import {displayName} from '../../../app.json';
import {setUser} from '../../store/modules/user/actions';

const {width, height} = Dimensions.get('window');
import profile from '../../assets/imgs/profile.png';

const Edit = ({navigation}) => {
  const dispatch = useDispatch();

  const {user} = useSelector((store) => store.user);
  const [data, setData] = useState({});
  const [estados, setEstados] = useState([]);
  const [modalFoto, setModalFoto] = useState({});
  const [foto, setFoto] = useState();
  const [loading, setLoading] = useState(false);

  const cpfRef = createRef();
  const nomeRef = createRef();
  const segundoNomeRef = createRef();
  const whatsappRef = createRef();
  const cepRef = createRef();
  useEffect(() => {
    carregarListEstados();
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = () => {
    setData({
      cep: user.cep,
      cpf: user.cpf,
      email: user.email,
      id_photo: user.id_photo,
      id_state: user.id_state,
      last_name: user.last_name,
      name: user.name,
      whats: user.whats,
    });
    console.log('dataipdate,', data);
  };

  const carregarListEstados = () => {
    api.get('state').then((resp) => {
      setEstados(resp.data);
      
    });
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const onPresslaunchCamera = () => {
    if (requestCameraPermission()) {
      setModalFoto(false);
      const options = {mediaType: 'photo'};
      launchCamera(options, (resp) => {
        if (resp.fileName && resp.uri) {
          setFoto(resp);
        }
        
      });
    } else {
      Alert.alert(
        displayName,
        'Você precisa fornecer a permissão de camera para usar essa função',
      );
    }
  };
  const onPresslaunchGallery = () => {
    setModalFoto(false);
    const options = {mediaType: 'photo'};
    launchImageLibrary(options, (resp) => {
      if (resp.fileName && resp.uri) {
        setFoto(resp);
      }
      
    });
  };

  const editar = async () => {
    setLoading(true);
    let id_photo = data.id_photo;
    try {
      if (foto) {
        let uri = foto.uri;
        const uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const data = new FormData();
        data.append('file', {
          uri: uploadUri,
          type: foto.type,
          name: foto.fileName,
        });
        const config = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        };
        const responsePhoto = await api.post('files', data, config);
        id_photo = responsePhoto.data.id;
      }

      const date = {
        ...data,
        id_photo,
      };
      const response = await api.put(`user/update/${user.id}`, date);
      dispatch(setUser(response.data));
      navigation.goBack();
      Alert.alert(displayName, 'Perfil editado com sucesso');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error', error);
      Alert.alert(
        displayName,
        'Não foi possível salvar os dados. Tente mais tarde',
      );
    }
  };

  const maskPhone = (text) => {
    return MaskService.toMask('cel-phone', text, {
      maskType: 'BRL',
      withDDD: true,
      dddMask: '(99) ',
    });
  };

  const maskCPF = (text) => {
    return MaskService.toMask('cpf', text);
  };

  const maskCEP = (text) => {
    return MaskService.toMask('zip-code', text);
  };

  const validateForm = () => {
    if (!data.name || data.name.length === 0) return false;
    if (!data.last_name || data.last_name.length === 0) return false;
    if (!data.email || data.email.length === 0) return false;
    if (!data.whats || data.whats.length === 0) return false;
    if (!data.cpf || data.cpf.length === 0) return false;
    return true;
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <ImageBackground
          source={
            foto
              ? {uri: foto.uri}
              : user.photo
              ? {uri: user.photo.url}
              : profile
          }
          style={styles.image}
          imageStyle={styles.image}>
          <TouchableOpacity
            style={styles.containerImage}
            onPress={() => setModalFoto(true)}>
            <Icon name="camera-outline" size={25} color="white" />
          </TouchableOpacity>
        </ImageBackground>
        <Text style={styles.textName}>{user.name}</Text>
        <Text style={styles.textCity}>
          {user.state && `${user.state.name} - `} {user.state && user.state.uf}
        </Text>
        <View style={styles.containerInputs}>
          <Input
            label="E-mail"
            value={data.email}
            onChangeText={(text) => setData({...data, email: text})}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => cpfRef.current.focus()}
            keyboardType="email-address"
          />
          <Input
            label="CPF"
            placeholder="126-999-999-07"
            style={styles.input}
            value={data.cpf}
            onChangeText={(text) => setData({...data, cpf: maskCPF(text)})}
            ref={cpfRef}
            returnKeyType="next"
            keyboardType="numeric"
            onSubmitEditing={() => nomeRef.current.focus()}
          />
          <Input
            label="Nome"
            style={styles.input}
            value={data.name}
            onChangeText={(text) => setData({...data, name: text})}
            ref={nomeRef}
            returnKeyType="next"
            onSubmitEditing={() => segundoNomeRef.current.focus()}
          />
          <Input
            label="Segundo nome"
            style={styles.input}
            value={data.last_name}
            onChangeText={(text) => setData({...data, last_name: text})}
            ref={segundoNomeRef}
            returnKeyType="next"
            onSubmitEditing={() => whatsappRef.current.focus()}
          />
          <Input
            label="WhatsApp"
            style={styles.input}
            value={data.whats}
            onChangeText={(text) => setData({...data, whats: maskPhone(text)})}
            ref={whatsappRef}
            returnKeyType="next"
            keyboardType="number-pad"
            onSubmitEditing={() => cepRef.current.focus()}
          />
          <Input
            label="CEP"
            style={styles.input}
            value={data.cep}
            onChangeText={(text) => setData({...data, cep: maskCEP(text)})}
            ref={cepRef}
            keyboardType="numeric"
            returnKeyType="next"
          />

          <Button
            title="Salvar alterações"
            style={styles.button}
            titleStyle={styles.titleButton}
            disabled={!validateForm()}
            onPress={editar}
            loading={loading}
          />
        </View>
      </View>

      <ModalAddPhoto
        visible={modalFoto}
        setVisible={() => setModalFoto(false)}
        onPresslaunchCamera={onPresslaunchCamera}
        onPresslaunchGallery={onPresslaunchGallery}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: (width * 5) / 100,
    backgroundColor: '#F6F6F6',
    paddingTop: (height * 5) / 100,
    alignItems: 'center',
  },
  containerInputs: {
    flex: 1,
    width: (90 * width) / 100,
    marginTop: (5 * height) / 100,
  },
  input: {
    marginTop: (height * 2) / 100,
  },
  button: {
    marginVertical: (height * 3) / 100,
    borderRadius: resize(8),
  },
  titleButton: {
    //fontFamily: 'Montserrat-Bold',
  },
  containerImage: {
    backgroundColor: 'rgba(101,101,101,0.34)',
    flex: 1,
    borderRadius: resize(116),
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: resize(116),
    width: resize(116),
    borderRadius: resize(116),
  },
  textName: {
    fontSize: resize(22),
    color: 'black',
    marginTop: (height * 2) / 100,
    //fontFamily: 'Montserrat-Regular',
  },
  textCity: {
    fontSize: resize(16),
    color: 'black',
    //fontFamily: 'Montserrat-Regular',
  },
});

export default Edit;
