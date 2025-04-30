import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {parseISO, format} from 'date-fns';
import {colors} from '../../styles';
import {resize} from '../../utils/font';

const {width, height} = Dimensions.get('window');
import galeria from '../../assets/imgs/galeria_placeholder.png';

const CardEquipment = ({
  onPress,
  image,
  title,
  category = '',
  sn = '',
  year,
  createdAt,
}) => {
  const [date, setDate] = useState('');

  useEffect(() => {
    try {
      setDate(format(parseISO(createdAt), "dd/MM/yyyy 'às' HH:mm"));
    } catch (error) {}
  }, []);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.cardImage}>
          <Image source={image ? {uri: image} : galeria} style={styles.image} />
        </View>
        <View style={[styles.containerText, styles.cardTitle]}>
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.date} numberOfLines={1}>
              {category}
            </Text>
            <Text style={styles.date} numberOfLines={1}>
              {year}
            </Text>
            <Text style={styles.date} numberOfLines={1}>
              NS: {sn}
            </Text>
          </View>
          <Text style={styles.date} numberOfLines={1}>
            Registrado {date}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingVertical: 5,
  },
  cardImage: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 5,
    backgroundColor: 'white',
    padding: 3,
    borderRadius: 5,
  },
  image: {
    height: (height * 15) / 100,
    width: (width * 30) / 100,
    borderRadius: 5,
    backgroundColor: '#e1e1e1',
  },
  cardTitle: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: (width * 12) / 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  containerText: {
    paddingLeft: (width * 24) / 100,
    paddingVertical: (height * 2) / 100,
    justifyContent: 'space-between',
  },
  title: {
    color: colors.primary,
    //fontFamily: 'Montserrat-SemiBold',
    fontSize: resize(14),
  },
  value: {
    fontSize: 24,
  },
  date: {
    color: colors.textPrimary,
    //fontFamily: 'Montserrat-Regular',
    fontSize: resize(12),
  },
});

export default CardEquipment;
