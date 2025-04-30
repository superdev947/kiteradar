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
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {parseISO, format} from 'date-fns';
const {width, height} = Dimensions.get('window');

import {NewInput, ItemListComments} from '../../components';
import { colors } from '../../styles';
import api from '../../services/api';
import { useSelector } from 'react-redux';

const destaque = ({navigation, route}) => {
  const {id, title, created_at, user} = route.params
  const users = useSelector((store) => store.user).user;
  const [refresh, setRefresh] = useState(false);
  const [comments, setComments] = useState();
  const [comment, setComment] = useState('');
  
  useEffect(() => {
    loadList();
  }, [id]);

  const loadList = () => {
    setRefresh(true);
    api
      .get(`spotlights/comments?id_spotlight=${id}`)
      .then((resp) => {
        setRefresh(false);
        setComments(resp.data);
      })
      .catch((error) => {
        setRefresh(false);
      });
  };

  const postComment = () => {
    console.log({
      id_user : users.id,
      id_spotlight : id,
      comment,
    })
    if(comment)
      api
        .post(`spotlights/comments/`,{
          id_user : users.id,
          id_spotlight : id,
          comment,
        })
        .then((resp) => {
          loadList()
          setComment('')
        })
        .catch((error) => {
          setComment('')
          console.log(error)
        });
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
      <View style={styles.separator} />
      <NewInput
        value={comment}
        onPressIcon={postComment}
        onChangeText={e=>setComment(e)}
        placeholder="Escreva seu comentário"
        style={{marginTop: 5, marginBottom: 20}}
        icon="send"
      />
      {comments&&comments.length > 0 && (
        <FlatList
          data={comments}
          renderItem={({item}) => (
            <ItemListComments key={item.id}{...item}/>
          )}
          refreshing={refresh}
          onRefresh={loadList}
          keyExtractor={(item, index) => String(index)}
        />
      )}
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
    paddingVertical: 5,
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
  

  separator: {
    height: 1,
    flex: 1,
    backgroundColor: '#000',
    marginVertical: 5,
  },
  containerImage: {
    flex: 1,
    minHeight: (height * 35) / 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
  },
  imageContainer: {
    flex: 1,
    height: (height * 30) / 100,
    borderRadius: 10,
  },
  image: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  
  
  
  textDescription: {
    marginHorizontal: 10,
    marginVertical: 10,
    fontSize: 12,
    color: 'black',
  },
  containerInput: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
  },
});

export default destaque;
