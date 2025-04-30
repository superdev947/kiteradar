import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';

import {Input, Laoding, NotFound} from '../../components';

import api from '../../services/api';
import {colors} from '../../styles';
import {setCity} from '../../store/modules/ad/actions';
const {width, height} = Dimensions.get('window');

const FilterCity = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {state} = route.params;

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (state) {
      navigation.setOptions({
        title: state.name,
      });
    }
    loadList();
  }, []);

  useEffect(() => {
    loadList();
  }, [search]);

  const loadList = () => {
    api
      .get(`city?state=${state.id || -1}&search=${search}`)
      .then((resp) => {
        console.log('city', resp.data);
        setList(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Pesquisar"
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      {loading && <Laoding />}
      {!loading && list.length === 0 && (
        <NotFound title="Nenhuma cidade encontrada. Tente outro filtro" />
      )}
      {!loading && list.length > 0 && (
        <FlatList
          contentContainerStyle={{paddingTop: (height * 2) / 100}}
          showsVerticalScrollIndicator={false}
          data={list}
          renderItem={({item}) => (
            <ItemCity
              title={item.name}
              onPress={() => {
                dispatch(setCity(item));
                navigation.goBack();
              }}
            />
          )}
          keyExtractor={(item) => String(item.id)}
        />
      )}
    </View>
  );
};

const ItemCity = ({title, onPress}) => (
  <TouchableOpacity style={styles.containerItemCity} onPress={onPress}>
    <Text style={styles.titleItemCity}>{title}</Text>
    <Icon name="chevron-right" size={20} color={colors.textPrimary} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: (width * 5) / 100,
    paddingVertical: (height * 2) / 100,
  },
  containerItemCity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: (height * 1) / 100,
    paddingHorizontal: 10,
    marginTop: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 5,
    elevation: 2,
  },
  titleItemCity: {
    fontSize: 16,
  },
});

export default FilterCity;
