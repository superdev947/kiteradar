import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {format} from 'date-fns';
import {useSelector, useDispatch} from 'react-redux';

import {Button, Input, TextArea, Picker} from '../../components';
import {colors} from '../../styles';
import {displayName} from '../../../app.json';

import api from '../../services/api';
import {setCity} from '../../store/modules/ad/actions';

const {width, height} = Dimensions.get('window');

const equipment = ({route, navigation}) => {
  const {item} = route.params;
  const dispatch = useDispatch();
  const {city} = useSelector((store) => store.ad);

  const [data, setData] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(true);
  const [estados, setEstados] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [state, setState] = useState();
  const [category, setCategory] = useState();

  useEffect(() => {
    carregarListEstados();
    carregarListCategorias();
  }, []);

  useEffect(() => {
    if (city) {
      if (state && state.id !== city.id_state) {
        dispatch(setCity(null));
      }
    }
  }, [state]);

  const validateForm = () => {
    if (!data.description || data.description.length === 0) return false;
    if (!data.date || data.date.length === 0) return false;
    if (!state) return false;
    if (!city) return false;
    if (!category) return false;
    return true;
  };

  const carregarListEstados = () => {
    api.get('state').then((resp) => {
      setEstados(resp.data);
      
    });
  };

  const carregarListCategorias = () => {
    api.get('equipment/event').then((resp) => {
      setCategorias(resp.data);
      
    });
  };

  const register = () => {
    setLoading(true);
    const date = {
      id_owner: item.id_current_owner,
      id_equipment: item.id,
      description: data.description,
      title: item.name,
      occurrence_date: data.date,
      id_state: state,
      id_city: city.id,
      id_event: category,
    };
    api
      .post('equipment/occurrence', date)
      .then((resp) => {
        setLoading(false);
        Alert.alert(displayName, 'Ocorrência cadastrada com sucesso');
        navigation.goBack();
      })
      .catch((error) => {
        setLoading(false);
        console.log('error', error);
        Alert.alert(
          displayName,
          'Ocorreu um problema ao cadastar sua ocorrência. Tente mais tarde',
        );
      });
  };

  return (
    <ScrollView style={styles.container}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        data={item.EquipmentPhotos}
        renderItem={({item}) => (
          <Image source={{uri: item.photo.url}} style={styles.image} />
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.containerContent}>
        <Text style={styles.title}>{item.name}</Text>
        {/* <Picker label="Tipo de ocorrência" /> */}
        <TextArea
          label="Descrição da ocorrência"
          value={data.description}
          changeText={(text) => setData({...data, description: text})}
        />

        <Input
          label="Data da ocorrência"
          style={styles.input}
          disabled
          disabled
          value={
            data.date
              ? format(new Date(data.date), "dd/MM/yyyy 'às' HH:mm")
              : ''
          }
          onPress={() => setDatePickerVisibility(true)}
        />

        <Picker
          label="Tipo"
          value={category}
          changeValue={(e) => setCategory(e)}
          items={categorias.map((item) => ({
            label: item.description,
            value: item.id,
          }))}
        />

        <Picker
          label="Estado"
          value={state}
          changeValue={(e) => setState(e)}
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
            if (state && estados.length > 0) {
              navigation.navigate('FilterCity', {
                state: estados.find((item) => item.id === state),
              });
            } else {
              Alert.alert(displayName, 'Selecione um estado');
            }
          }}
        />

        <Text style={styles.textTitleCategory}>Características</Text>
        {item.brand && (
          <ItemInformation title="Marca" description={item.brand.description} />
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
        <Button
          title="Criar Ocorrência"
          style={styles.button}
          disabled={!validateForm()}
          onPress={register}
        />
      </View>
      <DateTimePickerModal
        maximumDate={new Date()}
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={(date) => {
          setDatePickerVisibility(false);
          setData({...data, date: date});
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </ScrollView>
  );
};

const ItemInformation = ({title, description}) => (
  <View style={styles.containerRowInformation}>
    <View style={styles.item}>
      <Text style={styles.textInformation}>{title}:</Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.textInformation}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContent: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: (width * 5) / 100,
    paddingVertical: (height * 2) / 100,
  },
  image: {
    height: (height * 35) / 100,
    width: width,
  },
  containerRowInformation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
  },
  textInformation: {
    marginRight: (width * 2) / 100,
    color: colors.textPrimary,
    fontSize: 13,
    marginTop: (height * 1) / 100,
  },
  textTitleCategory: {
    color: colors.primary,
    fontSize: 13,
    marginBottom: (height * 1) / 100,
    marginTop: (height * 2) / 100,
  },
  input: {
    marginTop: 10,
  },
  button: {
    marginTop: (height * 5) / 100,
  },
  title: {
    fontSize: 22,
  },
});

export default equipment;
