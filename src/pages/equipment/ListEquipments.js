import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import api from '../../services/api';

import {CardEquipment, Laoding, NotFound} from '../../components';

const List = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const {user} = useSelector((store) => store.user);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadEquipments();
    });

    return unsubscribe;
  }, [navigation]);

  const loadEquipments = () => {
    api
      .get(`equipment/list/${user.id}`)
      .then((resp) => {
        console.log('equipments', resp.data);
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

  return (
    <View style={styles.container}>
      {loading && <Laoding />}
      {!loading && list.length === 0 && (
        <NotFound title="Nenhum equipamento encontrado" />
      )}
      {!loading && list.length > 0 && (
        <FlatList
          data={list}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <CardEquipment
              title={item.name}
              image={
                item.EquipmentPhotos.length > 0
                  ? item.EquipmentPhotos[0].photo.url
                  : null
              }
              category={item.category && item.category.description}
              year={item.year}
              sn={item.serial_number}
              createdAt={item.createdAt}
              onPress={() => navigation.navigate('EquipmentDetails', {item})}
            />
          )}
          keyExtractor={(item) => item.id}
          refreshing={refresh}
          onRefresh={() => {
            setRefresh(true);
            loadEquipments();
          }}
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

export default List;
