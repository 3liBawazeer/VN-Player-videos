import {
    Image,
    Text,
    View,
    FlatList,
    TextInput,
    StyleSheet,
    Dimensions,
    BackHandler,
    ActivityIndicator,
    PermissionsAndroid,
    TouchableOpacity,
    LogBox,
    NativeModules,
    ScrollView,
    Modal,
    Alert,
  } from 'react-native';
  import React, {useEffect, useRef, useState , memo } from 'react';
  import RNFetchBlob from 'rn-fetch-blob';
  import {Button, Icon} from '@rneui/themed';
  import {useDispatch, useSelector} from 'react-redux';
  import MoreList from '../../components/MoreList.js';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { getlastVideoReduser } from '../../redux/slices/database_slice.js';
  import { Toaster } from '../../components/Toaster.js';
  import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { TouchableNativeFeedback } from 'react-native';
import { startCopyFile, startcutFile } from '../../redux/slices/fileManager_slice.js';
import { copyFilesAction, cutFilesAction, deleteFile, makeDirAction } from '../../redux/actionsCreator/copyAndCutFiles.js';
import { videoExtentions } from '../../assets/videoEXt.js';

  const {height, width} = Dimensions.get('window');

const RenderFoldersAndVideos = ({data,navigation,onRefresh,refreshing,currentPath,onEnter,setshowMoreList,setcurrentPath,setfilesSelected,filesSelected,isSelector,setisSelector,Folders}) => {


  const dispach = useDispatch()
  const [isSel, setisSel] = useState(false)
  const {isCopy,isCut,files,From} = useSelector(o=>o.fileM)
  const [newDirName, setnewDirName] = useState("")
  const [showModalMakeDir, setshowModalMakeDir] = useState(false)

    const onSelectFile = item => {
        setisSelector(true);
        !(isCopy || isCut) && setfilesSelected([...filesSelected, item]);
      };

    const onPressFile = data => {
        if (isSelector) {
        const one = filesSelected.find(ite => ite == data);
        if (one) {
            const filrOne = filesSelected.filter(ite => ite !== data);
            if (filrOne.length == 0) {
            setisSelector(false);
            }
            setfilesSelected(filrOne);
            return;
        }
        setfilesSelected([...filesSelected, data]);
        } else {
            onEnter(data)
        }
    };

  return (<>
  {/* <Button title="get" onPress={()=>{
    console.log(data);
  }} ></Button> */}
    <FlatList
        data={(isCopy || isCut)?Folders:data}
        keyExtractor={(_, x) => x.toString()}
        onRefresh={onRefresh}
        refreshing={refreshing}
        initialNumToRender={10}
        renderItem={({item, index}) => {
          if (!videoExtentions(item.filename)){ return (
            <>
                <TouchableNativeFeedback
                  onLongPress={ (isCopy || isCut) ? null : () => {onSelectFile(item);setisSel(true)}}
                  onPress={() => {(isCopy || isCut) && isSel?null:onPressFile(item)}}
                  onPressOut={()=>{setisSel(false)}}
                  // onPress={()=>{console.log(item);}}
                  >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: filesSelected.includes(item) ? '#eef' : null,
                    }}>

                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 16, color: '#333', fontWeight: '600',marginHorizontal:10,textAlign:"right"}} numberOfLines={2} >
                          {item.filename} 
                        </Text>
                        {/* This is info under the filename */}
                       <View style={{flexDirection:"row-reverse",marginHorizontal:15}} >

                        {!(isCopy || isCut) &&  item.folders.length >= 1 && 
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}} >
                            <Text style={{fontSize: 12, color: '#08d4', fontWeight: '600',marginHorizontal:15,textAlign:"right"}} numberOfLines={2} >
                              {item.folders.length}
                            </Text> 
                            <Icon name='folder' type='entypo' size={15} color="#08d4" containerStyle={{marginHorizontal:-7}} />
                        </View>}

                        {!(isCopy || isCut) && item.videos.length >= 1 && 
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}} >
                            <Text style={{fontSize: 12, color: '#08d4', fontWeight: '600',marginHorizontal:15,textAlign:"right"}} numberOfLines={2} >
                              {item.videos.length}
                            </Text> 
                            <Icon name='folder-video' type='entypo' size={15} color="#08d4" containerStyle={{marginHorizontal:-7}} />
                        </View>}

                       </View>
                    </View>
        
                    <View style={{marginHorizontal: 5,alignItems:'center',justifyContent:"center"}}>
                      <Icon name="folder" color={'#08d2'} size={90} />
                     {!(isCopy || isCut) && <Image source={{uri:item.content[0].path}} style={{width:50,height:40,position:"absolute",borderRadius:10,top:"33%",left:"23%",opacity:0.8}} />}
                    </View>

                  </View>
                </TouchableNativeFeedback>
              </>

                ); } else { return (
                  
                  !(isCopy || isCut) && <TouchableNativeFeedback
                  key={index + 1}
                  onLongPress={(isCopy || isCut) ? null : () => {onSelectFile(item);setisSel(true)}}
                  onPress={() => {(isCopy || isCut) && isSel?null:onPressFile(item)}}
                  // onPress={()=>{console.log(item);}}
                  onPressOut={()=>{setisSel(false)}}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center',backgroundColor: filesSelected.includes(item) ? '#eef' : null,}}>
                       {  <Icon
                        name="more-vertical"
                        type="feather"
                        containerStyle={{borderRadius: 50, overflow: 'hidden'}}
                        style={{padding: 10}}
                        onPress={() => {
                          setshowMoreList(item);
                        }}
                        />}

                        <View style={{flex: 2}}>
                        <Text style={{fontSize: 14, color: '#333', fontWeight: '600',marginHorizontal:10,textAlign:"right"}} numberOfLines={2}>
                            {item.filename.split(".mp4")[0]} 
                        </Text>
                        </View>

                        <View style={{marginHorizontal: 0}}>
                        <View
                            style={{
                              elevation: 2,
                              backgroundColor: '#ddd',
                              borderRadius: 10,
                              overflow: 'hidden',
                              margin: 10,
                              flex: 1,
                            }}>
                           {!(isCopy || isCut) &&  <Image
                            source={{
                              uri: item.path,
                            }}
                            style={{height: 60, width: 100, backgroundColor: '#eee'}}
                            />}
                        </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            )}
            
          }}
          ListEmptyComponent={
            <>
            {!(isCopy || isCut) && !refreshing && (
              <View
              style={{
                height: height - 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{fontSize: 16, color: '#08d'}}>فــارغ</Text>
              </View>
            )}
            {(isCopy || isCut) && (
              <View
              style={{
                height: height - 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 16, color: '#08d'}}>لا توجد ملفات</Text>
            </View>
            )}
            {refreshing && (
              <>
                <View
                  style={{
                    height: height - 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator size={40} color="#08d" />
                </View>
              </>
            )}
          </>
          }

/>
    {isSelector && !(isCopy || isCut) && (
        <View
          style={{
            backgroundColor: '#08d2',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <Icon
            name="copy"
            type="ionicon"
            style={{padding: 10}}
            disabled={filesSelected.find((item)=>item.type == "directory")} 
            disabledStyle={{backgroundColor:"#0000"}}
            color={filesSelected.find((item)=>item.type == "directory")?"#aaa":"#08d"}
            onPress={() => {
              dispach(startCopyFile({files: filesSelected,From:currentPath}));
              setisSelector(false);
              setfilesSelected([])
              setcurrentPath("/storage/emulated/0")
              onRefresh("/storage/emulated/0")
            }}
          />
          <Icon name="move" type="ionicon" disabled={filesSelected.find((item)=>item.type == "directory")} disabledStyle={{backgroundColor:"#0000"}}  style={{padding: 10}}
            color={filesSelected.find((item)=>item.type == "directory")?"#aaa":"#08d"}
           onPress={() => {
            // console.log(filesSelected[0].type);
              dispach(startcutFile({files: filesSelected,From:currentPath}));
              setisSelector(false);
              setfilesSelected([])
              // setcurrentPath("/storage/emulated/0/")
            }} />
          {/* <Icon name='drive-file-rename-outline' type='material' style={{padding:10}} /> */}
          <Icon name="delete" type="material" color="#08d" style={{padding: 10}} onPress={()=>{
            Alert.alert("!",`هل تود حذف  ${filesSelected.length > 1?"هذه الفيديوهات":"هذا الفيديو"}`,[
              {text:"نعم",onPress:()=>{
                deleteFile({files:filesSelected,path:currentPath},dispach)
                setisSelector(false);
                setfilesSelected([])
              }},
              {text:"لا",style:"cancel"}
            ])
          }} />
          {/* <Icon
            name="information-circle"
            type="ionicon"
            color="#08d"
            style={{padding: 10}}
          /> */}
          <Icon name="checkmark-done" color="#08d" type="ionicon" style={{padding: 10}} onPress={()=>{filesSelected.length === data.length  ?setfilesSelected([]): setfilesSelected(data)}} />
        </View>
      )}
      {(isCopy || isCut) && (
        <View 
        style={{
          backgroundColor: '#08d2',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding:10,
          borderRadius:10,
          margin:5
        }} >
          <TouchableOpacity style={{padding:8,paddingHorizontal:20,backgroundColor:"#08d",borderRadius:5}} 
            onPress={()=>{
              if (isCopy) {
                copyFilesAction({files:files,To:currentPath,From:From,Folders:data},dispach).then(()=>{
                  setcurrentPath(currentPath)
                })
              }else{
                cutFilesAction({files:files,To:currentPath,From:From},dispach).then(()=>{
                  setcurrentPath(currentPath)
                })
              }
            }}
           >
            <Text style={{fontWeight:"900",color:"#fff"}} > {isCopy&&"نسخ هنا"} {isCut&&"نقل هنا"} </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{alignItems:"center",justifyContent:"center"}} onPress={()=>setshowModalMakeDir(true)} >
            <Icon name='addfolder' type='ant-design' size={20} color="#005" />
            <Text style={{fontSize:12,color:"#005"}} > مجلد جديد </Text>
          </TouchableOpacity>
        </View>
      )}



      {/* make dir modal */}
      <Modal visible={showModalMakeDir} transparent animationType='fade' onRequestClose={()=>setshowModalMakeDir(false)} >
          <View style={{flex:1,backgroundColor:"#0005",alignItems:"center",justifyContent:"center"}} >
             <View style={{backgroundColor:"#fff",padding:10,width:"90%",borderRadius:10}} >
                <View style={{margin:10}}>
                    <TextInput
                      placeholder='اسم المجلد'
                      value={newDirName}
                      onChangeText={setnewDirName}
                      autoFocus
                    />
                </View>
                <View style={{flexDirection:"row"}} >
                    <TouchableOpacity style={{marginHorizontal:10,padding:5}} onPress={()=>{
                      makeDirAction({path:currentPath,name:newDirName},dispach).then(()=>{
                        setshowModalMakeDir(false)
                        setcurrentPath(currentPath+"/"+newDirName)
                        setnewDirName("")
                      })
                    }} >
                       <Text style={{fontSize:16,fontWeight:"900",color:"#08d"}} > إنشاء </Text>
                    </TouchableOpacity  >
                    <TouchableOpacity style={{marginHorizontal:10,padding:5}} onPress={()=>setshowModalMakeDir(false)} >
                       <Text style={{fontSize:16,fontWeight:"900"}} > إلغاء </Text>
                    </TouchableOpacity>
                </View>
             </View>
          </View>
      </Modal>


</>
  )
}

export default RenderFoldersAndVideos

const styles = StyleSheet.create({})