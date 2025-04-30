import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  Dimensions,
  PermissionsAndroid,
  Platform,
  FlatList,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {format} from 'date-fns';
import {useSelector} from 'react-redux';
import axios from 'axios';

import {
  Picker,
  Input,
  TextArea,
  Button,
  ModalAddPhoto,
  ModalDeletePhoto,
  Footer,
} from '../../components';
import {colors} from '../../styles';
import {listYear} from '../../utils/utils';
import {resize} from '../../utils/font';

import api from '../../services/api';

import {displayName} from '../../../app.json';

const {width, height} = Dimensions.get('window');

const Register = ({navigation, route}) => {
  const {item} = route.params;
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [data, setData] = useState({});
  const [fotos, setFotos] = useState([{add: true}]);
  const [foto, setFoto] = useState(null);
  const [modalFoto, setModalFoto] = useState(false);
  const [modalExcluirFoto, setModalExcluirFoto] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const {user} = useSelector((store) => store.user);

  const listFotosRef = useRef();

  useEffect(() => {
    carregarListCategorias();
    carregarListMarcas();
    carregarDados();
  }, []);

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

  const carregarDados = () => {
    setFotos([{add: true}, ...item.EquipmentPhotos]);
    setData({
      ...data,
      name: item.name,
      description: item.description,
      category: item.category ? item.category.id : null,
      purchase_date: item.purchase_date,
      year: item.year,
      brand: item.brand ? item.brand.id : null,
      model: item.model,
      serial_number: item.serial_number,
      type: item.type,
    });
  };

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

  const validateForm = () => {
    if (fotos.length === 0) return false;
    if (!data.name || data.name.length === 0) return false;
    if (!data.description || data.description.length === 0) return false;
    if (!data.year) return false;
    if (!data.brand) return false;
    if (!data.category) return false;
    if (!data.purchase_date || data.purchase_date.length === 0) return false;
    if (!data.model || data.model.length === 0) return false;
    if (!data.serial_number || data.serial_number.length === 0) return false;
    if (!data.type || data.type.length === 0) return false;
    return true;
  };

  const save = () => {
    const date = {
      id_category: data.category,
      id_brand: data.brand,
      year: data.year,
      description: data.description,
      serial_number: data.serial_number,
      model: data.model,
      type: data.type,
      name: data.name,
      purchase_date: data.purchase_date,
    };
    setLoading(true);
    api
      .put(`equipment/update/${item.id}`, date)
      .then((resp) => {
        
        deletePhotos();
        uploadFotos(resp.data.id);
      })
      .catch((error) => {
        setLoading(false);
        console.log('error', error);
        Alert.alert(
          displayName,
          'Ocorreu um problema ao editar o equipamento tente mais tarde',
        );
      });
  };

  const uploadFotos = (idEquipment) => {
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
            api.post('equipment/add/photo', {
              id_equipment: idEquipment,
              id_photo: id,
            }),
          );
        });

        axios
          .all(promisesSalvarFotos)
          .then((results) => {
            console.log('idphotos', results);
            setLoading(false);
            Alert.alert(displayName, 'Equipamento editado com sucesso');
            navigation.popToTop();
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

  const deletePhotos = () => {
    const listFotosDeletadas = [];
    const listaFotos = fotos.filter((item) => item.createdAt);
    item.EquipmentPhotos.forEach((item) => {
      if (!listaFotos.includes(item)) {
        listFotosDeletadas.push(api.delete(`equipment/photo/${item.id}`));
      }
    });
    axios.all(listFotosDeletadas).then((results) => {
      console.log('fotosdeletadas', results);
      setLoading(false);
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.containerPhotos}>
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
        </View>

        <View style={styles.containerInputs}>
          <Picker
            placeholder="Ano de Fabricação"
            value={data.year}
            changeValue={(e) => setData({...data, year: e})}
            items={listYear().map((item) => ({
              label: String(item),
              value: item,
            }))}
          />
          <Picker
            placeholder="Categoria"
            value={data.category}
            changeValue={(e) => setData({...data, category: e})}
            items={categorias.map((item) => ({
              label: item.description,
              value: item.id,
            }))}
          />
          <Picker
            placeholder="Fabricante"
            value={data.brand}
            changeValue={(e) => setData({...data, brand: e})}
            items={marcas.map((item) => ({
              label: item.description,
              value: item.id,
            }))}
          />

          <Input
            autoCapitalize="sentences"
            placeholder="Nome"
            style={{marginTop: 10}}
            value={data.name}
            onChangeText={(text) => setData({...data, name: text})}
          />

          <Input
            placeholder="Data da compra"
            style={{marginTop: 10}}
            disabled
            value={
              data.purchase_date
                ? format(new Date(data.purchase_date), 'dd/MM/yyyy')
                : ''
            }
            onPress={() => setDatePickerVisibility(true)}
          />

          <Input
            placeholder="Modelo"
            style={{marginTop: 10}}
            value={data.model}
            onChangeText={(text) => setData({...data, model: text})}
          />
          <Input
            placeholder="Número de série"
            style={{marginTop: 10}}
            value={data.serial_number}
            autoCapitalize="characters"
            onChangeText={(text) => setData({...data, serial_number: text})}
          />

          <Picker
            placeholder="Tipo"
            value={data.type}
            changeValue={(e) => setData({...data, type: e})}
            items={[
              {
                value: 'Novo',
                label: 'Novo',
              },
              {
                value: 'Usado',
                label: 'Usado',
              },
            ]}
          />

          <TextArea
            placeholder="Descrição"
            value={data.description}
            changeText={(text) => setData({...data, description: text})}
          />
          <Button
            title="Salvar"
            style={styles.button}
            disabled={!validateForm()}
            loading={loading}
            onPress={save}
          />
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
      <DateTimePickerModal
        maximumDate={new Date()}
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setDatePickerVisibility(false);
          setData({...data, purchase_date: date});
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
      <Footer />
    </ScrollView>
  );
};

const ItemAdd = ({index, onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.containerCamera,
      {
        borderWidth: 1,
        borderColor: colors.black,
        borderStyle: 'dashed',
        marginRight: (width * 4) / 100,
        marginLeft: 0,
      },
      index === 0 && {width: (width * 85) / 100},
    ]}>
    <Icon name="camera" size={(width * 15) / 100} color={colors.black} />
    <Text style={styles.textTitleCamera}>Incluir fotos</Text>
    <Text style={styles.textTitleCamera}>JPG E PNG somente</Text>
  </TouchableOpacity>
);

const ItemImage = ({source, onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.containerCamera, {width: (width * 85) / 100}]}>
    <Image
      source={{uri: source}}
      style={{
        flex: 1,
        width: (width * 82) / 100,
        height: '100%',
        borderRadius: 5,
      }}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: (height * 2) / 100,
    paddingBottom: (height * 5) / 100,
    paddingHorizontal: (3 * width) / 100,
    backgroundColor: '#F6F6F6',
  },

  containerPhotos: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  containerInputs: {
    marginTop: (height * 2) / 100,
  },
  textTitleCamera: {
    fontSize: resize(14),
    color: colors.black,
    textAlign: 'center',
    //fontFamily: 'Montserrat-Light',
  },
  containerCamera: {
    height: (35 * height) / 100,
    marginHorizontal: (width * 4) / 100,
    marginVertical: (height * 1) / 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 3,
    backgroundColor: 'white',
    padding: 5,
  },
  button: {
    marginTop: (height * 5) / 100,
  },
});

export default Register;
