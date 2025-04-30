import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Platform,
  Alert,
  Image,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useSelector, useDispatch} from 'react-redux';
import {MaskService} from 'react-native-masked-text';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';

import {
  Picker,
  Input,
  TextArea,
  Button,
  ModalAddPhoto,
  ModalDeletePhoto,
} from '../../../components';
import {colors} from '../../../styles';
import {displayName} from '../../../../app.json';
import {setCity} from '../../../store/modules/ad/actions';
import {listYear} from '../../../utils/utils';
import api from '../../../services/api';

const {width, height} = Dimensions.get('window');

const Edit = ({navigation}) => {
  const dispatch = useDispatch();
  const [modalFoto, setModalFoto] = useState(false);
  const [modalExcluirFoto, setModalExcluirFoto] = useState(false);
  const [fotos, setFotos] = useState([{add: true}]);
  const [foto, setFoto] = useState(null);
  const [data, setData] = useState({
    year: listYear()[0],
  });
  const [estados, setEstados] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  const {city} = useSelector((store) => store.ad);
  const {user} = useSelector((store) => store.user);
  const listFotosRef = useRef();

  useEffect(() => {
    carregarListEstados();
    carregarListCategorias();
    carregarListMarcas();
  }, []);

  useEffect(() => {
    if (city) {
      if (data && data.state && data.state.id !== city.id_state) {
        dispatch(setCity(null));
      }
      if (!data.state) {
        dispatch(setCity(null));
      }
    }
  }, [data.state]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      backHandler.remove();
    });

    const backAction = () => {
      Alert.alert(
        displayName,
        'Tem certeza que deseja sair? Suas alterações não serão salvas.',
        [
          {
            text: 'Cancelar',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'Sim', onPress: () => navigation.goBack()},
        ],
      );
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, []);

  const carregarListCategorias = () => {
    api.get('equipment/category').then((resp) => {
      setCategorias(resp.data);
      
    });
  };

  const carregarListMarcas = () => {
    api.get('equipment/brand').then((resp) => {
      setMarcas(resp.data);
      
    });
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
          const listFotos = fotos.filter((item) => !item.add) || [];
          listFotos.push({...resp});
          if (listFotos.length < 5) {
            listFotos.push({add: true});
          }
          setFotos(listFotos.reverse());
          listFotosRef.current.scrollToIndex({
            index: 0,
            animated: true,
          });
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
        const listFotos = fotos.filter((item) => !item.add) || [];
        listFotos.push({...resp});
        if (listFotos.length < 5) {
          listFotos.push({add: true});
        }
        setFotos(listFotos.reverse());
        listFotosRef.current.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
      
    });
  };
  const onPressDeletarFoto = () => {
    let list = fotos.filter((item) => item !== foto);
    list = list.filter((item) => !item.add) || [];
    if (!list.includes({add: true})) {
      list.push({add: true});
    }
    setFotos(list.reverse());
    setModalExcluirFoto(false);
    listFotosRef.current.scrollToIndex({
      index: 0,
      animated: true,
    });
  };

  const maskMoney = (text) => {
    return MaskService.toMask('money', text, {
      precision: 2,
      separator: ',',
      delimiter: '.',
      unit: 'R$',
      suffixUnit: '',
    });
  };

  const validateForm = () => {
    if (fotos.length === 0) return false;
    if (!data.title || data.title.length === 0) return false;
    if (!data.description || data.description.length === 0) return false;
    if (!city) return false;
    if (!data.price || data.price.length === 0) return false;
    if (!data.year) return false;
    if (!data.brand) return false;
    if (!data.category) return false;
    if (!data.state) return false;
    return true;
  };
  const register = () => {
    const date = {
      id_user: user.id,
      id_category: data.category,
      id_brand: data.brand,
      year: data.year,
      id_state: data.state,
      id_city: city.id,
      title: data.title,
      description: data.description,
      price: MaskService.toRawValue('money', data.price, {
        precision: 2,
        separator: ',',
        delimiter: '.',
        unit: 'R$',
        suffixUnit: '',
      }),
      title: data.title,
    };
    console.log('date', date);
    setLoading(true);
    api
      .post('adv/add', date)
      .then((resp) => {
        
        uploadFotos(resp.data.id);
      })
      .catch((error) => {
        setLoading(false);
        console.log('error', error);
        Alert.alert(
          displayName,
          'Ocorreu um problema ao criar o anúncio tente mais tarde',
        );
      });
  };

  const uploadFotos = (idAd) => {
    const promises = [];
    fotos.forEach((foto) => {
      if (foto.uri) {
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
        console.log('data', data);
        promises.push(api.post('files', data, config));
      }
    });

    const promisesSalvarFotos = [];
    console.log('promises', promises);

    axios
      .all(promises)
      .then((results) => {
        results.forEach((resp) => {
          const {id} = resp.data;
          promisesSalvarFotos.push(
            api.post('adv/add/photo', {
              id_ad: idAd,
              id_photo: id,
            }),
          );
        });

        axios
          .all(promisesSalvarFotos)
          .then((results) => {
            console.log('idphotos', results);
            setLoading(false);
            Alert.alert(displayName, 'Anúncio cadastrado com sucesso');
            navigation.goBack();
          })
          .catch((error) => {
            setLoading(false);
            if (error.response) {
              Alert.alert(displayName, error.response.data.error);
            } else if (error.request) {
              Alert.alert(displayName, error.response.data);
            } else {
              Alert.alert(displayName, error.message.message);
            }
          });
      })
      .catch((error) => {
        console.log('error', error, error.response, error.message);
        setLoading(false);
        if (error.response) {
          Alert.alert(displayName, error.response.data.error);
        } else if (error.request) {
          Alert.alert(displayName, error.response.data);
        } else {
          Alert.alert(displayName, error.message.message);
        }
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <FlatList
          extraData={fotos}
          ref={listFotosRef}
          data={fotos}
          inverted
          renderItem={({item, index}) => {
            if (item.add) {
              return (
                <ItemAdd
                  index={fotos.length > 1 ? 1 : 0}
                  onPress={() => setModalFoto(true)}
                />
              );
            } else {
              return (
                <ItemImage
                  source={item.uri}
                  onPress={() => {
                    setFoto(item);
                    setModalExcluirFoto(true);
                  }}
                />
              );
            }
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.containerInputs}>
          <Input
            label="Título"
            value={data.title}
            onChangeText={(text) => setData({...data, title: text})}
          />
          <TextArea
            label="Descrição"
            value={data.description}
            changeText={(text) => setData({...data, description: text})}
          />
          <Picker
            label="Ano de Fabricação"
            value={data.year}
            changeValue={(e) => setData({...data, year: e})}
            items={listYear().map((item) => ({
              label: String(item),
              value: item,
            }))}
          />
          <Picker
            label="Marca"
            value={data.brand}
            changeValue={(e) => setData({...data, brand: e})}
            items={marcas.map((item) => ({
              label: item.description,
              value: item.id,
            }))}
          />
          <Picker
            label="Categoria"
            value={data.category}
            changeValue={(e) => setData({...data, category: e})}
            items={categorias.map((item) => ({
              label: item.description,
              value: item.id,
            }))}
          />

          <Input
            label="Preço"
            style={{marginTop: 10}}
            value={data.price}
            onChangeText={(text) => setData({...data, price: maskMoney(text)})}
            keyboardType="numeric"
          />
          <Picker
            label="Estado"
            value={data.state}
            changeValue={(e) => setData({...data, state: e})}
            items={estados.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
          <Input
            label="Cidade"
            style={{marginTop: 10}}
            disabled
            value={city && city.name}
            onPress={() => {
              if (data.state && estados.length > 0) {
                navigation.navigate('FilterCity', {
                  state: estados.find((item) => item.id === data.state),
                });
              } else {
                Alert.alert(displayName, 'Selecione um estado');
              }
            }}
          />

          <View style={styles.containerButtons}>
            <View style={styles.containerButton}>
              <Button
                title="Criar"
                style={styles.button}
                disabled={!validateForm()}
                loading={loading}
                onPress={register}
              />
            </View>
          </View>
        </View>
      </View>
      <ModalAddPhoto
        visible={modalFoto}
        setVisible={() => setModalFoto(false)}
        onPresslaunchCamera={onPresslaunchCamera}
        onPresslaunchGallery={onPresslaunchGallery}
      />
      <ModalDeletePhoto
        visible={modalExcluirFoto}
        setVisible={() => setModalExcluirFoto(false)}
        onPressDeletarFoto={onPressDeletarFoto}
      />
    </ScrollView>
  );
};

const ItemAdd = ({index, onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.containerCamera,
      index === 0 && {width: (width * 90) / 100},
    ]}>
    <Icon name="camera" size={(width * 15) / 100} color={colors.primary} />
    <Text style={styles.textTitleCamera}>Incluir fotos</Text>
    <Text style={{color: colors.textPrimary, fontSize: 12}}>
      JPG E PNG somente
    </Text>
  </TouchableOpacity>
);

const ItemImage = ({source, onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.containerCamera, {width: (width * 80) / 100}]}>
    <Image
      source={{uri: source}}
      style={{flex: 1, width: (width * 80) / 100, height: '100%'}}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: (height * 2) / 100,
  },
  containerInputs: {
    backgroundColor: 'white',
    paddingHorizontal: (width * 5) / 100,
    paddingTop: (height * 2) / 100,
  },
  textTitleCamera: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  containerButton: {
    flex: 1,
    marginHorizontal: (width * 2) / 100,
  },
  containerButtons: {
    flexDirection: 'row',
    marginBottom: (height * 5) / 100,
  },
  containerCamera: {
    height: (35 * height) / 100,
    borderWidth: 1,
    borderColor: colors.primary,
    marginHorizontal: (width * 5) / 100,
    marginBottom: (height * 3) / 100,
    paddingHorizontal: (5 * width) / 100,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  button: {
    marginTop: (height * 5) / 100,
  },

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

export default Edit;
