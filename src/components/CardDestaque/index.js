import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {parseISO, format} from 'date-fns';
const {height, width} = Dimensions.get('window');

import Like from '../../assets/icons/Like';
import { colors } from '../../styles';
import api from '../../services/api';
import { useSelector } from 'react-redux';

const CardDestaque = ({onPress, onMore, title, created_at, user, description, spotlight_photo, id, likes, total_likes}) => {
  const users = useSelector((store) => store.user).user;
  const onShare = async () => {
    try {
      await Share.share({
        message:`${title}\n\n${description}\n\nhttp://kiteradar.com.br/views/v1/spotlighsts${id}`
      });
    } catch (error) {
      alert(error.message);
    }
  }

  const onLikes = () => {
    api
      .post(`spotlights/likes`,{
        id_spotlight:id,
        id_user:users.id
      })
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.containerHeaderImage}>
        <View>
          <Text style={styles.textTitleHeaderImage} numberOfLines={1}>{title}</Text>
          <Text style={styles.textSubTitleHeaderImage} numberOfLines={1}>
            {`${user.user_location.city.name} ${user.user_location.state.name} ${format(parseISO(created_at),'dd/MM/yyyy')} às ${format(parseISO(created_at),'hh:mm')}`}
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
      {
        spotlight_photo&&(
          <ImageBackground
            style={styles.image}
            imageStyle={styles.containerImage}
            source={{uri:spotlight_photo.file.url}}/>
        )
      }
      <View style={styles.containerFooter}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={onPress}>
              <Icon name="message-circle" size={25} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>onShare()}>
              <Icon name="share-2" size={25} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>onLikes()}>
              <FontAwesome name="hand-o-right" size={25} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onMore}>
            <Icon name="more-vertical" size={25} style={{marginLeft:10}}/>
          </TouchableOpacity>
        </View>
        <Text style={styles.textDescription} numberOfLines={2}>{description}</Text>
        <View>
          <Text style={[styles.textDescription,{textAlign:'center', marginTop:5}]} numberOfLines={1}>{likes[0]?.user?.name}  {likes[0]?.user?.last_name}    {total_likes!='0'?total_likes:''}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: (height * 35) / 100,
    width: '100%',
    justifyContent: 'space-between',
  },
  avatarImage:{
    borderRadius:(width * 6) / 100,
    width:(width * 12) / 100,
    height:(width * 12) / 100,
    overflow:'hidden', 
    borderColor:colors.textPrimary, 
    borderWidth:2
  },
  containerImage: {
    flex: 1,
    borderRadius: 10,
  },
  textFooter: {
    maxWidth: (width * 70) / 100,
    color: '#9C9C9C',
  },
  containerFooter: {
    paddingVertical: 5,
    flex: 1,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 15,
  },
  containerFooterImage: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    margin: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  textDescription: {
    fontSize: 12,
    color: 'black',
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
    maxWidth:width*0.5
  },
  textSubTitleHeaderImage: {
    fontSize: 12,
    color: colors.textPrimary,
    maxWidth:width*0.5
  },
  textName: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  container: {
    flex: 1,
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
    overflow:'hidden'
  },
});

export default CardDestaque;
