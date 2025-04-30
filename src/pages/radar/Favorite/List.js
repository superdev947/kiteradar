import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

import {CardRadar, Laoding, NotFound} from '../../../components';

import api from '../../../services/api';

const {height, width} = Dimensions.get('window');

const List = ({navigation}) => {
  const {user} = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadList();
    });
  }, [navigation]);

  const loadList = () => {
    api
      .get(`place/favorite?id=${user.id}`)
      .then((resp) => {
        setLoading(false);
        setList(resp.data);
      })
      .catch((error) => {
        console.log('error', error);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      {loading && <Laoding />}
      {!loading && list.length === 0 && (
        <NotFound title="Nenhum radar adicionado aos favoritos" />
      )}
      {!loading && list.length > 0 && (
        <FlatList
          data={list}
          renderItem={({item}) => (
            <CardRadar
              direction={item.cardeal}
              nos={item.intensity}
              max={item.maximum}
              name={item.local_name}
              color={item.color}
              local={`${item.city} / ${item.state}`}
              status={item.online === 1 ? true : false}
              onPress={() => {
                navigation.navigate('Details', {item});
              }}
            />
          )}
          keyExtractor={(item) => item.local.title}
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
