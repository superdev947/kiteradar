import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const {width, height} = Dimensions.get('window');

const invites = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.textCompro}>COMPRO</Text>
      <Text style={styles.textTitle}>
        Kiteboard DeltaPro 20 138x42cm seminova Completa
      </Text>
      <View style={styles.containerValor}>
        <Text style={styles.textValor}>R$1600</Text>
        <Text style={styles.textOrcamento}>Orçamento Máximo</Text>
      </View>
      <Text style={styles.textData}>Publicado em 21/10 às 16:09</Text>

      <Text style={styles.textCategoria}>Descrição</Text>
      <Text style={styles.textDescricao}>
        PRODUTO NOVO ORIGINAL QUALIDADE E PREÇO BAIXO NOTE FISCAL PARA CNPJ E
        CPF...
      </Text>
      <TouchableOpacity>
        <Text style={styles.textVerMais}>Ver descrição completa</Text>
      </TouchableOpacity>

      <Text style={styles.textCategoria}>Características</Text>
      <ItemCategoria titulo="Categoria" valor="Kite" />
      <ItemCategoria titulo="Ano" valor="2019" />
      <ItemCategoria titulo="Marca" valor="Ventum" />
      <ItemCategoria titulo="Modelo" valor="Teste" />
      <ItemCategoria titulo="Tipo" valor="Usado" />

      <View style={styles.containerAnunciante}>
        <View style={{flex: 1}}>
          <Text style={styles.textAnunciante}>Anunciante:</Text>
          <Text style={styles.textAnuncio}>Fulano de Tal da Silva</Text>
          <Text style={styles.textAnuncio}>Natal, Rio Grande do Norte</Text>
          <Text style={styles.textAnuncio}>CEP: 72899-000</Text>
          <Text style={[styles.textAnuncio, {fontSize: 12}]}>
            No kiteRadar desde Maio de 2021
          </Text>
        </View>
        <View style={styles.containerWhatsapp}>
          <Icon name="logo-whatsapp" size={30} color="white" />
        </View>
      </View>

      <Text style={styles.textCategoria}>Localização</Text>
      <ItemCategoria titulo="CEP" valor="26060-490" />
      <ItemCategoria titulo="Cidade" valor="Natal" />
      <ItemCategoria titulo="Estado" valor="Rio Grande do Norte" />
      <View style={{flex: 1}} />
      <TouchableOpacity style={styles.containerDenunciar}>
        <Text style={styles.textDenunciar}>
          Irregularidades?{' '}
          <Text style={{color: '#0062ff', fontWeight: 'bold'}}>Denunciar!</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const ItemCategoria = ({titulo, valor}) => (
  <View style={styles.containerItem}>
    <Text style={styles.textTituloItem}>{titulo}:</Text>
    <Text style={styles.textValorItem}>{valor}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: (width * 5) / 100,
    backgroundColor: 'white',
  },
  textAnuncio: {
    color: '#858585',
    fontSize: 14,
  },
  textAnunciante: {
    color: '#858585',
    fontSize: 18,
  },
  containerWhatsapp: {
    backgroundColor: '#11DF68',
    padding: 10,
    height: (width * 15) / 100,
    width: (width * 15) / 100,
    borderRadius: (width * 15) / 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerAnunciante: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginVertical: (height * 2) / 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textDenunciar: {
    fontSize: 14,
    color: '#858585',
  },
  containerDenunciar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textValorItem: {
    color: '#858585',
    fontSize: 14,
  },
  textTituloItem: {
    color: '#858585',
    fontSize: 14,
    marginRight: (width * 2) / 100,
    fontWeight: 'bold',
  },
  textVerMais: {
    color: '#858585',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textDescricao: {
    color: '#858585',
    fontSize: 14,
  },
  textData: {
    color: '#858585',
    fontSize: 12,
    marginBottom: (height * 2) / 100,
  },
  textValor: {
    fontSize: 26,
    color: 'black',
    fontWeight: 'bold',
  },
  textOrcamento: {
    marginLeft: (width * 10) / 100,
    color: '#858585',
    marginTop: (height * 2) / 100,
    marginBottom: (height * 1) / 100,
  },
  containerValor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerItem: {
    flexDirection: 'row',
  },
  textCategoria: {
    color: '#0062FF',
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: (height * 1) / 100,
  },
  textCompro: {
    color: '#0062FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textTitle: {
    color: '#858585',
    fontSize: 20,
    marginTop: (height * 1) / 100,
  },
});

export default invites;
