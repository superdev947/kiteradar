import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {format, parseISO} from 'date-fns';
import {useSelector} from 'react-redux';

import {colors} from '../../styles';

import {Laoding, NotFound} from '../../components';

import api from '../../services/api';

const {width, height} = Dimensions.get('window');
import profile from '../../assets/imgs/profile.png';

const radar = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const {radar} = useSelector((store) => store.radar);
  const {item} = route.params;

  useEffect(() => {
      loadList();
  }, []);

  const loadList = () => {
    api
      .get(`location/comments?id_local=${item.id_radar}`)
      .then((resp) => {
        setList(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('error', error);
        setLoading(FlatList);
      });
  };

  return (
    <View style={styles.container}>
      {loading && <Laoding />}

      {!loading && list.length === 0 && (
        <NotFound title="Nenhum comentário encontrado" />
      )}
      {!loading && list.length > 0 && (
        <FlatList
          data={list}
          renderItem={({item}) => (
            <ItemComment
              foto={item?.user?.photo?.url}
              name={item.user.name}
              address={item?.user?.user_location}
              date={format(parseISO(item.created_at), 'HH:mm dd/MM/yyyy')}
              comment={item.comment}
            />
          )}
          extraData={(item, index) => String(index)}
        />
      )}
    </View>
  );
};
const ItemComment = ({foto, name, date, comment, address}) => {
  const [verMais, setVerMais] = useState(false);

  return (
    <View style={styles.containerComment}>
      <View>
        <View style={styles.containerImage}>
          <Image
            source={foto ? {uri: foto} : profile}
            style={styles.imageComment}
          />
          <View>
            <Text style={styles.textNameComment}>{name}</Text>
            <Text style={styles.textDateComment}>{`${address?.city.name} ${address?.state.name}`}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.textComment}>
        {comment.length > 200
          ? verMais
            ? comment
            : comment.substring(0, 200)
          : comment}
      </Text>
      <Text style={[styles.textDateComment,{textAlign:'right'}]}>{date}</Text>
      {comment.length > 200 && (
        <TouchableOpacity onPress={() => setVerMais(!verMais)}>
          <Text style={styles.textVerMais}>
            {verMais ? 'VER MENOS' : 'VER MAIS'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: (height * 2) / 100,
    backgroundColor: 'white',
  },
  containerComment: {
    marginTop:10,
    paddingHorizontal: (width * 5) / 100,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: (height * 2) / 100,
  },
  imageComment: {
    width: (width * 12) / 100,
    height: (width * 12) / 100,
    borderRadius: (width * 16) / 100,
    backgroundColor: '#e1e1e1',
    marginRight: (width * 3) / 100,
  },
  textDateComment: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  textNameComment: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  containerImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textComment: {
    color: colors.textPrimary,
    fontSize: 14,
    marginTop: (height * 1) / 100,
  },
  textVerMais: {
    marginTop: 5,
    fontWeight: 'bold',
    color: 'gray',
  },
});

export default radar;
