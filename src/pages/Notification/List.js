import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, FlatList, Text} from 'react-native';
import {Laoding, NotFound} from '../../components';

import api from '../../services/api';
import { useSelector } from 'react-redux';
import { colors } from '../../styles';
import {parseISO, format} from 'date-fns';

const {height, width} = Dimensions.get('window');

const List = ({navigation}) => {
  const { user } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [notifications, setNotifications] = useState();

  useEffect(() => {
    loadList();
  }, []);

  const loadList = () => {
    setRefresh(true);
    api
      .get(`notifications?${user.id}`)
      .then((resp) => {
        setLoading(false);
        setRefresh(false);
        setNotifications(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        setRefresh(false);
      });
  };

  return (
    <View style={styles.container}>
      {loading && <Laoding />}
      {!loading && notifications&&notifications.length === 0 && (
        <NotFound title="Nenhum radar encontrado" />
      )}
      {!loading && notifications&&notifications.length > 0 && (
        <FlatList
          data={notifications}
          renderItem={({item}) => (
            <Notification
              key={item.id_notification}
              {...item}
            />
          )}
          refreshing={refresh}
          onRefresh={loadList}
          keyExtractor={(item) => item.notification.title}
        />
      )}
    </View>
  );
};

const Notification = ({notification, created_at}) => (
  <View style={styles.notifications}>
    <Text style={styles.title}>{notification.title}</Text>
    <Text style={styles.message}>{notification.message}</Text>
    <Text style={[styles.created_at]}>Natal, RN 
      {`${format(parseISO(created_at),'dd/MM/yyyy')} às ${format(parseISO(created_at),'hh:mm')}`}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop:10,
    height: (height * 2) / 100,
    backgroundColor: 'white',
  },
  notifications:{
    borderRadius:5, 
    elevation:2, 
    paddingVertical:10,
    marginBottom:10,
    paddingHorizontal:15,
  },
  title:{
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  message:{
    marginTop:5,
    fontSize: 14,
    color: colors.textPrimary,
  },
  created_at:{
    marginTop:10,
    fontSize: 12,
    color: colors.textPrimary,
    textAlign:'right',
  },
});
export default List;
