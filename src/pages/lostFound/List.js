import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {parseISO, format} from 'date-fns';

import api from '../../services/api';

import {CardLostFound, Laoding, NotFound} from '../../components';

const List = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const {user} = useSelector((store) => store.user);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      setList([]);
      loadEquipments();
    });

    return unsubscribe;
  }, [navigation]);

  const loadEquipments = () => {
    setRefresh(true);
    api
      .get(`lostfound`)
      .then((resp) => {
        console.log('equipements', resp.data);
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
        <NotFound title="Nenhum registro encontrado" />
      )}
      {!loading && list.length > 0 && (
        <FlatList
          data={list}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <CardLostFound
              title={item.equipment.name}
              image={
                item.equipment.EquipmentPhotos.length > 0
                  ? item.equipment.EquipmentPhotos[0].photo.url
                  : null
              }
              valueColor={item.event.button_color}
              value={item.event.description}
              location={`${item.city.name} -  ${item.state.uf}`}
              date={format(
                parseISO(item.occurrence_date),
                "dd/MM/yyyy 'às' HH:mm",
              )}
              onPress={() => navigation.navigate('Details', {item})}
            />
          )}
          keyExtractor={(item) => item.id}
          refreshing={refresh}
          onRefresh={loadEquipments}
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
