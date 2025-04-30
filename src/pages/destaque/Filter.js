import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {Picker, Button, Input} from '../../components';
import {colors} from '../../styles';
import {
  setFilterSpotlights,
  setSpotlightsStateList,
  setSpotlightsCityList,
} from '../../store/modules/spotlights/actions';
import api from '../../services/api';
const {width, height} = Dimensions.get('window');

const defaultValues = {
  id_state: -1,
  id_city: -1,
  search: '',
};

const Filter = ({navigation}) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(defaultValues);
  const {filter: data, state, city} = useSelector(
    (store) => store.spotlights,
  );

  useEffect(() => {
    loadState()
    loadCity()
  }, []);

  const loadState = () => {
    api
      .get('address/state')
      .then((resp) => {
        dispatch(setSpotlightsStateList(resp.data))
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const loadCity = () => {
    api
      .get('address/city')
      .then((resp) => {
        dispatch(setSpotlightsCityList(resp.data))
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  useEffect(() => {
    if (data) {
      setFilter({...data});
    }
  }, [data]);

  const filtrar = () => {
    dispatch(setFilterSpotlights({...filter}));
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
          label="Estado"
          placeholder="Estado"
          value={filter.id_state}
          changeValue={(e) => setFilter({...filter, id_state: e})}
          items={state&&(state.map((item) => ({
            label: item.name,
            value: item.id,
          })))}
        />
        <Picker
          label="Cidade"
          placeholder="Cidade"
          value={filter.id_city}
          changeValue={(e) => setFilter({...filter, id_city: e})}
          items={city&&(city.map((item) => ({
            label: item.name,
            value: item.id_city,
          })))}
        />
        <Input
          style={{marginTop:10}}
          value={filter.search}
          placeholder="Palavra chave"
          onChangeText={(e) => setFilter({...filter, search: e})}
        />
        <Button
          title="Limpar filtro"
          icon="trash-2"
          onPress={() => dispatch(setFilterSpotlights(defaultValues))}
          style={{backgroundColor: colors.delete, marginTop: 20}}
        />
        <Button title="Filtrar" onPress={filtrar} style={{marginTop:5}}/>
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
