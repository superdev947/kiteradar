import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {colors} from '../../styles';
import ImageViewer from 'react-native-image-zoom-viewer';

import {Laoding} from '../../components';
import {displayName} from '../../../app.json';

import api from '../../services/api';
import {resize} from '../../utils/font';

const {height, width} = Dimensions.get('window');

const Details = ({navigation, route}) => {
  const {item} = route.params;
  const [modalFoto, setModalFoto] = useState(false);

  console.log('item', item);

  const deletarEquipamento = () => {
    Alert.alert(
      displayName,
      'Deseja realmente excluir esse equipamento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {
            api
              .delete('equipment/' + item.id)
              .then((resp) => {
                navigation.goBack();
                Alert.alert(displayName, 'Equipamento deletado com sucesso');
              })
              .catch((error) => {
                console.log('error', error);
                Alert.alert(
                  displayName,
                  'Ocorreu um problema ao excluir esse equipamento. Tente mais tarde',
                );
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <FlatList
          horizontal
          pagingEnabled
          data={item.EquipmentPhotos}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => setModalFoto(true)}>
              <Image source={{uri: item.photo.url}} style={styles.image} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />

        <View style={styles.containerContent}>
          <Text style={styles.title}>{item.name}</Text>

          <Text style={styles.textTitleCategory}>Características</Text>
          {item.brand && (
            <ItemInformation
              title="Marca"
              description={item.brand.description}
            />
          )}
          <ItemInformation title="Ano" description={item.year} />
          <ItemInformation title="Modelo" description={item.model} />
          <ItemInformation
            title="Número de série"
            description={item.serial_number}
          />
          <ItemInformation title="Tipo" description={item.type} />
          {item.previous_owner && (
            <ItemInformation
              title="Proprietário anterior"
              description={item.previous_owner.name}
            />
          )}

          <Text style={styles.textTitleCategory}>Observações</Text>
          <Text style={styles.textDescription}>{item.description}</Text>
        </View>
      </ScrollView>
      <View style={styles.containerFooter}>
        <Icon
          name="repeat"
          size={25}
          color="white"
          onPress={() => {
            navigation.navigate('EquipmentTransfer', {item});
          }}
        />
        <Icon
          name="alert-octagon"
          size={25}
          color="white"
          onPress={() => navigation.navigate('CreateOccurrence', {item})}
        />
        <Icon
          name="trash-2"
          size={25}
          color="white"
          onPress={deletarEquipamento}
        />
      </View>

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
          imageUrls={item.EquipmentPhotos.map((item) => ({
            url: item.photo.url,
          }))}
        />
      </Modal>
    </View>
  );
};

const ItemInformation = ({title, description}) => (
  <View style={styles.containerRowInformation}>
    <Text style={styles.textInformationTitle}>{title}:</Text>
    <Text style={styles.textInformation}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContent: {
    paddingHorizontal: (width * 5) / 100,
    paddingTop: (height * 2) / 100,
    flex: 1,
    paddingBottom: (height * 10) / 100,
  },
  containerFooter: {
    backgroundColor: colors.primary,
    height: (height * 7) / 100,
    position: 'absolute',
    bottom: 0,
    right: 10,
    left: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 5,
  },
  title: {
    fontSize: resize(20),
    //fontFamily: 'Montserrat-Bold',
    color: colors.textPrimary,
  },
  textInformationTitle: {
    marginRight: (width * 2) / 100,
    color: colors.textPrimary,
    fontSize: resize(14),
    marginTop: (height * 0.5) / 100,
    //fontFamily: 'Montserrat-SemiBold',
  },
  textInformation: {
    marginRight: (width * 2) / 100,
    color: colors.textPrimary,
    fontSize: resize(14),
    marginTop: (height * 0.5) / 100,
    //fontFamily: 'Montserrat-Regular',
  },
  containerRowInformation: {
    flexDirection: 'row',
  },
  textTitleCategory: {
    color: colors.primary,
    fontSize: resize(14),
    //fontFamily: 'Montserrat-Bold',
    marginBottom: (height * 0.5) / 100,
    marginTop: (height * 3) / 100,
  },
  textDescription: {
    color: colors.textPrimary,
    fontSize: resize(14),
    //fontFamily: 'Montserrat-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    marginVertical: (3 * height) / 100,
  },
  image: {
    height: (height * 35) / 100,
    width: width,
  },
});

export default Details;
