import React, {useEffect, useState} from 'react';
import {
  View, 
  StyleSheet, 
  Dimensions, 
  FlatList, 
  Text, 
  Image, 
  TouchableOpacity, 
  Modal, 
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Laoding, NotFound, CardDestaque } from '../../components';
import api from '../../services/api';
import { colors } from '../../styles';
import { setSpotlights } from '../../store/modules/spotlights/actions';
import { useDispatch, useSelector } from 'react-redux';

const {height, width} = Dimensions.get('window');

const List = ({navigation}) => {
  const {spotlights, filter} = useSelector((store) => store.spotlights);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadList();
    });
    return unsubscribe;
  }, [navigation, filter]);

  const loadList = () => {
    setRefresh(true);
    let url = `spotlights?state=${filter.id_state}&city=${filter.id_city}&search=${filter.search}`;
    api
      .get(url)
      .then((resp) => {
        setLoading(false);
        setRefresh(false);
        dispatch(setSpotlights(resp.data));
      })
      .catch((error) => {
        setLoading(false);
        setRefresh(false);
      });
  };
  
  const onAbuses = () =>{
    setVisible(false)
    navigation.navigate('Abuses', active)
  }

  const onMessage = () =>{
    setVisible(false)
    navigation.navigate('ChatsList', active)
  }

  return (
    <View style={styles.container}>
      {loading && <Laoding />}
      {!loading && spotlights&&spotlights.length === 0 && (
        <NotFound title="Nenhum radar encontrado" />
      )}
      {!loading && spotlights&&spotlights.length > 0 && (
        <FlatList
          data={spotlights}
          renderItem={({item}) => (
            <CardDestaque
              key={item.id}
              onPress={()=>navigation.navigate('Details', item)}
              onMore={()=>{setVisible(true), setActive(item)}}
              {...item}
            />
          )}
          refreshing={refresh}
          onRefresh={loadList}
          keyExtractor={(item) => `${item.id}`}
        />
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        >
        <View style={styles.containerModal}>
          <TouchableWithoutFeedback onPress={() => setVisible(false)}>
            <View style={{flex: 1}} />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.bottomMenuCover}>
          <View style={styles.bottomMenu}>
            <TouchableOpacity style={styles.iconCover} onPress={onAbuses}>
              <Icon name="alert-circle" size={25} />
              <Text style={styles.text}>Denunciar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCover} onPress={onMessage}>
              <Icon name="message-circle" size={25} />
              <Text style={styles.text}>Mensage</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingTop:10,
    height: (height * 2) / 100,
    backgroundColor: 'white',
  },
  containerModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  bottomMenuCover:{
    position:'absolute',
    backgroundColor: colors.white,
    borderTopRightRadius:20,
    borderTopLeftRadius:20,
    paddingVertical:20,
    paddingHorizontal:10,
    overflow:'hidden',
    width:'100%',
    bottom:0
  },
  bottomMenu:{
    backgroundColor:colors.white,
  },
  iconCover:{
    flexDirection:'row', 
    marginTop:10, 
    alignItems:'center'
  },
  text:{
    marginLeft:10,
    fontSize:16,
  },
});
export default List;
