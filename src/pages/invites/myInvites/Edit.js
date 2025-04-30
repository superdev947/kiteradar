import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {MaskService} from 'react-native-masked-text';
import {useSelector} from 'react-redux';
import {displayName} from '../../../../app.json';

import {
  NewInput as Input,
  NewPicker as Picker,
  TextArea,
  SliderRange,
  Button,
  Footer,
} from '../../../components';

import api from '../../../services/api';
import {listYear} from '../../../utils/utils';
import {resize} from '../../../utils/font';
import {colors} from '../../../styles';

const {width, height} = Dimensions.get('window');

const myInvites = ({navigation, route}) => {
  const {item} = route.params;

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [ano, setAno] = useState();
  const [modelo, setModelo] = useState(-1);
  const [categoria, setCategoria] = useState();
  const [marca, setMarca] = useState();
  const [max, setMax] = useState(30000);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  const {user} = useSelector((store) => store.user);

  useEffect(() => {
    carregarListCategorias();
    carregarListMarcas();
    carregarDados();
  }, []);

  const handleValueChange = useCallback((value) => {
    setMax(value);
  }, []);

  const carregarDados = () => {
    console.log('item', item);
    if (item) {
      if (item.description !== descricao) {
        setDescricao(item.description);
      }
      if (item.title !== titulo) {
        setTitulo(item.title);
      }
      if (item.id_category !== categoria) {
        setCategoria(item.id_category);
      }
      if (item.year !== ano) {
        setAno(item.year);
      }
      if (item.id_brand !== marca) {
        setMarca(item.id_brand);
        carregarListModelos(item.id_brand);
      }
      if (item.max_price !== max) {
        setMax(item.max_price);
      }
      if (item.id_model !== modelo) {
        setModelo(item.id_model);
      }
    }
  };

  const carregarListCategorias = () => {
    api.get('equipment/category').then((resp) => {
      setCategorias(resp.data);
      
    });
  };

  const carregarListMarcas = () => {
    api.get('equipment/brand').then((resp) => {
      const list = resp.data;
      // if (list.length > 0) {
      //   carregarListModelos(list[0].id);
      // }
      setMarcas(list);
      console.log('resp', list);
    });
  };

  const carregarListModelos = (id) => {
    console.log('fluxo', 3, modelo, id === item.id_brand, id, item.id_brand);

    if (id === item.id_brand && modelo !== -1) {
      setModelo(item.id_model);
      console.log('fluxo', 4, modelo);
    }
    api.get('equipment/model/' + id).then((resp) => {
      setModelos(resp.data);
      
      console.log('fluxo', 5, modelo);

      if (id === item.id_brand && modelo !== -1) {
        setModelo(item.id_model);
        console.log('fluxo', 6, modelo);
      }
    });
  };

  const maskMoney = (value) => {
    return MaskService.toMask('money', value, {
      unit: 'R$',
      separator: ',',
      delimiter: '.',
      precision: 0,
    });
  };

  const save = () => {
    const data = {
      ...item,
      id_user: user.id,
      id_category: categoria,
      id_brand: marca,
      id_model: modelo,
      year: ano,
      title: titulo,
      description: descricao,
      max_price: max,
      other_brand: '',
      other_model: '',
    };
    setLoading(true);

    api
      .put('invites/' + item.id, data)
      .then((resp) => {
        setLoading(false);
        Alert.alert(displayName, 'Invite editado com sucesso');
        navigation.goBack();
      })
      .catch((err) => {
        console.log('rte', err);
        setLoading(false);
        Alert.alert(
          displayName,
          'Ocorreu um problema ao editar o invite tente mais tarde',
        );
      });
  };

  const validateForm = () => {
    if (!categoria) return true;
    if (!marca) return true;
    if (!modelo) return true;
    if (!ano) return true;
    if (titulo === '') return true;
    if (descricao === '') return true;
    return false;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          enabled
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.containerInputs}>
            <Input
              placeholder="O que você deseja comprar?"
              value={titulo}
              onChangeText={(text) => setTitulo(text)}
            />

            <Picker
              placeholder="Categoria*"
              value={categoria}
              changeValue={(e) => setCategoria(e)}
              items={categorias.map((item) => ({
                label: item.description,
                value: item.id,
              }))}
            />

            <Picker
              placeholder="Ano de Fabricação"
              value={ano}
              changeValue={(e) => setAno(e)}
              items={listYear().map((item) => ({
                label: String(item),
                value: typeof item === 'string' ? -1 : item,
              }))}
            />

            <Picker
              placeholder="Marca"
              value={marca}
              changeValue={(e) => {
                setModelos([]);
                setMarca(e);
                if (e) {
                  setModelos([]);
                  carregarListModelos(e);
                  console.log('fluxo', 1);
                } else {
                  setModelos([]);
                  setModelo(-1);
                  console.log('fluxo', 2);
                }
              }}
              items={marcas.map((item) => ({
                label: item.description,
                value: item.id,
              }))}
            />

            <Picker
              key={marca}
              placeholder="Modelo"
              value={modelo}
              changeValue={(e) => setModelo(e)}
              items={modelos.map((item) => ({
                label: item.description,
                value: item.id,
              }))}
            />

            <View style={styles.containerSlider}>
              <Text style={styles.textMax}>Orçamento Máximo:</Text>
              <Text style={styles.textMoney}>{maskMoney(max)}</Text>
              <SliderRange
                min={100}
                max={30000}
                step={1}
                value={max}
                onValueChanged={handleValueChange}
              />
            </View>

            <TextArea
              placeholder="Descrição: Ex(Preciso de uma prancha seminova em perfeito estado)"
              value={descricao}
              changeText={(text) => setDescricao(text)}
            />
          </View>
          <View style={styles.containerButtons}>
            <Button
              title="Descartar"
              type="danger"
              style={styles.button}
              onPress={() => navigation.goBack()}
            />
            <Button
              title="Salvar"
              style={styles.button}
              disabled={validateForm()}
              onPress={save}
              loading={loading}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <Footer />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#E5E5E5',
  },

  containerInputs: {
    margin: (width * 2) / 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  containerSlider: {
    marginVertical: 10,
    marginTop: 20,
  },
  containerMaxMin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  textMax: {
    fontSize: resize(16),
    //fontFamily: 'Montserrat-Light',
    marginVertical: 15,
    color: colors.textPrimary,
    marginLeft: (width * 5) / 100,
  },
  textMoney: {
    textAlign: 'center',
    color: 'black',
    fontSize: resize(18),
    //fontFamily: 'Montserrat-Light',
  },
  containerButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default myInvites;
