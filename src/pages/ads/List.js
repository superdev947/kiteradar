import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import {parseISO, format} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {MaskService} from 'react-native-masked-text';
import {useDispatch, useSelector} from 'react-redux';

import {CardAds, Laoding, NotFound} from '../../components';
import api from '../../services/api';

import {colors} from '../../styles';

const Marketplace = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const {filter} = useSelector((store) => store.ad);
  const adFilter = useSelector((store) => store.ad);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAnuncios();
    });

    return unsubscribe;
  }, [navigation, filter]);

  const loadAnuncios = () => {
    let url = `adv/list?brand=${filter.id_brand}&state=${filter.id_state}&year=${filter.year}&category=${filter.id_category}&search=${filter.search}`;
    api
      .get(url)
      .then((resp) => {
        console.log('ads', resp.data);
        setList(resp.data);
        setLoading(false);
        setRefresh(false);
      })
      .catch((error) => {
        setLoading(false);
        setRefresh(false);

        console.log('error', error);
      });
  };

  const maskMoney = (text) => {
    return MaskService.toMask('money', text, {
      precision: 2,
      separator: ',',
      delimiter: '.',
      unit: 'R$ ',
      suffixUnit: '',
    });
  };

  const isFilter = () => {
    if (filter.id_brand !== -1) return true;
    if (filter.id_state !== -1) return true;
    if (filter.year !== -1) return true;
    if (filter.id_category !== -1) return true;
    return false;
  };

  const filterBrand = () => {
    const brand = adFilter.brand.find((item) => item.id === filter.id_brand);
    if (brand) {
      return (
        <View style={styles.itemFilter}>
          <Text style={styles.textFilter}>{brand.description}</Text>
        </View>
      );
    }
  };

  const filterState = () => {
    const state = adFilter.state.find((item) => item.id === filter.id_state);
    if (state) {
      return (
        <View style={styles.itemFilter}>
          <Text style={styles.textFilter}>{state.uf}</Text>
        </View>
      );
    }
  };

  const filterCategory = () => {
    const category = adFilter.category.find(
      (item) => item.id === filter.id_category,
    );
    if (category) {
      return (
        <View style={styles.itemFilter}>
          <Text style={styles.textFilter}>{category.description}</Text>
        </View>
      );
    }
  };

  console.log('filter', filter, adFilter);

  return (
    <View style={styles.container}>
      {isFilter() && (
        <View style={styles.containerFilter}>
          {filter.id_state !== -1 && filterState()}
          {filter.id_category !== -1 && filterCategory()}
          {filter.id_brand !== -1 && filterBrand()}
        </View>
      )}
      {loading && <Laoding />}
      {!loading && list.length === 0 && (
        <NotFound title="Nenhum anúncio encontrado" />
      )}
      {!loading && list.length > 0 && (
        <FlatList
          style={styles.list}
          data={list}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <CardAds
              title={item.title}
              image={
                item.AdPhotos.length > 0 ? item.AdPhotos[0].photo.url : null
              }
              value={maskMoney(item.price)}
              date={
                format(parseISO(item.createdAt), 'cccc', {locale: ptBR}) +
                ' às ' +
                format(parseISO(item.createdAt), 'HH:mm', {locale: ptBR})
              }
              city={item.city.name}
              uf={item.state.uf}
              onPress={() => navigation.navigate('AdDetails', {item})}
            />
          )}
          refreshing={refresh}
          onRefresh={() => {
            setRefresh(true);
            loadAnuncios();
          }}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 10,
  },
  containerFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 1,
  },
  itemFilter: {
    flex: 1,
    alignItems: 'center',
    borderEndWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    paddingVertical: 10,
  },
  textFilter: {
    color: colors.textPrimary,
  },
});

export default Marketplace;
