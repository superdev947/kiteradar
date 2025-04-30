import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, FlatList} from 'react-native';
import { useSelector } from 'react-redux';

import {CardRadar, Laoding, NotFound} from '../../components';

import api from '../../services/api';

const {height, width} = Dimensions.get('window');

const FavoritosList = ({navigation}) => {
  const {user} = useSelector((store) => store.user);
  const {filter} = useSelector((store) => store.radar);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const [list, setList] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadList();
    });
    return unsubscribe;
  }, [navigation, filter]);

  const loadList = () => {
    setRefresh(true);
    let url = `radar/list/favorites/?id_user=${user.id}&state=${filter.id_state}&city=${filter.id_city}&search=${filter.search}`;
    api
      .get(url)
      .then((resp) => {
        setLoading(false);
        setRefresh(false);
        setList(resp.data);
      })
      .catch((error) => {
        console.log('error', error);
        setLoading(false);
        setRefresh(false);
      });
  };

  return (
    <View style={styles.container}>
      {loading && <Laoding />}
      {!loading && list.length === 0 && (
        <NotFound title="Nenhum radar encontrado" />
      )}
      {!loading && list.length > 0 && (
        <FlatList
          data={list}
          renderItem={({item}) => (
            <CardRadar
              key={item.id_local}
              direction={item.cardeal}
              nos={item.sustained}
              max={item.gust}
              name={item.local_name}
              color={item.color}
              local={`${item.city} / ${item.state}`}
              status={item.online === 'On' ? true : false}
              onPress={() => {
                navigation.navigate('Details', {item});
              }}
            />
          )}
          refreshing={refresh}
          onRefresh={loadList}
          keyExtractor={(item) => item.title}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: (width * 5) / 100,
    height: (height * 2) / 100,
    backgroundColor: 'white',
  },
});
export default FavoritosList;
