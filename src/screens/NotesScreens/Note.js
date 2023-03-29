import {StyleSheet, Text, View, TouchableOpacity, TextInput , ScrollView, BackHandler, Alert} from 'react-native';
import React, {useEffect,useState} from 'react';
import {Icon, Image} from '@rneui/themed';
import {convertDurationToTime} from '../../components/time';
import RNFetchBlob from 'rn-fetch-blob';
import { useRef } from 'react';
import { deleteNotes, editeNotes } from '../../redux/actionsCreator/editAndDeleteNotes';
import { useDispatch } from 'react-redux';
import { TouchableNativeFeedback } from 'react-native';
import { videoExtentions } from '../../assets/videoEXt';
const Note = ({navigation, route}) => {

  const {data} = route?.params;
  const dispach = useDispatch()
  const [isEditing, setisEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  let titleRef = useRef().current
  let contentRef = useRef().current

  const playVideo = () => { 
    const pth = data.path.split("/").slice(0,data.path.split("/").length-1).join("/")
    RNFetchBlob.fs.lstat(pth).then(res => {
      const videos = res.filter(item =>  videoExtentions(item.filename));
      const video = videos.filter(item => item.path == data.path);
      navigation.navigate('video',{video: video[0], allLastVideos: videos,seek:data,});
    });
  }

  useEffect(() => {
    if (data) {
      setContent(data.content)
      setTitle(data.title)
    }
  }, [])
  
  const saveEdit = () => { 
    const jool = {
      id:data.id,
      title:title,
      content:content,
      noteId:data.noteId,
    }
    editeNotes(jool,dispach)
    setisEditing(o=>!o)
   }

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

  return (
    <View style={{flex: 1, backgroundColor: '#fff',}}>
      <View
        style={{
          backgroundColor: '#08d',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
        }}>
        <View style={{}}>
          <Icon
            name="arrowright"
            type="ant-design"
            onPress={() => {navigation.goBack()}}
            color={'#fff'}
            size={27}
            style={{padding: 15}}
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
          }}>
          <Text style={{color: '#fff',fontSize:17}} numberOfLines={1} >
            {data.path.split('/')[data.path.split('/').length - 1].split('.mp4')[0]}
          </Text>
        </View>
        <View  style={{flexDirection:"row"}}  >
        <TouchableOpacity style={{paddingHorizontal:10}}
         onPress={!isEditing?()=>{
          setisEditing(o=>!o)
        }:saveEdit}
        >
         {isEditing ? <Text style={{color: '#fff',fontWeight:"800"}}>
            حفظ 
          </Text> :
           <Icon name='edit' type='ant-design' color="#fff" />
          }
        </TouchableOpacity>
        {!isEditing&&<TouchableOpacity style={{paddingHorizontal:10}}
         onPress={()=>{
          Alert.alert("!","هل تود حذف هذه الملاحظة",[
            {text:"نعم",onPress:()=>{
              deleteNotes(data.noteId,dispach)
             navigation.goBack()
            }},
            {text:"لا"}
          ])
        }}
        >
           <Icon name='delete' type='ant-design' color="#fff" />
        </TouchableOpacity>}
        </View>
      </View>

      <View style={styles.body}>
        
      { !isEditing && 

          <TouchableOpacity
            onPress={playVideo}
            style={styles.floatBtn}
            >

            <Icon name="controller-play" type="entypo" color="#Fff" size={40} />
            <Text style={{color: '#fff', fontWeight: '700', fontSize: 18 }}>
              {convertDurationToTime(data.currentTimer)}
            </Text>
          </TouchableOpacity>

      }

        <ScrollView>
          <View style={{margin: 10, alignItems: 'flex-start'}}>
            <View style={{margin: 0}}>
              {isEditing
              ?
              <TextInput
              value={title}
              onChangeText={setTitle}
              ref={titleRef}
              autoFocus
              onSubmitEditing={()=>{
                contentRef = true
              }}
              style={{
                color: '#08d',
                fontWeight: '700',
                fontSize: 18,
                margin: 10,
              }}
              />
              :
              <Text
                style={{
                  color: '#08d',
                  fontWeight: '700',
                  fontSize: 18,
                  margin: 10,
                  textAlign: 'left',
                }}
                selectionColor={'#ff5'}
                selectable
                >
                {title}
              </Text>}


              {!isEditing?<Text
                style={{
                  color: '#088',
                  fontWeight: '500',
                  fontSize: 16,
                  margin: 5,
                  lineHeight: 25,
                }}
                selectionColor={'#ff5'}
                selectable
                >
                {content}
              </Text>
              :
              <TextInput
              style={{
                color: '#333',
                fontWeight: '500',
                fontSize: 16,
                margin: 5,
                lineHeight: 25,
              }}
              autoFocus={contentRef}
              ref={contentRef}
              value={content}
              onChangeText={setContent}
              multiline
              />}
            </View>
          </View>
        </ScrollView>

      </View>
    </View>
  );
};
export default Note;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor:"#fff",
    borderRadius:5,
    elevation:5,
    overflow:"hidden"
  },
  floatBtn:{
    backgroundColor: '#08d',
    padding: 5,
    borderRadius: 50,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    margin: 10,
    elevation:10,
    zIndex:11,
  }
});
