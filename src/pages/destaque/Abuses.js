import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {parseISO, format} from 'date-fns';
const {width, height} = Dimensions.get('window');

import {Button, Picker, TextArea} from '../../components';
import { colors } from '../../styles';
import api from '../../services/api';
import { useSelector } from 'react-redux';

const Abuses = ({navigation, route}) => {
  const {id, title, created_at, user} = route.params
  const users = useSelector((store) => store.user).user;
  const [types, setTypes] = useState([]);
  const [typeID, setTypeID] = useState('');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    loadList();
  }, []);

  const loadList = () => {
    api
      .get(`abuses/types?search=spotlights`)
      .then((resp) => {
        setTypes(resp.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onMessage = () => {
    if(message&&typeID)
      api
      .post(`abuses`,{
          id_abuse_type: typeID,
          id_origin: id,
          id_user: users.id,
          message,
        })
        .then((resp) => {
          navigation.goBack()
          setMessage('')
          setTypeID('')
        })
        .catch((error) => {
          console.log(error)
        });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        enabled={true}
        behavior="position"
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.containerHeaderImage}>
          <View>
            <Text style={styles.textTitleHeaderImage}>{title}</Text>
            <Text style={styles.textSubTitleHeaderImage}>
              {`${user.user_location.city.name}, ${user.user_location.state.name} ${format(parseISO(created_at),'dd/MM/yyyy')} às ${format(parseISO(created_at),'hh:mm')}`}
            </Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View>
              <Text style={styles.textName}>{user.name}</Text>
              <Text style={styles.textName}>{user.last_name}</Text>
            </View>
            <View style={[styles.avatarImage,{marginLeft:10}]}>
              <Image source={{uri:user.photo.url}} style={{width:'100%', height:'100%'}}/>
            </View>
          </View>
        </View>
        <Picker
          label="Motivo"
          placeholder="Motivo"
          value={typeID}
          changeValue={(e) => setTypeID(e)}
          items={types.map((item) => ({
            label: item.description,
            value: item.id,
          }))}
        />
        <View style={{marginVertical:5}}>
          <TextArea
            value={message}
            changeText={e=>setMessage(e)}
            placeholder="Escreva-nos uma mensagem."
          />
        </View>
        <View style={{flex:1}}/>
        <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:10, marginTop:10}}>
          <Button title="Descartar" style={{backgroundColor: colors.delete, width:'49%'}} onPress={()=>navigation.goBack()}/>
          <Button title="Enviar" onPress={onMessage} style={{width:'49%'}}/>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: 'white',
  },
  containerHeaderImage: {
    borderRadius: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textTitleHeaderImage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  textSubTitleHeaderImage: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  textName: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  avatarImage:{
    borderRadius:(width * 6) / 100,
    width:(width * 12) / 100,
    height:(width * 12) / 100,
    overflow:'hidden', 
    borderColor:colors.textPrimary, 
    borderWidth:2
  },
});

export default Abuses;
