import React,{ useEffect } from 'react';
import {Text, StyleSheet, ScrollView, Dimensions, Image, View, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { Button } from '../../components';
import api from '../../services/api';
import {colors} from '../../styles';

const {width, height} = Dimensions.get('window');

const radar = ({}) => {
  const { radar } = useSelector((store) => store.radar);
  return (
    <ScrollView style={styles.container}>
      {
        radar&&(
          <>
            <View>
              {radar?.sailling_photos && (
                <Image source={{uri: radar.sailling_photos.url}} style={styles.image} />
                )}
              <Text style={[styles.saillingTitle]}>{radar.sailing_title || ''}</Text>
            </View>
            <View style={{backgroundColor:colors.white, paddingHorizontal:10, paddingBottom:100}}>
              <Text style={styles.title}>Velejo</Text>
              <Text style={styles.text}>{radar.sailing_description || ''}</Text>
              <Text style={[styles.title,{marginTop:20}]}>Dados do Pico</Text>
              <View style={{flexDirection:'row'}}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Image source={require('../../assets/imgs/bussula1.png')} />
                  <View style={{marginLeft:10}}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={[styles.text, {fontWeight:'700'}]}>Lat:  </Text>
                      <Text style={styles.text}>{radar.latitude}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={[styles.text, {fontWeight:'700'}]}>Lon:  </Text>
                      <Text style={styles.text}>{radar.latitude}</Text>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection:'row', alignItems:'center', marginLeft:50}}>
                  <Image source={require('../../assets/imgs/praia_ico1.png')} />
                  <View style={{marginLeft:10}}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={[styles.text, {fontWeight:'700'}]}>OLC: </Text>
                      <Text style={styles.text}>Norte ({0}º)</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={[styles.text, {fontWeight:'700'}]}>ELC: </Text>
                      <Text style={styles.text}>Leste ({0}º)</Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* <Button title="Abrir no Mapa" style={{marginTop:30, marginBotton:100}}/> */}
            </View>
          </>
        )
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: (width * 1) / 100,
  },
  image: {
    height: (height * 30) / 100,
    flex: 1,
    borderRadius: 5,
  },
  text: {
    marginTop:5,
    fontSize: 15,
    color: colors.textPrimary,
  },
  title: {
    fontSize: 17,
    marginTop:5,
    color: colors.primary,
    fontWeight:'700'
  },
  saillingTitle: {
    fontSize: 20,
    marginTop:5,
    color: colors.white,
    fontWeight:'700',
    position:'absolute',
    paddingVertical:10, 
    paddingHorizontal:20,
    borderRadius:5,
    backgroundColor:'rgba(0, 98, 255, 0.7)',
    bottom:10,
    left:20
  },
});

export default radar;
