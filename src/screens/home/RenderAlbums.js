import { BackHandler, StyleSheet, Text, View } from 'react-native'
import React, { useState , useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TouchableOpacity } from 'react-native'
import { Image } from '@rneui/base'
import { FlatList } from 'react-native'
import { convertDurationToTime } from "../../components/time"
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNFetchBlob from 'rn-fetch-blob'
import { useNavigation } from '@react-navigation/native'
import { getlastVideoReduser } from '../../redux/slices/database_slice'
import { videoExtentions } from '../../assets/videoEXt'

const RenderAlbums = ({videosAlbum,setvideosAlbum}) => {


    // Back Handler Function 

    const handleBackButtonClick = () => { 
        console.log("hello");
        return true
     }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
          BackHandler.removeEventListener(
            'hardwareBackPress',
            handleBackButtonClick,
          );
        };
      }, []);

      // Back Handler Function 

    const { allAlbums } = useSelector(o=>o.storageData)
    const navigation = useNavigation()
    const dispach = useDispatch()
    // All Albums Names
    // videos of Albums on select it

    const EnterToVideo = async (data) => { 
        try {
            await AsyncStorage.setItem('lastVideo', JSON.stringify({video: data,seek:{currentTimer:0}}));
            dispach(getlastVideoReduser({video: data}));
            const pth = data.path.replace("file:///","")
            RNFetchBlob.fs.lstat(pth).then(res => {
            // const videos = res.filter(item => videoExtentions(item.filename));
            // const video = videos.find(itm => itm.filename == data.filename);
            navigation.navigate('video',{video: data, allLastVideos: videosAlbum,});
            });
        } catch (error) {
            console.log(error);
        }
     }
    


  return (
    <View style={{}}>
      {videosAlbum.length <= 0 
      ? <FlatList
            data={allAlbums}
            keyExtractor={(_,x)=>x.toString()}
            numColumns={3}
            contentContainerStyle={{paddingVertical:10}}
            renderItem={({item,index})=>(
                <TouchableOpacity style={styles.card} onPress={()=>setvideosAlbum(item.videos)} >
                    <Image source={{uri:item.videos[0].path}} style={{width:120,height:120,borderWidth:0.5,borderColor:"#08d5",borderRadius:10}} />
                    <View style={styles.containerText} >
                        <Text style={styles.cardTitle} numberOfLines={1} >{item.groupName}</Text>
                        <Text style={styles.cardbadge} > {item.videos.length} فيديو </Text>
                    </View>
                </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            />
     : <FlatList
            data={videosAlbum}
            numColumns={3}
            keyExtractor={(_,x)=>x.toString()}
            renderItem={({item,index})=>(
            <TouchableOpacity style={styles.video} onPress={()=>{EnterToVideo(item)}}  >
                <View style={{width:120,height:120,}} >
                  <Image source={{uri:item.path}} style={{width:120,height:120,borderWidth:0.5,borderColor:"#08d5",borderRadius:5}} />
                {item.duration&&<Text style={styles.floatDuration} >{convertDurationToTime(item.duration)}</Text>}
                </View>
                <View style={styles.containerText} >
                    <Text style={styles.videoTitle} numberOfLines={2} > {item.videoName} </Text>
                    {/* <Text style={styles.videobadge} > {item.videos.length} فيديو </Text> */}
                </View>
            </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            />
    
    }
    </View>
  )
}

export default RenderAlbums

const styles = StyleSheet.create({
    card:{
        // elevation:10,
        backgroundColor:"#fff",
        borderRadius:10,
        overflow:"hidden",
        alignItems:"center",
        flex:1,
    },
    cardTitle:{
        textAlign:"left",
        color:"#333",
        fontSize:11,
        fontWeight:"700"
    },
    cardbadge:{
        textAlign:"left",
        color:"#3338",
        fontSize:11,
    },
    containerText:{
        margin:5,
        width:120,
    },
    video:{
        backgroundColor:"#fff",
        borderRadius:10,
        overflow:"hidden",
        alignItems:"center",
        flex:1
    },
    videoTitle:{
        textAlign:"left",
        color:"#333",
        fontSize:10,
        fontWeight:"700"
    },
    videobadge:{
        textAlign:"left",
        color:"#3338",
        fontSize:11,
    },
    floatDuration:{
        backgroundColor:"#0004",
        color:"#fff",
        fontWeight:"800",
        letterSpacing:1,
        fontSize:12,
        position:"absolute",
        padding:3,
        bottom:4,
        left:4,
        borderRadius:5
    }
})