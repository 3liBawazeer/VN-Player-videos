import {StyleSheet, PermissionsAndroid, LogBox, Text,View,} from 'react-native';
import React, {useEffect,useState} from 'react';
import {Button, Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import StackRoot from './src/routes/StackRoot';
import Orientation from 'react-native-orientation-locker';
// import {AndroidPermission} from 'react-native-permissions';
import { VolumeManager } from 'react-native-volume-manager';
import store from './src/redux/store';
import SQLite from 'react-native-sqlite-storage';
import { RootSiblingParent } from 'react-native-root-siblings';
import { FlingGestureHandler,Directions ,GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated , {event, log, useAnimatedScrollHandler} from "react-native-reanimated"
import TestFunctionalty from './src/TestFunctionalty';

export const db = SQLite.openDatabase(
  {
    name: 'VCPlayer',
    location: 'default',
  },
  res => {
    console.log('OPEN DB [ VCPlayer ] SUCCFULY :::: :) ');
  },
  err => {
    console.log('OPEN DB [ VCPlayer ] ERROR :::: :( ', err.message);
  },
);


const App = () => {

  
  useEffect(() => {
    Orientation.lockToPortrait();
    VolumeManager.showNativeVolumeUI({enabled:false})
  }, []);

  LogBox.ignoreLogs([
    'Remote debugger is in a background tab which may cause apps to perform slowly',
    'Require cycle: node_modules/rn-fetch-blob/index.js',
    'Require cycle: node_modules/react-native/Libraries/Network/fetch.js',
    'Require cycle: node_modules/rn-fetch-blob/index.js -> node_modules/rn-fetch-blob/polyfill/index.js -> node_modules/rn-fetch-blob/polyfill/Blob.js -> node_modules/rn-fetch-blob/index.js',
  ]);

    return (
       
      <RootSiblingParent>
        <StoreProvider store={store}>
          <PaperProvider>
            <StackRoot />
            {/* <TestFunctionalty/> */}
          </PaperProvider>
      </StoreProvider>
     </RootSiblingParent>
    );
};

export default App;

const styles = StyleSheet.create({
  box:{
    height:200,
    width:200,
    backgroundColor:"#08d"
  }
});
