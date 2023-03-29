import { StyleSheet, Text, View, Image } from 'react-native'
import React, {useState,useEffect} from 'react'
import { Icon } from '@rneui/base'
import { FlatList } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { BackHandler } from 'react-native'
import { TouchableNativeFeedback } from 'react-native'
import MoreList from '../../components/MoreList'
import { editPlaylist } from '../../redux/actionsCreator/playLists_action'
import { useDispatch } from 'react-redux'
import { Alert } from 'react-native'

const PLayLIst = ({route,navigation}) => {
   
    const handleBackButtonClick = () => {
        navigation.goBack()
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

 const [playList, setplayList] = useState({...route.params.list})
 const dispatch = useDispatch()

 const [showMoreList, setshowMoreList] = useState(false)
 const list = [
    {
      icName: 'folder-video',
      icType: 'entypo',
      title: 'عرض ملاحظات الفيديو',
      onPress: () => {
        setshowMoreList(false);
        navigation.navigate('note', {data: showMoreList});
      },
    },
    {
      icName: 'playlist-add',
      icType: 'material',
      title: ' إزالة الفيديو من قائمة التشغيل',
      onPress: () => {
        console.log(playList);
       Alert.alert("!","هل تود إزالة هذا الفيديو من قائمة التشغيل؟",[
        {text:"نعم",onPress:()=> {
            const editPlayList = {...playList,list:playList.list.filter((item,index)=>item.path != showMoreList.path)}
            setplayList(editPlayList)
            editPlaylist(editPlayList,dispatch)
            setshowMoreList(false)
        }},
        {text:"لا"}
       ])
      },
    },
  ];

  return (
      <View style={{flex:1,backgroundColor:"#fff",borderTopRightRadius:20,borderTopLeftRadius:20}} >
        <View style={{padding:10,backgroundColor:"#08d",borderRadius:0,flexDirection:"row",alignItems:"center",justifyContent:'space-between'}} >
            <View style={{flexDirection:"row",alignItems:"center"}} >
                <View style={{marginHorizontal:5}}>
                  <Icon name='playlist-play' type='material' color={"#fff"} size={40} />
                </View>
                <View style={{marginHorizontal:5}}>
                  <Text style={{fontWeight:"800",fontSize:16,color:"#fff"}} > {playList.name} </Text>
                </View>
            </View>
            <Icon
                name="play-box-multiple-outline"
                type="material-community"
                containerStyle={{borderRadius: 50, overflow: 'hidden'}}
                style={{padding: 10}}
                color="#fff"
                onPress={()=>{
                    navigation.navigate('video', {video: playList.list[0], allLastVideos: playList.list});
                }}
            />
        </View>
        <View  >
           <FlatList
             data={playList.list}
             keyExtractor={(_,x)=>x.toString()}
             renderItem={({item,index})=>(
                <TouchableNativeFeedback
                key={index + 1}
                underlayColor={'#0002'}
                onPress={()=>{
                    navigation.navigate('video', {video: item, allLastVideos: playList.list});
                }}
                >
                <View style={{flexDirection: 'row-reverse', alignItems: 'center',justifyContent:"space-between",margin:5}}>
                   

                    <View style={{flexDirection:"row-reverse",alignItems:"center",flex:1}} >

                    <View style={{marginHorizontal: 0,}}>
                    <View
                        style={{
                        elevation: 5,
                        backgroundColor: '#ddd',
                        borderRadius: 10,
                        overflow: 'hidden',
                        margin: 10,
                        width:100,height:60
                        }}>
                        <Image
                        source={{uri:`file://${item?.path}`}}
                        style={{height:60, width: 100, backgroundColor: '#ffe'}}
                        />
                    </View>
                    </View>

                    <View style={{width:"70%"}}>
                      <Text style={{fontSize: 13, color: '#333', fontWeight: '600',textAlign:'left'}} numberOfLines={1}>
                        {item.filename.split(".mp4")[0]}         
                     </Text>
                    </View>

                    </View>

                    <View style={{}} >
                        <Icon
                        name="more-vertical"
                        type="feather"
                        containerStyle={{borderRadius: 50, overflow: 'hidden'}}
                        style={{padding: 10}}
                        onPress={()=>{
                            setshowMoreList(item)
                        }}
                        />
                    </View>

                </View>
            </TouchableNativeFeedback>
             )}
           />
        </View>
        <MoreList list={list} show={showMoreList} setShow={setshowMoreList} />
      </View>
  )
}

export default PLayLIst

const styles = StyleSheet.create({})