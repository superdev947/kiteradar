import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../styles';

const {width, height} = Dimensions.get('window');
import galeria from '../../assets/imgs/galeria_placeholder.png';

const CardLostFound = ({
  onPress,
  image,
  title,
  value,
  valueColor = '#DB3838',
  location,
  date,
  brand,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={image ? {uri: image} : galeria} style={styles.image} />
      <View style={styles.containerText}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.value, {color: valueColor}]}>{value}</Text>
        </View>
        <View style={styles.containerFooter}>
          <View>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.date}>{location}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#C4C4C4',
    paddingBottom: 10,
  },
  image: {
    height: (height * 15) / 100,
    width: (width * 30) / 100,
    borderRadius: 2,
    backgroundColor: '#e1e1e1',
  },
  containerText: {
    marginLeft: (width * 3) / 100,
    justifyContent: 'space-between',
  },
  containerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (width * 60) / 100,
  },
  title: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 24,
    color: '#DB3838',
  },
  date: {
    fontSize: 14,
    color: '#858585',
  },
});

export default CardLostFound;
