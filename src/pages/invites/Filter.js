import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {NewPicker as Picker, Button, NewInput as Input} from '../../components';
import {colors} from '../../styles';
import {listYear} from '../../utils/utils';
import api from '../../services/api';
import {
  setBrandList,
  setCategoryList,
  setStateList,
  setFilterAd,
} from '../../store/modules/ad/actions';

const {width, height} = Dimensions.get('window');

const defaultValues = {
  id_brand: -1,
  id_state: -1,
  year: -1,
  id_category: -1,
  search: '',
};

const Filter = ({navigation}) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(defaultValues);
  const {filter: data, state, brand, category} = useSelector(
    (store) => store.ad,
  );

  useEffect(() => {
    carregarListCategorias();
    carregarListMarcas();
    carregarListEstados();
  }, []);

  useEffect(() => {
    if (data) {
      setFilter({...data});
    }
  }, [data]);

  const carregarListCategorias = () => {
    api.get('equipment/category').then((resp) => {
      dispatch(
        // setCategoryList([{description: 'Selecionar', id: -1}, ...resp.data]),
        setCategoryList(resp.data),
      );
      
    });
  };

  const carregarListMarcas = () => {
    api.get('equipment/brand').then((resp) => {
      dispatch(setBrandList(resp.data));
      
    });
  };

  const carregarListEstados = () => {
    api.get('state').then((resp) => {
      dispatch(setStateList(resp.data));
      
    });
  };

  const filtrar = () => {
    dispatch(setFilterAd({...filter}));
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        enabled={true}
        behavior="position"
        contentContainerStyle={{flexGrow: 1}}>
        <Picker
          placeholder="Estado"
          value={filter.id_state}
          changeValue={(e) => setFilter({...filter, id_state: e})}
          items={state.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
        />
        <Picker
          placeholder="Ano"
          value={filter.year}
          changeValue={(e) => setFilter({...filter, year: e})}
          items={listYear().map((item) => ({
            label: String(item),
            value: typeof item === 'string' ? -1 : item,
          }))}
        />
        <Picker
          placeholder="Fabricante"
          value={filter.id_brand}
          changeValue={(e) => setFilter({...filter, id_brand: e})}
          items={brand.map((item) => ({
            label: item.description,
            value: item.id,
          }))}
        />
        <Picker
          placeholder="Categorias"
          value={filter.id_category}
          changeValue={(e) => setFilter({...filter, id_category: e})}
          items={category.map((item) => ({
            label: item.description,
            value: item.id,
          }))}
        />
        <Input
          placeholder="Palavra chave"
          style={{marginTop: 10}}
          value={filter.search}
          onChangeText={(e) => setFilter({...filter, search: e})}
        />
        <Button
          title="Limpar filtro"
          icon="trash-2"
          style={{backgroundColor: colors.delete, marginTop: 20}}
          onPress={() => dispatch(setFilterAd(defaultValues))}
        />
        <View style={{height: 15}} />
        <Button title="Filtrar" onPress={filtrar} />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: (width * 5) / 100,
    paddingVertical: (height * 2) / 100,
    flexGrow: 1,
  },
});

export default Filter;
