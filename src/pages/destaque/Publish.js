import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  PermissionsAndroid,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
// import * as ImagePicker from 'expo-image-picker'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {Button, ModalAddPhoto, Input, TextArea} from '../../components';
import {colors} from '../../styles';
import api from '../../services/api';
import { setSpotlights } from '../../store/modules/spotlights/actions';
const {width, height} = Dimensions.get('window');

const Publish = ({navigation}) => {
  const { user } = useSelector((store) => store.user);
  const [photo, setPhoto] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [modalFoto, setModalFoto] = useState(false);
  const dispatch = useDispatch();

  const loadList = () => {
    api
      .get(`spotlights`)
      .then((resp) => {
        dispatch(setSpotlights(resp.data));
      })
      .catch((error) => {
      });
  };

  const onPublish = () => {
    const formData = new FormData();
    formData.append('file', {
      uri: photo, 
      type: "image/png", 
      name: (new Date()).valueOf()+'.png',
    })
    api
      .post(`files`,formData)
      .then((file) => {
        if(photo&&title&&description&&location)
          api
            .post(`spotlights`,{
              id_user : user.id,
              title,
              description,
              spotlight_at:new Date(),
            })
            .then((spotlightData) => {
              if(file.data.id&&spotlightData.data.id)
                api
                  .post(`/spotlights/photos/`,{
                    id_file : file.data.id,
                    id_spotlight : spotlightData.data.id
                  })
                  .then((resp) => {
                    console.log('resp.data', resp.data)
                    navigation.goBack();
                  }).catch((error) => {
                    console.log('sssssserror')
                    console.log(error)
                  });
            })
            .catch((error) => {
              console.log(error)
            });
      })
      .catch((error) => {
        console.log(error)
      });
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  const onPresslaunchCamera = () => {
    if (requestCameraPermission()) {
      setModalFoto(false);
      const options = {mediaType: 'photo'};
      launchCamera(options, (resp) => {
        if (resp.fileName && resp.uri) {
          setPhoto(result.uri)
        }
      });
    } else {
      Alert.alert(
        displayName,
        'Você precisa fornecer a permissão de camera para usar essa função',
      );
    }
  };
  const onPresslaunchGallery = () => {
    setModalFoto(false);
    const options = {mediaType: 'photo'};
    launchImageLibrary(options, (resp) => {
      if (resp.fileName && resp.uri) {
        setPhoto(result.uri)
      }
    });
  };
  // const onPresslaunchCamera = async () => {
  //   setModalFoto(false);
  //   try{
  //     let result = await ImagePicker.launchCameraAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //     })
  //     if(!result.cancelled) {
  //       setPhoto(result.uri)
  //     }
  //   }catch(e){console.log(e)}
  // };

  // const onPresslaunchGallery = async () => {
  //   setModalFoto(false);
  //   try{
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //     })
  //     if(!result.cancelled) {
  //       setPhoto(result.uri)
  //     }
  //   }catch(e){console.log(e)}
  // };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        enabled={true}
        behavior="position"
        contentContainerStyle={{flexGrow: 1}}>
        {
          photo?
          <TouchableOpacity onPress={()=>setPhoto()} style={[[styles.cameraCover, {overflow:'hidden'}]]}>
            <Image source={{uri:photo}} style={[styles.cameraPhoto]}/>
          </TouchableOpacity>:
          <View style={[styles.cameraCover]}>
            <TouchableOpacity onPress={()=>setModalFoto(true)}>
              <Image source={require('../../assets/imgs/cameraIcon.png')} style={[styles.cameraIcon]}/>
            </TouchableOpacity>
          </View>
        }
        <Input
          value={title}
          onChangeText={e=>setTitle(e)}
          placeholder="Título"
          style={{marginTop:10}}
        />
        <TextArea
          value={description}
          changeText={e=>setDescription(e)}
          placeholder="Escreva uma resenha...."
          style={{marginTop:10, paddingTop:10}}
        />
        <Input
          value={location}
          onChangeText={e=>setLocation(e)}
          placeholder="Adicionar localização"
          style={{marginTop:10}}
        />
        <View style={{flex:1}}/>
        <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:10, marginTop:10}}>
          <Button title="Descartar" style={{backgroundColor: colors.delete, width:'49%'}} onPress={navigation.goBack}/>
          <Button title="Enviar" onPress={onPublish} style={{width:'49%'}}/>
        </View>
        <ModalAddPhoto
          visible={modalFoto}
          setVisible={() => setModalFoto(false)}
          onPresslaunchCamera={onPresslaunchCamera}
          onPresslaunchGallery={onPresslaunchGallery}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: (width * 5) / 100,
    paddingVertical: (height * 2) / 100,
    flexGrow: 1,
  },
  cameraPhoto:{
    height:(width * 40) / 100,
    width:'100%',
    resizeMode:'contain'
  },
  cameraIcon:{
    width:(width * 10) / 100,
    height:(width * 10) / 100,
    resizeMode:'contain'
  },
  cameraCover:{
    width:'100%',
    height:(height * 30) / 100,
    borderRadius:5,
    borderColor:colors.textPrimary,
    borderWidth:1,
    justifyContent:'center',
    alignItems:'center',
  },
});

export default Publish;