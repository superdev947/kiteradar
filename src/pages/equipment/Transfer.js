import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, Alert} from 'react-native';
import {MaskService} from 'react-native-masked-text';
import {useSelector} from 'react-redux';
import {StackActions} from '@react-navigation/routers';

import {Button, Input, TextArea, Picker} from '../../components';
import {colors} from '../../styles';
import api from '../../services/api';
import {displayName} from '../../../app.json';

const {width, height} = Dimensions.get('window');

const motivos = [
  {
    value: 'Doação',
    label: 'Doação',
  },
  {
    value: 'Presente',
    label: 'Presente',
  },
  {
    value: 'Comprou meu equipamento',
    label: 'Comprou meu equipamento',
  },
];

const equipment = ({route, navigation}) => {
  const {item} = route.params;

  const [cpf, setCpf] = useState('');
  const [observacao, setObservacao] = useState('');
  const [motivo, setMotivo] = useState(motivos[0].value);
  const [novoProprietario, setNovoProprietario] = useState();
  const [loading, setLoading] = useState(false);

  const {user} = useSelector((store) => store.user);

  useEffect(() => {
    if (cpf.length === 14) {
      loadCPF();
    } else {
      setNovoProprietario(null);
    }
  }, [cpf]);

  const loadCPF = () => {
    api
      .get('user?cpf=' + cpf)
      .then((resp) => {
        
        if (resp.data) {
          setNovoProprietario(resp.data);
        } else {
          Alert.alert(displayName, 'Usuário não encontrado');
        }
      })
      .catch((error) => {
        console.log('error', error);
        Alert.alert(displayName, 'Usuário não encontrado');
      });
  };
  const maskCPF = (text) => {
    return MaskService.toMask('cpf', text);
  };

  const validateForm = () => {
    if (!novoProprietario) return false;
    if (observacao.length === 0) return false;
    if (motivo.length === 0) return false;
    return true;
  };

  const register = () => {
    if (novoProprietario.id === user.id)
      return Alert.alert(displayName, 'Você não pode transferir para si mesmo');
    setLoading(true);
    api
      .post('equipment/transfer', {
        id_current_owner: novoProprietario.id,
        id_previous_owner: user.id,
        id_equipment: item.id,
        observation: observacao,
        reason: motivo,
      })
      .then((resp) => {
        setLoading(false);
        
        navigation.dispatch(StackActions.replace('Drawer'));
        Alert.alert(displayName, 'Equipamento transferido com sucesso');
      })
      .catch((error) => {
        console.log('error', error);
        setLoading(false);
        Alert.alert(
          displayName,
          'Não foi possível transferir esse equipamento. Tente mais tarde',
        );
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Para quem você quer transferir?</Text>
      <Input
        label="CPF"
        style={styles.input}
        value={cpf}
        onChangeText={(text) => setCpf(maskCPF(text))}
        keyboardType="numeric"
      />
      <Picker
        label="Motivo da transferência"
        value={motivo}
        changeValue={(e) => setMotivo(e)}
        items={motivos}
      />
      {novoProprietario && (
        <>
          <Text style={styles.textNewProprietary}>Novo Proprietário</Text>
          <ItemInformation title="Nome" description={novoProprietario.name} />
          <ItemInformation title="CPF" description={novoProprietario.cpf} />
        </>
      )}
      <TextArea
        label="Observação"
        value={observacao}
        changeText={(text) => setObservacao(text)}
      />
      <View style={{flex: 1}} />
      <Button
        title="Transferir"
        disabled={!validateForm()}
        loading={loading}
        onPress={register}
      />
    </View>
  );
};

const ItemInformation = ({title, description}) => (
  <View style={styles.row}>
    <View style={styles.item}>
      <Text>{title}:</Text>
    </View>
    <View style={styles.item}>
      <Text style={{color: colors.textPrimary}}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: (5 * width) / 100,
    paddingVertical: (height * 2) / 100,
    backgroundColor: 'white',
  },
  textTitle: {
    textAlign: 'center',
    fontSize: 25,
  },
  input: {
    marginTop: 10,
  },
  textNewProprietary: {
    fontSize: 18,
    marginTop: (height * 2) / 100,
    marginBottom: (height * 1) / 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
  },
});

export default equipment;
