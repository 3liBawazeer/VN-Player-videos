import {
  Alert,
  Text,
  View,
  StatusBar,
  Pressable,
  Dimensions,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState, useLayoutEffect} from 'react';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import Slider from '@react-native-community/slider';
import {Icon} from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import AddNote from './AddNote';
import { saveNewNote } from '../../redux/actionsCreator/saveNewNote';
import { ActivityIndicator } from 'react-native';
import uuid from 'react-native-uuid';
import { TapGestureHandler } from "react-native-gesture-handler"
import DisplayNotes from './DisplayNotes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getlastVideoReduser } from '../../redux/slices/database_slice';
const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;



const VideoScreen = ({navigation, route}) => {
  
  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);
    var hDisplay = h == 0 ? '' : h + ':';
    var mDisplay = m < 9? "0"+ m + ':' : m + ':';
    var sDisplay = s;
  
    return hDisplay + mDisplay + sDisplay;
  }
 
  const {video , allLastVideos, seek } = route?.params;
 
  const videoRef = useRef();
  const TapRefLeft = useRef()
  const TapRefLeft1 = useRef()
  const TapRefRight = useRef()
  const TapRefRight1 = useRef()
  const [videoIndex, setvideoIndex] = useState(0)
  const [loading, setloading] = useState(true)
  const [rate, setrate] = useState(1.0)

  useEffect(() => {
    StatusBar.setHidden(true,"fade")
    return () => {
         StatusBar.setHidden(false,"fade")
         console.log("go to gnahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
    }
  }, [])

  

  useEffect(() => {
    getIndexOfVideo()
  }, [currentTime])
  

   const getIndexOfVideo = () => { 
    const ix = allLastVideos.indexOf(video)
    setvideoIndex(ix)
   }

    const stepforward = () => { 
      if (videoIndex < allLastVideos.length - 1) {
        setvideoIndex(o=>o+1)
      }else{

      }
    }
    const stepbackward = () => { 
      if (videoIndex != 0) {
        setvideoIndex(o=>o - 1)
      } else{
        if (currentTime > 3) {
          videoRef.current.seek(0);
          setCurrentTime(0)
        }else{

        }
      }
     }


  const dispach = useDispatch()
  const {} = useSelector(o=>o.video)

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setduration] = useState(1);
  const [pauseded, setpauseded] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [startSeek, setstartSeek] = useState(false);
  const [lock, setlock] = useState(false)
  const [showModalAddNote, setshowModalAddNote] = useState(null)
  const [showTool, setshowTool] = useState(true)
  const [showRate, setshowRate] = useState(false)
  const [showModalDosplayNotes, setshowModalDosplayNotes] = useState(null)
  const onFullScreen = () => {
    if (!isFullScreen) {
      Orientation.lockToLandscape();
    } else {
      if (Platform.OS === 'ios') {
        Orientation.lockToPortrait();
      }
      Orientation.lockToPortrait();
    }
    setIsFullScreen(!isFullScreen);
  };
  
  
  function handleBackButtonClick() {
    if(lock){
    }else{
      dispach(getlastVideoReduser({video: allLastVideos[videoIndex],currentTimer:currentTime}))
      AsyncStorage.setItem('lastVideo', JSON.stringify({video: allLastVideos[videoIndex],currentTimer:currentTime})).then(()=>{
        StatusBar.setHidden(false,"fade")
        setlock(false)
        setshowTool(false)
        console.log({video: allLastVideos[videoIndex],currentTimer:currentTime});
        navigation.goBack()
      })
      
    }
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
    
  }, [currentTime]);


   const addNote = (data) => {
        
        let noteI = uuid.v4() 
        const videoData = {
          currentTimer:currentTime,
          id:video.lastModified,
          path:video.path,
          title:data.title,
          content:data.content,
          noteId: noteI || currentTime * 5 + "-" + video.lastModified  ,
        }
        saveNewNote(videoData,dispach)
        setshowModalAddNote(false)
        setpauseded(false)
   }


   useLayoutEffect(()=>{
     if (seek && videoRef) {
      
     const clearout =  setTimeout(() => {
        videoRef.current.seek((seek.currentTimer / duration) * duration);
        setpauseded(false)
        setloading(false)
      }, 500);
      return () => {
        clearTimeout(clearout)
       }
    } else {
      setloading(false)
      setpauseded(false)
    }
   
  },[videoRef])


 const doubleTabincrease = () => { 
  let t = currentTime + 5.0
  videoRef.current.seek(t);
  setCurrentTime(t)
  }

  const doubleTabdecrease = () => { 
    let t = currentTime - 5.0
    videoRef.current.seek(t);
    setCurrentTime(t)
    }
  
  const singleTab = () => { 
    if (!lock && !showTool) {
      setshowTool(true)
      return;
    }
    if (!lock && showTool) {
      setshowTool(false)
    }
   }

  return (
    <View style={{flex: 1}}>
      
         {lock&&<View style={{marginHorizontal:20,position:"absolute",zIndex:2,}} >
          <Icon
            name={"unlock"}
            type={'font-awesome-5'}
            color={'#fff'}
            size={20}
            containerStyle={{backgroundColor:"#fff4",borderRadius:50,overflow:"hidden",zIndex:10}}
            style={{padding:15,borderRadius:50}}
            onPress={() => {
              setshowTool(true)
              setlock(false)
            }}
          /></View>}
      <Pressable style={{backgroundColor: '#000', flex: 1,}} 
      // onPress={lock?null:()=>{setshowTool(true)}}
       >
       <View style={{width:"100%",height:"100%",flexDirection:"row",position:"absolute",zIndex:11}} >
        <TapGestureHandler waitFor={TapRefRight1}   onActivated={singleTab} >
                        <TapGestureHandler numberOfTaps={2} onActivated={doubleTabincrease} ref={TapRefRight1} >
                          <View style={{flex:1,zIndex:1}} />
                        </TapGestureHandler>
          </TapGestureHandler>
          <TapGestureHandler waitFor={TapRefLeft1}   onActivated={singleTab} >
                          <TapGestureHandler numberOfTaps={2} onActivated={doubleTabdecrease} ref={TapRefLeft1} >
                          <View style={{flex:1,zIndex:1}} />
                          </TapGestureHandler>
            </TapGestureHandler>
       </View>
        <Video
          source={{uri: 'file://' + allLastVideos[videoIndex]?.path}}
          ref={videoRef} // Store reference
          onLoad={({duration}) =>{ setduration(duration);}}
          onProgress={({currentTime}) => setCurrentTime(currentTime) }
          resizeMode="contain"
          fullscreenAutorotate
          rate={rate}
          repeat
          onError={(err) => {Alert.alert(err)}} // Callback when video cannot be loaded
          style={styles.backgroundVideo}
          paused={pauseded}
          mixWithOthers="duck"
        />
          
      </Pressable>

      {/* <Modal 
            visible={showTool} 
            transparent 
            animationType='fade'
            onRequestClose={backFun}
      >    */}
         { showTool && !lock  && 
          <Pressable
            // onPress={()=>{setshowTool(false)}}
            style={[StyleSheet.absoluteFill, {backgroundColor: '#0005', flex: 1,zIndex:10}]}
            >

              {/* header  */}
            <View style={{backgroundColor: '#0000'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>

                <View style={{flex:1,marginHorizontal:10}} >
                    <Text style={{color:"#fff",fontSize:15,fontWeight:"700"}} numberOfLines={2} > {allLastVideos[videoIndex]?.filename.split(".mp4")[0]}  </Text>
                </View>

                <Icon
                  name="arrowleft"
                  type="ant-design"
                  color="#fff"
                  style={{padding:10,}}
                  size={25}
                  onPress={() => {
                    AsyncStorage.setItem('lastVideo', JSON.stringify({video: allLastVideos[videoIndex],currentTimer:currentTime})).then(()=>{
                      StatusBar.setHidden(false,"fade")
                      setlock(false)
                      setshowTool(false)
                      dispach(getlastVideoReduser({video: allLastVideos[videoIndex],currentTimer:currentTime}))
                      navigation.goBack()
                      console.log(allLastVideos[videoIndex]);
                    })
                  }}
                />
              </View>
            </View>

             {/* tool bar */}

            <View style={{flexDirection:"row",}} >
                <TouchableOpacity 
                style={{
                  overflow:"hidden",
                  backgroundColor:showRate?"#fff2":"#0008",
                  borderRadius:100,
                  margin:5,
                  alignItems:"center",
                  justifyContent:"center"
                }} 
                onPress={()=>{setshowRate(true)}}
                >
                  <Text style={{color:"#fff",padding:10,paddingHorizontal:12}}>
                     {rate}X
                  </Text>
                </TouchableOpacity>
                <View style={{
                  overflow:"hidden",
                  backgroundColor:"#0005",
                  borderRadius:100,
                  margin:5,
                  alignItems:"center",
                  justifyContent:"center"
                }} >
                  <Icon
                      name="note-plus"
                      type="material-community"
                      color="#fff"
                      style={{padding:10,}}
                      size={25}
                      onPress={()=>{
                        setpauseded(true);
                        setshowModalAddNote(currentTime)
                      }}
                    />
                </View>
                <View style={{
                  overflow:"hidden",
                  backgroundColor:"#0005",
                  borderRadius:100,
                  margin:5,
                  alignItems:"center",
                  justifyContent:"center"
                }} >
                  <Icon
                      name="view-dashboard-edit"
                      type="material-community"
                      color="#fff"
                      style={{padding:10,}}
                      size={25}
                      onPress={() => {
                        setpauseded(true)
                        setshowModalDosplayNotes(allLastVideos[videoIndex])
                      }
                      }
                    />
                </View>
            </View>

            { showRate ? <Pressable style={[StyleSheet.absoluteFill, {zIndex:10,backgroundColor:"#0000",position:"absolute",}]} 
           onPress={()=>{
            setshowRate(false)
            setshowTool(true)
           }}
          >
            <View style={{alignItems:"center",marginTop:150}} >
              <View style={{backgroundColor:"#0005",borderRadius:10,padding:10,width:350,}} >
                
                <View style={{flexDirection:"row",alignItems:'center',justifyContent:"space-between"}} >
                
                  <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",flex:1}} >
                    <Icon name='plus' type='ant-design' color="#fff" style={{backgroundColor:"#333",padding:5,borderRadius:50}}
                      onPress={()=>setrate(o=> o < 5 ? o+0.5 : o)}
                    />
                      <Text style={{color:"#fff",padding:5,paddingHorizontal:12,flex:1,textAlign:"center",fontSize:20}}>
                        {rate}X
                      </Text>
                    <Icon name='minus' type='ant-design' color="#fff" style={{backgroundColor:"#333",padding:5,borderRadius:50}} 
                      onPress={()=>setrate(o=> o > 0.5 ? o-0.5:o)}
                    />
                  </View>
                  
                </View>
              <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}} >
              <Icon name='refresh' type='material' color="#fff" style={{padding:5}} />
                  <View style={{flex:1}}>
                    <Slider
                        style={{width: '100%'}}
                        value={rate}
                        step={0.5}
                        minimumValue={0.5}
                        maximumValue={5.0}
                        onValueChange={(d)=>{
                          setrate(d)
                        }}
                        minimumTrackTintColor="#fff"
                        maximumTrackTintColor="#fff"
                        thumbTintColor='#fff'
                      />
                  </View>
              </View>
              </View>
            </View>
            </Pressable>:<></>}
            

                    <View style={{flex: 1,flexDirection:"row",}} >
                      <TapGestureHandler waitFor={TapRefLeft}   onActivated={singleTab} >
                                    <TapGestureHandler numberOfTaps={2} onActivated={doubleTabincrease} ref={TapRefLeft} >
                                    <View style={{flex:1}} />
                                    </TapGestureHandler>
                      </TapGestureHandler>
                      <TapGestureHandler waitFor={TapRefRight}   onActivated={singleTab} >
                                    <TapGestureHandler numberOfTaps={2} onActivated={doubleTabdecrease} ref={TapRefRight} >
                                    <View style={{flex:1}} />
                                    </TapGestureHandler>
                      </TapGestureHandler>
                        {loading&&<View style={{position:"absolute",top:"45%",left:"42%",backgroundColor:"#0005",padding:10,borderRadius:10}} ><ActivityIndicator color={"#fff"} size={50}  /></View>}
                    </View>

            {/* footer */}

            <View
              style={{
                backgroundColor: '#0000',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                // padding: 10,
              }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: 10,
                  }}>
                  <Text style={{color: '#fff', fontSize: 10}}>
                    {secondsToHms(duration)}
                  </Text>
                  <Text style={{color: '#fff', fontSize: 10}}>
                    {secondsToHms(currentTime)}
                  </Text>
                </View>
              <View style={{flex: 1,marginBottom:15}}>
                
                <View>
                  <Slider
                    style={{width: '100%'}}
                    value={(currentTime / duration)}
                    thumbTintColor="#08dd"
                    renderToHardwareTextureAndroid
                    minimumTrackTintColor="#08d"
                    maximumTrackTintColor="#d55"
                    onSlidingStart={x => {
                      setstartSeek(true);
                      setpauseded(true);
                    }}
                    onSlidingComplete={x => {
                      videoRef.current.seek(x * duration);
                      setstartSeek(false);
                      setpauseded(false);
                    }}
                    onValueChange={d => {
                      if (startSeek) {
                        videoRef.current.seek(d * duration);
                      }
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical:5
                }}>
                <View style={{flex: 1}}>
                <Icon
                  name="screen-rotation"
                  type="material"
                  color={'#fff'}
                  style={{padding:10,borderRadius:50}}
                  onPress={() => {
                    onFullScreen();
                  }}
                />
                </View>
                <View style={{flex: 6,alignItems:"center",flexDirection:"row",justifyContent:"space-evenly"}}>
                <Icon
                    name={"ios-play-skip-forward"}
                    type={'ionicon'}
                    color={'#fff'}
                    size={25}
                    style={{padding:10,paddingHorizontal:15,borderRadius:10}}
                    onPress={stepforward}
                  />
                  <Icon
                  name={pauseded ? 'play' : 'pause'}
                  type={'font-awesome-5'}
                  color={'#fff'}
                  size={25}
                  style={{padding:10,paddingHorizontal:15,borderRadius:10}}
                  onPress={() => {
                    setpauseded(o => !o);
                  }}
                />
                  <Icon
                    name={"ios-play-skip-back"}
                    type={'ionicon'}
                    color={'#fff'}
                    size={25}
                    style={{padding:10,paddingHorizontal:15,borderRadius:10}}
                    onPress={stepbackward}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Icon
                    name={"lock"}
                    type={'font-awesome-5'}
                    color={'#fff'}
                    size={20}
                    style={{padding:10,borderRadius:50}}
                    onPress={() => {
                      setshowTool(false)
                      setlock(true)
                    }}
                  />
                </View>
              </View>
            </View>

          </Pressable>
          }

          
      {/* </Modal> */}


      <AddNote show={showModalAddNote} setShow={setshowModalAddNote} onEndRequist={addNote} />
      <DisplayNotes show={showModalDosplayNotes}  setshow={setshowModalDosplayNotes} navigation={navigation}
       seekOn={(dataseek)=>{
        const clearout =  setTimeout(() => {
          videoRef.current.seek((dataseek.currentTimer / duration) * duration);
          setpauseded(false)
          setshowModalDosplayNotes(null)
        }, 500);
       }}
      />
    </View>
  );
};

export default VideoScreen;

var styles = StyleSheet.create({
  backgroundVideo: {
    width: '100%',
    height: '100%',
  },
  mediaControls: {
    width: screenHeight - 170,
    height: '100%',
    flex: 1,
    alignSelf:
      Platform.OS === 'android'
        ? screenHeight < 800
          ? 'center'
          : 'flex-start'
        : 'center',
  },
  backgroundVideoFullScreen: {
    height: screenHeight,
    width: screenWidth,
  },
});
