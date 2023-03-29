import {StyleSheet, Text, View, BackHandler, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {Icon, Image} from '@rneui/themed';
import {TouchableOpacity} from 'react-native';
import Video from 'react-native-video';
import {TouchableNativeFeedback} from 'react-native';
import {FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { convertDurationToTime } from '../../components/time';
import MoreList from '../../components/MoreList';
import { Modal } from 'react-native';
import { Alert } from 'react-native';
import { deleteNotes } from '../../redux/actionsCreator/editAndDeleteNotes';
import { useNavigation } from '@react-navigation/native';
const {height, width} = Dimensions.get('window');

const RenderAllNotes = () => {

    const {notes} = useSelector(o => o.DB);
    const dispach = useDispatch()
    const [showMoreList, setshowMoreList] = useState(false)
    const [showInfoNote, setshowInfoNote] = useState(null)
    const navigation = useNavigation()
  return (
    <View>
      <FlatList
          data={notes}
          ListEmptyComponent={<View style={{height:height-200,width:width,alignItems:"center",justifyContent:"center"}} >
            <Text> لا توجد اي ملاحظات  </Text>
          </View>}
          keyExtractor={(_, x) => x.toString()}
          renderItem={({item,index}) => (
            <TouchableNativeFeedback
              onPress={() => {
                navigation.navigate('Note', {data: item});
              }}>
              <View style={{padding: 10, flexDirection: 'row',alignItems:"center"}}>
                <View
                  style={{
                    marginHorizontal: 5,
                    width: '30%',
                    overflow: 'hidden',
                    alignItems:"center",
                    justifyContent:"center"
                  }}>
                  <View style={{height: 50, width: 100, borderRadius: 5,overflow:"hidden"}}>
                    <Image
                      source={{uri: 'file://' + item.path}}
                      style={{height: 50, width: 100, borderRadius: 10}}
                    />
                    <View
                      style={{
                        backgroundColor: '#0005',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        alignItems:"center",
                        justifyContent:"center"
                      }}>
                      <Text
                        style={{
                          zIndex: 11,
                          color: '#fff',
                          borderRadius: 5,
                          padding: 3,
                          fontWeight:"900",
                          fontSize:16
                        }}>
                        {convertDurationToTime(item.currentTimer)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    // width: '70%',
                    flex:1,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      zIndex: 11,
                      color: '#005',
                    //   padding: 5,
                      fontWeight: '700',
                      fontSize: 15,
                    }}>
                    {item.title}
                  </Text>
                  <Text style={{zIndex: 11, color: '#aaa'}} numberOfLines={1}>
                   {item.content}
                  </Text>
                </View>
                <View>
                    <Icon name='more-vertical' type='feather' style={{padding:5,}}   containerStyle={{borderRadius:50,overflow:"hidden"}}
                     onPress={()=>{
                        setshowMoreList(item)
                     }}
                    />
                </View>
              </View>
            </TouchableNativeFeedback>
          )}
        />

        <MoreList show={showMoreList} setShow={setshowMoreList} 
         list={[
            {title:"حذف الملاحظه ", icName:"delete", icType:"ant-design", onPress:()=>{Alert.alert("!","هل تود حذف هذه الملاحظة ؟ ",[
                {text:"نعم",onPress:()=>{deleteNotes(showMoreList.noteId,dispach);}},
                {text:"إلغاء"}
            ]);setshowMoreList(false)}},
            {title:"معلومات ",icName:"infocirlceo",icType:"ant-design", onPress:()=>{setshowInfoNote(showMoreList);setshowMoreList(false)}},
         ]}
        />

        <Modal animationType='fade' transparent visible={showInfoNote != null} onRequestClose={()=>setshowInfoNote(null)} >
            <View style={{flex:1,backgroundColor:"#0001",alignItems:"center",justifyContent:"center"}} >
                <View style={{backgroundColor:"#fff",padding:10,width:"85%",elevation:10,shadowColor:"#08d",borderRadius:10}} >

                <View style={{position:"absolute",opacity:0.1,top:30,right:30}} >
                <Image
                      source={require("../../assets/VN_LOGO.png")}
                      style={{height: 129, width: 120, borderRadius: 10}}
                    />
                </View>
                
                  <View style={{overflow:"hidden",position:"absolute",right:0,zIndex:150}} >
                    <Icon name='close' type='ant-design' 
                        onPress={()=>setshowInfoNote(null)}
                        containerStyle={{padding:5,overflow:"hidden",backgroundColor:"#08d",borderRadius:50,margin:10,}}
                        color={"#fff"}
                    />
                  </View>
              
                   <Image
                      source={{uri: 'file://' + showInfoNote?.path}}
                      style={{height: 80, width: 120, borderRadius: 10}}
                    />

                  <View style={{marginVertical:5,}} >
                      <Text style={{color:"#004",fontSize:15}}> عنوان الملاحظه : <Text style={{fontSize:12,color:"#aaa",}} > {showInfoNote?.title} </Text> </Text>
                      
                   </View>

                   <View style={{marginVertical:5,}} >
                      <Text style={{color:"#004",fontSize:15}}> توقيت الملاحظه : <Text style={{fontSize:12,color:"#aaa",}} > {convertDurationToTime(showInfoNote?.currentTimer)} </Text> </Text>
                   </View>

                   <View style={{marginVertical:5}} >
                      <Text style={{color:"#004",fontSize:15}}> أسم الفيديو  :  </Text>
                      <Text style={{fontSize:12,color:"#aaa",}} > {   showInfoNote?.path.split("/")[showInfoNote?.path.split("/").length-1].split(".")[0]} </Text>
                   </View>

                   <View style={{marginVertical:5,}} >
                      <Text style={{color:"#004",fontSize:15}}> المسار :   </Text>
                      <Text style={{fontSize:12,color:"#aaa",}} numberOfLines={2} > {showInfoNote?.path} </Text>
                   </View>
                   
                </View>
                
            </View>
        </Modal>


    </View>
  )
}

export default RenderAllNotes

const styles = StyleSheet.create({})