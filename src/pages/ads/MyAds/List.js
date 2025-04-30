import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {parseISO, format} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {MaskService} from 'react-native-masked-text';

import {CardAds, Laoding, NotFound} from '../../../components';
import api from '../../../services/api';

const Marketplace = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const {user} = useSelector((store) => store.user);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAnuncios();
    });

    return unsubscribe;
  }, [navigation]);

  const loadAnuncios = () => {
    api
      .get(`adv/list/${user.id}`)
      .then((resp) => {
        console.log('myads', resp.data);
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

  return (
    <View style={styles.container}>
      {loading && <Laoding />}
      {!loading && list.length === 0 && (
        <NotFound title="Nenhum anúncio encontrado" />
      )}
      {!loading && list.length > 0 && (
        <FlatList
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
              edit
              onPress={() =>
                navigation.navigate('AdDetails', {item, edit: true})
              }
              onPressEdit={() => navigation.navigate('AdEdit', {item})}
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
    padding: 10,
  },
});

export default Marketplace;
