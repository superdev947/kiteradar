import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, FlatList, Text, Image, TouchableOpacity} from 'react-native';
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
      .get(`chat/list?id_user=${user.id}`)
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
              key={item.id}
              onPress={()=>navigation.navigate('ChatDetails', item)}
              {...item}
            />
          )}
          refreshing={refresh}
          onRefresh={loadList}
          keyExtractor={(item) => `${item.id}`}
        />
      )}
    </View>
  );
};

const Notification = ({title, origin_type, createdAt, photo, message, onPress}) => (
  <TouchableOpacity style={styles.notifications} onPress={onPress}>
    <View style={[{backgroundColor:colors.white, elevation:2, padding:5, margin:5}]}>
      <Image source={{uri:photo.url}} style={styles.image}/>
    </View>
    <View style={styles.textCover}>
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{origin_type}</Text>
        </View>
        <Text style={[styles.created_at]}>
          {`${format(parseISO(createdAt),'dd/MM/yyyy')}\nàs ${format(parseISO(createdAt),'hh:mm')}`}
        </Text>
      </View>
      <Text style={[styles.message,{marginTop:15}]} numberOfLines={1}>{message&&message.length&&message[message.length].message}</Text>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical:10,
    paddingHorizontal: (height * 1) / 100,
    height: (height * 2) / 100,
    backgroundColor: 'white',
  },
  notifications:{
    borderRadius:5, 
    marginVertical:10,
    marginBottom:10,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  image: {
    width: (width * 20) / 100,
    height: (width * 20) / 100,
    flex: 1,
    borderRadius: 5,
  },
  title:{
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
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
  textCover:{
    padding:10, 
    borderBottomWidth:0.5, 
    borderColor:'#C4C4C4',
    width:width*0.7
  }
});
export default List;
