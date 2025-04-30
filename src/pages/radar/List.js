import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, FlatList} from 'react-native';
import {MaterialIcons, Feather} from 'react-native-vector-icons';
import {CardRadar, Laoding, NotFound} from '../../components';

import api from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { setRadarList } from '../../store/modules/radar/actions';

const {height, width} = Dimensions.get('window');

const List = ({navigation}) => {
  const {radarList, filter} = useSelector((store) => store.radar);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadList();
    });
    return unsubscribe;
  }, [navigation, filter]);


  const loadList = () => {
    setRefresh(true);
    let url = `radar/list?state=${filter.id_state}&city=${filter.id_city}&search=${filter.search}`;
    api
      .get(url)
      .then((resp) => {
        setLoading(false);
        setRefresh(false);
        dispatch(setRadarList(resp.data));
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
      {!loading && radarList&&radarList.length === 0 && (
        <NotFound title="Nenhum radar encontrado" />
      )}
      {!loading && radarList&&radarList.length > 0 && (
        <FlatList
          data={radarList}
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
export default List;
