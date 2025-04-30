import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, FlatList, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import {Laoding, NewInput, NotFound} from '../../components';

import api from '../../services/api';
import { useSelector } from 'react-redux';
import { colors } from '../../styles';
import {parseISO, format} from 'date-fns';
import { id } from 'date-fns/locale';

const {height, width} = Dimensions.get('window');

const List = ({navigation, route}) => {
  const { user } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [chatHistory, setChatHistory] = useState();
  const [message, setMessage] = useState('');
  const item = route.params;
  console.log(item);
  let flatList = null
  useEffect(() => {
    navigation.setOptions({
      title: item.title
    })
    loadList();
  }, []);

  const loadList = () => {
    setRefresh(true);
    api
      .get(`chat/view?id_chat=${item.id}&offset=${0}&limit=${100}`)
      .then((resp) => {
        setLoading(false);
        setRefresh(false);
        setChatHistory(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        setRefresh(false);
      });
  };

  const sendMessage = () => {
    if(message!=='')
      api
        .post(`chat/message`,{
          id_chat:item.id,
          id_sender:user.id,
          id_recipient:1,
          message
        })
        .then((resp) => {
          setMessage('')
          loadList()
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
    <View style={styles.container}>
      {loading && <Laoding />}
      {!loading && !chatHistory && (
        <NotFound title="Nenhum radar encontrado" />
      )}
      {!loading && chatHistory && (
        <>
        <View style={{flexDirection:'row', borderBottomWidth:0.5, borderColor:'#C4C4C4'}}>
          <View style={[{height: (width * 15) / 100, backgroundColor:colors.white, elevation:2, padding:5, margin:5}]}>
            <Image source={{uri:item.photo.url}} style={styles.image}/>
          </View>
          <View style={{width:(width * 70) / 100, padding:10}}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.origin_type}</Text>
          </View>
        </View>
        <FlatList
          data={chatHistory[0]?.messages}
          ref={ref => (flatList = ref)}
          onContentSizeChange={()=> flatList.scrollToEnd()}
          renderItem={({item}) => (
            <ChatHistory
              key={item.id_message}
              photo={chatHistory[0]?.photo}
              user={user}
              {...item}
            />
          )}
          refreshing={refresh}
          onRefresh={loadList}
          keyExtractor={(item, index) => String(index)}
        />
        </>
      )}
      <View style={{flex:1}}/>
      <NewInput
        value={message}
        onPressIcon={()=>sendMessage()}
        onChangeText={e=>setMessage(e)}
        placeholder="Escreva seu comentário"
        style={{marginTop: 5, marginBottom: 20}}
        icon="send"
      />
    </View>
  );
};

const ChatHistory = ({created_at, id_recipient, id_sender, message, user, photo }) => (
  <View style={styles.notifications}>
    {
      user.id === id_sender?
      <View style={{flexDirection:'row', width:'100%', justifyContent:'flex-end'}}>
        <View style={[styles.messageCover,{marginRight:10}]}>
          <Text style={[styles.message, {marginTop:0}]} numberOfLines={1}>{message}</Text>
          <Text style={[styles.created_at]}>
            {`${format(parseISO(created_at),'dd/MM/yyyy')} às ${format(parseISO(created_at),'hh:mm')}`}
          </Text>
        </View>
        <View style={[styles.avatar]}>
          <Image source={{uri:photo.url}} style={{width:'100%', height:'100%'}}/>
        </View>
      </View>
      :
      <View style={{flexDirection:'row', width:'100%'}}>
        <View style={[styles.avatar]}>
          <Image source={{uri:photo.url}} style={{width:'100%', height:'100%'}}/>
        </View>
        <View style={[styles.messageCover,{marginLeft:10}]}>
          <Text style={[styles.message, {marginTop:0}]} numberOfLines={1}>{message}</Text>
          <Text style={[styles.created_at]}>
            {`${format(parseISO(created_at),'dd/MM/yyyy')} às ${format(parseISO(created_at),'hh:mm')}`}
          </Text>
        </View>
      </View>
    }
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:10,
    height: (height * 2) / 100,
    backgroundColor: 'white',
  },
  notifications:{
    borderRadius:5, 
    paddingVertical:10,
    marginBottom:10,
    paddingHorizontal:15,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  image: {
    width: (width * 15) / 100,
    height: (width * 15) / 100,
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
  messageCover:{
    width:(width * 75) / 100, 
    padding:20,
    borderRadius:10, 
    backgroundColor:'#F9F9F9',
  },
  created_at:{
    marginTop:10,
    fontSize: 12,
    color: colors.textPrimary,
    textAlign:'right',
  },
  avatar:{
    overflow:'hidden',
    borderRadius:(width * 5) / 100,
    width: (width * 10) / 100,
    height: (width * 10) / 100,
  }
});
export default List;
