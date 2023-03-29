import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from '@react-navigation/stack'
import Home from '../screens/home/Home';
import VideoScreen from '../screens/VideoScreen/VideoScreen';
import Splash from '../screens/Splash';
import NotesVideo from '../screens/NotesScreens/NotesVideo';
import Note from '../screens/NotesScreens/Note';
import PLayLIst from '../screens/home/PLayLIst';


const stack = createStackNavigator();

const StackRoot = () => {
  return (
    <NavigationContainer>
      <StatusBar animated barStyle="light-content" backgroundColor={"#08d"} />
        <stack.Navigator
         screenOptions={{
          headerShown:false,
         }}
        >   
            <stack.Screen name='splash' component={Splash}  />
            <stack.Screen name='home' component={Home}  />
            <stack.Screen name='video' component={VideoScreen}  />
            <stack.Screen name='note' component={NotesVideo}  />
            <stack.Screen name='Note' component={Note}  />
            <stack.Screen name='playList' component={PLayLIst}  />

        </stack.Navigator>
    </NavigationContainer>
  )
}

export default StackRoot

const styles = StyleSheet.create({})