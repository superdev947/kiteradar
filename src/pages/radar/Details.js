import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useDispatch, useSelector} from 'react-redux';
import {MaskService} from 'react-native-masked-text';

import Icon from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';
import {Laoding, NotFound} from '../../components';
import {colors} from '../../styles';
import { setRadar } from '../../store/modules/radar/actions';

const {height, width} = Dimensions.get('window');

const radar = ({navigation, route}) => {
  const { user } = useSelector((store) => store.user);
  const [modalFoto, setModalFoto] = useState(false);
  const [radars, setRadars] = useState();
  const [favorite, setFavorite] = useState();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const {item} = route.params;
  useEffect(() => {
    if (!item) {
      Alert.alert(displayName, 'O radar não é valido');
      navigation.goBack();
    } else {
      api
        .get(`location/?id_local=${item.id_local}&id_user=${user.id}`)
        .then((resp) => {
          setRadars(resp.data);
          setLoading(false);
          dispatch(setRadar(resp.data));
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if(radars&&radars.id&&radars.name){
      loadFavorite();
    }
  },[radars]);

  useEffect(() => {
    navigation.setOptions({
      title: item.name,
      headerRight: () => (
        <IconMaterialIcons
          color="white"
          name={favorite ? 'star' : 'star-outline'}
          size={28}
          style={{marginHorizontal: (width * 5) / 100}}
          onPress={addFavorite}
        />
      ),
    });
  }, [favorite]);

  const loadFavorite = () => {
    api
      .get(`location/favorite/?id_local=${radars.id}&id_user=${user.id}`)
      .then((resp) => {
        if (resp.data&&resp.data.id) {
          setFavorite(resp.data);
        } else {
          setFavorite(null);
        }
      })
      .catch((error) => {
        setFavorite(null);
      });
  };

  const addFavorite = () => {
    if (favorite) {
      api.delete(`location/favorite/${favorite.id}`).then((resp) => {
        setFavorite(false);
      });
    } else if(radars&&radars.id) {
      api
        .post(`location/favorite/`, {
          id_local: radars.id,
          id_user: user.id,
        })
        .then((resp) => setFavorite(resp.data));
    }
  };

  const maskPhone = (text) => {
    return MaskService.toMask('cel-phone', text, {
      maskType: 'BRL',
      withDDD: true,
      dddMask: '(99) ',
    });
  };

  const getAdress = () => {
    let adress = '';
    if (radars.logradouro) adress += radars.logradouro;
    if (radars.neighborhood) adress += ` ${radars.neighborhood},`;
    if (radars.city) adress += ` ${radars.city.name},`;
    if (radars.state) adress += ` ${radars.state.name},`;
    if (radars.zip_code) adress += ` ${radars.zip_code}`;
    return adress;
  };

  return (
    <>
    {loading && <Laoding />}
    {!loading && !radars && (
      <NotFound title="Não foi possível obter as informações desse radars" />
    )}
    {!loading && radars && (
    <ScrollView style={styles.container}>
      <FlatList
        horizontal
        pagingEnabled
        data={radars.local_photos}
        renderItem={({item}) => (
          <TouchableWithoutFeedback onPress={() => setModalFoto(true)}>
            <Image source={{uri: item.photo.url}} style={styles.image} />
          </TouchableWithoutFeedback>
        )}
        keyExtractor={(item) => item.id}
      />
      <ItemInformation1 icon="map-pin" title={getAdress()} />
      {radars.phone && (
        <ItemInformation1 icon="phone" title={maskPhone(radars.phone || '')} />
      )}
      {radars.schedules&&radars.schedules[0]&& (
        <ItemInformation1 icon="clock" title={`Aberto agora: ${radars.schedules[0]?.open_time} - ${radars.schedules[0]?.close_time}` } />
      )}
      {radars.informations.length > 0 && (
        <>
          <Text style={styles.textTitle2}>Informações de Estrutura</Text>
          <ItemInformation2
            title="Coberto"
            status={radars.informations[0].covered}
          />
          <ItemInformation2
            title="Restaurante"
            status={radars.informations[0].restaurant}
          />
          <ItemInformation2
            title="Gramado"
            status={radars.informations[0].lawn}
          />
          <ItemInformation2
            title="Banheiros"
            status={radars.informations[0].bathrooms}
          />
          <ItemInformation2
            title="Estacionamento"
            status={radars.informations[0].parking}
          />
          <ItemInformation2
            title="PlayGround"
            status={radars.informations[0].playground}
          />
          <ItemInformation2
            title="Piscina"
            status={radars.informations[0].pool}
          />
          <Text style={styles.textTitle2}>Serviços</Text>
          <ItemInformation2
            title="Compressor"
            status={radars.informations[0].compressor}
          />
          <ItemInformation2
            title="Guardeira"
            status={radars.informations[0].guardeira}
          />
          <ItemInformation2 title="Loja" status={radars.informations[0].store} />
          <ItemInformation2
            title="Pousada"
            status={radars.informations[0].inn}
          />
          <ItemInformation2
            title="Reparos"
            status={radars.informations[0].repairs}
          />
          <ItemInformation2
            title="Aulas"
            status={radars.informations[0].classes}
          />
          <ItemInformation2
            title="Aluguel"
            status={radars.informations[0].rent}
          />
        </>
      )}
      <Modal visible={modalFoto} transparent={true}>
        <ImageViewer
          onCancel={() => setModalFoto(false)}
          onShowModal={() => setModalFoto(false)}
          loadingRender={() => <Laoding />}
          enablePreload
          renderHeader={() => (
            <Icon
              onPress={() => setModalFoto(false)}
              name="x"
              size={35}
              color="white"
              style={{marginTop: 10, marginLeft: 10}}
            />
          )}
          useNativeDriver={true}
          imageUrls={radars.local_photos.map((item) => ({url: item.photo.url}))}
        />
      </Modal>
    </ScrollView>
    )}
    </>
  );
};

const ItemInformation1 = ({title, icon}) => (
  <View style={styles.containerItem1}>
    <Icon name={icon} color={colors.primary} size={25} />
    <Text style={styles.textTitleItem1}>{title}</Text>
  </View>
);

const ItemInformation2 = ({title, status}) => (
  <View style={[styles.containerItem2,status?{}:{backgroundColor:'rgba(255, 0, 0, 0.1)'}]}>
    <Text style={styles.textTitleItem2}>{title}</Text>
    <AntDesign name={`${status?'check':'close'}circle`} size={25} color={status ? '#27AE60' : '#DB3838'} />
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: (35 * height) / 100,
    width: width,
  },
  containerItem2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: (width * 5) / 100,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    paddingVertical: (height * 1) / 100,
    alignItems: 'center',
    paddingHorizontal:10
  },
  textTitleItem2: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  textStatus: {
    borderRadius: 4,
    paddingHorizontal: (width * 2) / 100,
    fontSize: 12,
    color: 'white',
    paddingVertical: 1,
  },
  textTitle2: {
    color: colors.primary,
    fontSize: 18,
    marginHorizontal: (width * 5) / 100,
    marginTop: (height * 3) / 100,
    marginBottom: (height * 1) / 100,
  },
  containerItem1: {
    flexDirection: 'row',
    marginHorizontal: (width * 5) / 100,
    alignItems: 'center',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    paddingVertical: (height * 2) / 100,
  },
  textTitleItem1: {
    fontSize: 14,
    color: colors.textPrimary,
    maxWidth: (width * 82.5) / 100,
    marginLeft: (width * 2) / 100,
  },
});

export default radar;
