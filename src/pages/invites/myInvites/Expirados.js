import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import api from '../../../services/api';

import {CardInvite, Laoding, NotFound, Footer} from '../../../components';

const myInvites = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const {user} = useSelector((store) => store.user);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadList();
    });

    return unsubscribe;
  }, [navigation]);

  const loadList = () => {
    api
      .get(`invites?user=${user.id}&status=2`)
      .then((resp) => {
        console.log('invites inativos', resp.data);
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
  const renovarInvite = (item) => {
    api
      .put(`invites/${item.id}`, {status: 0})
      .then((resp) => {
        
        loadList();
      })
      .catch((err) => {
        console.log('err', err);
        Alert.alert(
          displayName,
          'Não foi possível concluir sua solicitação, tente novamente mais tarde.',
        );
      });
  };

  return (
    <View style={styles.container}>
      {loading && <Laoding />}
      {!loading && list.length === 0 && (
        <NotFound title="Nenhum invite encontrado" />
      )}
      {!loading && list.length > 0 && (
        <FlatList
          contentContainerStyle={{flex: 1}}
          data={list}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <CardInvite
              title={item.title}
              max={item.max_price}
              date={item.createdAt}
              state={item.user && item.user.state ? item.user.state.name : ''}
              category={item.category ? item.category.description : ''}
              renovar
              onPressRenovar={() => renovarInvite(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          refreshing={refresh}
          onRefresh={() => {
            setRefresh(true);
            loadList();
          }}
        />
      )}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default myInvites;
