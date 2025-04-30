import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import IconFeather from 'react-native-vector-icons/Feather';

import {MaskService} from 'react-native-masked-text';
import {parseISO, format} from 'date-fns';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import {colors} from '../../styles';
import {resize} from '../../utils/font';
const {width, height} = Dimensions.get('window');

const CardInvite = ({
  title,
  max = 0,
  state,
  category,
  onPress,
  date,
  edit,
  onPressEdit,
  encerrar,
  onPressEncerrar,
  renovar,
  onPressRenovar,
}) => {
  const maskMoney = (value) => {
    return MaskService.toMask('money', value, {
      unit: 'R$',
      separator: ',',
      delimiter: '.',
      precision: 0,
    });
  };
  return (
    <View style={styles.container} onPress={onPress}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.textTitle}>{title}</Text>
        {(edit || encerrar || renovar) && (
          <>
            <Menu>
              <MenuTrigger>
                <Icon
                  name="dots-three-vertical"
                  size={23}
                  color={colors.primary}
                />
              </MenuTrigger>
              <MenuOptions style={{paddingTop: 5}}>
                {renovar && (
                  <MenuOption onSelect={onPressRenovar}>
                    <View style={styles.containerMenu}>
                      <IconFeather
                        name="repeat"
                        color={colors.primary}
                        size={20}
                      />
                      <Text style={styles.textMenu}>Renovar</Text>
                    </View>
                  </MenuOption>
                )}
                {edit && (
                  <MenuOption onSelect={onPressEdit}>
                    <View style={styles.containerMenu}>
                      <IconFeather
                        name="settings"
                        color={colors.primary}
                        size={20}
                      />
                      <Text style={styles.textMenu}>Editar</Text>
                    </View>
                  </MenuOption>
                )}

                {encerrar && (
                  <MenuOption onSelect={onPressEncerrar}>
                    <View style={styles.containerMenu}>
                      <IconFeather
                        name="thumbs-up"
                        color={colors.primary}
                        size={20}
                      />
                      <Text style={styles.textMenu}>Encerrar</Text>
                    </View>
                  </MenuOption>
                )}
              </MenuOptions>
            </Menu>
          </>
        )}
      </View>

      <View style={styles.containerValor}>
        <Text style={styles.textValor}>{maskMoney(max)}</Text>
        <Text style={styles.textOrcamento}>Orçamento Máximo</Text>
      </View>
      <View style={styles.containerData}>
        <Text style={styles.textData}>
          {date && (
            <>
              {format(parseISO(date), 'dd/MM', new Date())} às{' '}
              {format(parseISO(date), 'HH:mm', new Date())} - {state}
            </>
          )}
        </Text>
        <View style={styles.containerCategoria}>
          <Text style={styles.textCategoria}>{category}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textData: {
    color: colors.textPrimary,
    fontSize: resize(12),
    //fontFamily: 'Montserrat-Regular',
  },
  textTitle: {
    color: colors.primary,
    fontSize: resize(14),
    maxWidth: (width * 80) / 100,
    flex: 1,
    //fontFamily: 'Montserrat-SemiBold',
  },
  textValor: {
    color: 'black',
    fontSize: resize(26),
    //fontFamily: 'Montserrat-Bold',
  },
  textOrcamento: {
    color: colors.textPrimary,
    marginLeft: (width * 10) / 100,
    //fontFamily: 'Montserrat-Regular',
    fontSize: resize(12),
  },
  containerValor: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    marginTop: (height * 1) / 100,
    paddingLeft: (width * 4) / 100,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  containerData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  containerCategoria: {
    backgroundColor: '#0062FF',
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 5,
  },
  textCategoria: {
    color: 'white',
    fontSize: resize(12),
    //fontFamily: 'Montserrat-Bold',
  },
  textMenu: {
    color: colors.primary,
    fontSize: resize(14),
    //fontFamily: 'Montserrat-Regular',
    marginLeft: 10,
  },
  containerMenu: {
    marginBottom: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CardInvite;
