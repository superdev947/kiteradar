import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as Progress from 'react-native-progress';

const {width, height} = Dimensions.get('window');
import Seta from '../../assets/icons/Seta';
import E from '../../assets/imgs/E.png';
import ENE from '../../assets/imgs/ENE.png';
import ESE from '../../assets/imgs/ESE.png';
import N from '../../assets/imgs/N.png';
import NE from '../../assets/imgs/NE.png';
import NNE from '../../assets/imgs/NNE.png';
import NNW from '../../assets/imgs/NNW.png';
import NW from '../../assets/imgs/NW.png';
import S from '../../assets/imgs/S.png';
import SE from '../../assets/imgs/SE.png';
import SSE from '../../assets/imgs/SSE.png';
import SSW from '../../assets/imgs/SSW.png';
import SW from '../../assets/imgs/SW.png';
import W from '../../assets/imgs/W.png';
import WNW from '../../assets/imgs/WNW.png';
import WSW from '../../assets/imgs/WSW.png';

const CardRadar = ({
  direction = 'NE',
  nos = 0,
  max = 0,
  name = '',
  local = '',
  status,
  onPress,
  color = '#9526A7',
}) => {
  const getSource = () => {
    switch (direction) {
      case 'E':
        return E;
      case 'ENE':
        return ENE;
      case 'ESE':
        return ESE;
      case 'N':
        return N;
      case 'NE':
        return NE;
      case 'NNE':
        return NNE;
      case 'NNW':
        return NNW;
      case 'NW':
        return NW;
      case 'S':
        return S;
      case 'SE':
        return SE;
      case 'SSE':
        return SSE;
      case 'SSW':
        return SSW;
      case 'SW':
        return SW;
      case 'W':
        return W;
      case 'WNW':
        return WNW;
      case 'WSW':
        return WSW;
      default:
        return E;
    }
  };

  const getProgress = () => {
    const progress = (max * 100) / 50;
    return progress / 100;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.containerDirection}>
        <Text style={styles.textDirection} numberOfLines={1}>
          {direction}
        </Text>
        <Image
          source={getSource()}
          style={{height: 30, width: 30, resizeMode: 'cover'}}
        />
      </View>
      <View style={styles.containerIntensity}>
        <Text style={styles.textNo}>{nos} Nós</Text>
        <Text style={styles.textMax}>{max} Max</Text>
      </View>
      <View style={styles.containerInfo}>
        <Text style={styles.textName}>{name}</Text>
        <Text style={styles.textCity}>{local}</Text>
        <Progress.Bar
          progress={getProgress()}
          width={(width * 65) / 100}
          color={color}
          borderRadius={(height * 0.6) / 100}
          indeterminate={false}
          max={50}
          height={(height * 1.2) / 100}
          useNativeDriver={true}
        />
      </View>
      <Text
        style={[
          styles.textStatus,
          status ? styles.textStatusOn : styles.textStatusOf,
        ]}>
        {status ? 'On' : 'Off'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textStatusOf: {
    backgroundColor: '#ae2729',
    paddingHorizontal: (width * 1) / 100,
    color: 'white',
    borderRadius: 4,
    fontSize: 11,
  },
  textStatusOn: {
    backgroundColor: '#27AE60',
    paddingHorizontal: (width * 1) / 100,
    color: 'white',
    borderRadius: 4,
    fontSize: 11,
  },
  textCity: {
    fontSize: 12,
    marginVertical: (height * 1) / 100,
  },
  textName: {
    fontSize: 18,
  },
  textMax: {
    fontSize: 14,
  },
  textNo: {
    fontSize: 16,
  },
  textDirection: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    paddingVertical: (height * 2) / 100,
    alignItems: 'center',
  },
  containerDirection: {
    alignItems: 'center',
    flex: 1.5,
  },
  containerIntensity: {
    alignItems: 'center',
    flex: 3,
  },
  containerInfo: {
    width: (width * 65) / 100,
  },
  textStatus: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  rotacaoOeste: {
    transform: [{rotate: '90deg'}],
  },
  rotacaoNoroeste: {
    transform: [{rotate: '135deg'}],
  },
  rotacaoNorte: {
    transform: [{rotate: '0deg'}],
  },
  rotacaoNordeste: {
    transform: [{rotate: '225deg'}],
  },
  rotacaoLest: {
    transform: [{rotate: '270deg'}],
  },
  rotacaoSudeste: {
    transform: [{rotate: '315deg'}],
  },
  rotacaoSul: {
    transform: [{rotate: '180deg'}],
  },
  rotacaoSudoeste: {
    transform: [{rotate: '45deg'}],
  },
});

export default CardRadar;
