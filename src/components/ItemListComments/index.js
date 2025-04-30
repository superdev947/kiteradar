import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {parseISO, format} from 'date-fns';
import { colors } from '../../styles';

const ItemListComments = ({comment, user, created_at}) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Image
          style={styles.image}
          source={{uri:user?.photo?.url}}
        />
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.date}>
            {`${user.user_location.city.name}, ${user.user_location.state.name} `}
          </Text>
        </View>
      </View>
      <Text style={styles.comment}>{comment}</Text>
      <Text style={[styles.date,{textAlign:'right', marginTop:10}]}>
        {format(parseISO(created_at),'dd/MM/yyyy')} às {format(parseISO(created_at),'hh:mm')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  containerHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  date: {
    color: '#D0D0D0',
    fontSize: 10,
    fontWeight: 'bold',
  },
  comment: {
    color: '#858585',
    fontSize: 11,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 10,
  },
});

export default ItemListComments;
