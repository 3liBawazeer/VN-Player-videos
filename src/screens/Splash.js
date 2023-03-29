import {
  StyleSheet,
  PermissionsAndroid,
  LogBox,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon} from '@rneui/themed';
import {useDispatch, useSelector} from 'react-redux';
import {createTables} from '../redux/slices/database_slice';
import {getAllNotesData} from '../redux/actionsCreator/getAllNotesData';
import {getlastVideo} from '../redux/actionsCreator/getlastVideo';
import {getPLaylists} from '../redux/actionsCreator/playLists_action';
import {CameraRoll, useCameraRoll} from '@react-native-camera-roll/camera-roll';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import RNFetchBlob from 'rn-fetch-blob';
import { getStartingAsync } from '../redux/slices/getStarting';
const Splash = ({navigation}) => {
  LogBox.ignoreLogs([
    'Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle.',
    'Require cycle: node_modules\rn-fetch-blobindex.js -> node_modules\rn-fetch-blobpolyfillindex.js -> node_modules\rn-fetch-blobpolyfillFetch.js -> node_modules\rn-fetch-blobindex.js',
  ]);

  const dispach = useDispatch()
  const { loading , getData } = useSelector(o=>o.DB)
  const { storageLoading } = useSelector(o=>o.storageData)
  const [hasPermision, sethasPermision] = useState(false);

  useEffect(() => {
    getPer().then(()=>{
      dispach(getStartingAsync())
      dispach(createTables())
      getPLaylists(dispach)
      getAllNotesData(dispach)
      getlastVideo(dispach)
    })
  }, [])
  

  useEffect(() => {
      chackBeforeNavigation()
      console.log(getData,"<==getData");
      console.log(hasPermision,"<==hasPermision");
      console.log(storageLoading,"<==storageLoading");
    }, [getData,hasPermision,storageLoading])



  const getPer = async () => {
    let permissions = [
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ];
    let status = await PermissionsAndroid.requestMultiple(permissions);
    if ((status = PermissionsAndroid.RESULTS.GRANTED)) {
      sethasPermision(true);
    } else {
      // Not granted
    }
  };

     const chackBeforeNavigation = () => {
      if (getData && hasPermision && storageLoading) {
          navigation.replace("home")
        }
     }


  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          backgroundColor: '#fff',
        }}>
        <TouchableOpacity onPress={() => getFolders()}>
          <Image
            source={require('../assets/VN_LOGO.png')}
            style={{transform: [{scale: 0.3}]}}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{padding: 10, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            color: '#08d',
            fontWeight: 'bold',
            padding: 5,
            fontSize: 20,
            letterSpacing: 2,
          }}>
          {' '}
          VN <Text style={{fontWeight: '100'}}>PLAYER</Text>{' '}
        </Text>
        <Text
          style={{
            color: '#08d3',
            fontWeight: 'bold',
            padding: 5,
            fontSize: 10,
          }}>
          {' '}
          Video Notes Player development by Ali Bawazir (✿◡‿◡){' '}
        </Text>
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({});
