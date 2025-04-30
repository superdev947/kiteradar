import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Modal,
  Linking,
  Share,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {MaskService} from 'react-native-masked-text';
import {parseISO, format} from 'date-fns';
import ImageViewer from 'react-native-image-zoom-viewer';

import {displayName} from '../../../app.json';

import {colors} from '../../styles';
import {hexToRGB} from '../../utils/colors';

import {Laoding} from '../../components';
import api from '../../services/api';

const {width, height} = Dimensions.get('window');

const Details = ({navigation, route}) => {
  const {item: ad, edit} = route.params;
  const [modalFoto, setModalFoto] = useState(false);
  const [loadingBt, setLoadingBt] = useState(false);
  const [item, setItem] = useState(ad);

  console.log('item', item);

  useEffect(() => {
    if (edit) {
      navigation.setOptions({
        title: 'Meu Anúncio',
      });
    }
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="share-social-outline"
          size={30}
          color="white"
          style={{marginRight: 10}}
          onPress={async () => {
            const result = await Share.share({
              message:
                item.title +
                '\n\n' +
                item.description +
                '\n\nhttp://kiteradar.com.br/produto/' +
                item.id,
            });
          }}
        />
      ),
    });
  }, []);

  const maskMoney = (text) => {
    return MaskService.toMask('money', text, {
      precision: 2,
      separator: ',',
      delimiter: '.',
      unit: 'R$ ',
      suffixUnit: '',
    });
  };

  const encerrarAnuncio = (status = 1) => {
    setLoadingBt(true);
    api
      .put(`adv/update/${item.id}`, {status})
      .then((resp) => {
        setItem({...item, status});
        setLoadingBt(false);
      })
      .catch((error) => {
        setLoadingBt(false);
        console.log('error', error);
        Alert.alert(
          displayName,
          'Não foi possível alterar esse anúncio. Tente mais tarde',
        );
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <FlatList
          horizontal
          pagingEnabled
          data={item.AdPhotos}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => setModalFoto(true)}>
              <Image source={{uri: item.photo.url}} style={styles.image} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.containerContent}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.value}>{maskMoney(item.price)}</Text>
          <Text style={styles.date}>
            Publicado em {format(parseISO(item.createdAt), 'dd/MM', new Date())}{' '}
            às {format(parseISO(item.createdAt), 'HH:mm', new Date())}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.textTitleCategory}>Descrição</Text>
          <Text style={styles.textDescription}>{item.description}</Text>
          {/* <TouchableOpacity>
            <Text style={styles.textDescriptionComplete}>
              Ver descrição completa
            </Text>
          </TouchableOpacity> */}
          <View style={styles.divider} />
          <Text style={styles.textTitleCategory}>Características</Text>
          <ItemDescrption title="Marca:" information={item.brand.description} />
          <ItemDescrption title="Ano:" information={item.year} />
          <ItemDescrption
            title="Categoria:"
            information={item.category.description}
          />
          <View style={styles.divider} />
          <Text style={styles.textTitleCategory}>Localização</Text>
          <ItemDescrption title="Estado:" information={item.state.name} />
          <ItemDescrption title="Cidade:" information={item.city.name} />
        </View>
      </ScrollView>
      {edit ? (
        <TouchableOpacity
          style={[
            styles.containerFinishedAds,
            loadingBt && {backgroundColor: hexToRGB('#27AE60', 0.3)},
          ]}
          disabled={loadingBt}
          onPress={() => encerrarAnuncio(item.status === 0 ? 1 : 0)}>
          {loadingBt ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.textButtonFinishedAds}>
              {item.status === 0 ? 'Encerrar anúncio' : 'Ativar anúncio'}
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.containerWhatsapp}>
          <Icon
            name="logo-whatsapp"
            size={35}
            color="white"
            onPress={() => {
              Linking.openURL(
                'http://api.whatsapp.com/send?phone=55' + item.user.whats,
              );
            }}
          />
        </TouchableOpacity>
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
              name="close"
              size={35}
              color="white"
              style={{marginTop: 10, marginLeft: 10}}
            />
          )}
          useNativeDriver={true}
          imageUrls={item.AdPhotos.map((item) => ({url: item.photo.url}))}
        />
      </Modal>
    </View>
  );
};

const ItemDescrption = ({title, information}) => (
  <View style={styles.containerItemDescription}>
    <View style={{flex: 1}}>
      <Text style={styles.textItemDescription}>{title}</Text>
    </View>
    <View style={{flex: 1}}>
      <Text style={styles.textItemDescription}>{information}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  containerContent: {
    flex: 1,
    paddingHorizontal: (5 * width) / 100,
    paddingTop: (2 * height) / 100,
    paddingBottom: (12 * height) / 100,
  },
  image: {
    height: (35 * height) / 100,
    width: width,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ABABAB',
    opacity: 0.3,
    marginTop: (height * 1) / 100,
    marginBottom: (height * 3) / 100,
  },
  title: {
    fontSize: 24,
  },
  value: {
    fontSize: 24,
    marginTop: (height * 1) / 100,
  },
  date: {
    fontSize: 14,
    marginTop: (height * 3) / 100,
    color: colors.textPrimary,
  },
  textTitleCategory: {
    color: colors.primary,
    fontSize: 14,
    marginBottom: (height * 1) / 100,
  },
  textDescriptionComplete: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  textDescription: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  containerItemDescription: {
    flexDirection: 'row',
    marginTop: 5,
  },
  textItemDescription: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  containerWhatsapp: {
    position: 'absolute',
    left: width / 2 - (width * 13) / 100 / 2,
    bottom: 10,
    padding: 10,
    height: (width * 14) / 100,
    width: (width * 15) / 100,
    backgroundColor: '#27AE60',
    borderRadius: (width * 13) / 100 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerFinishedAds: {
    position: 'absolute',
    left: (width * 10) / 100,
    bottom: 10,
    padding: 10,
    height: (width * 13) / 100,
    width: (width * 80) / 100,
    backgroundColor: '#27AE60',
    borderRadius: (width * 5) / 100 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonFinishedAds: {
    color: 'white',
    fontSize: 16,
  },
});

export default Details;
