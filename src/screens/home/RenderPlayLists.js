import {StyleSheet, Text, View, Dimensions, Modal,Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Button, Icon} from '@rneui/themed';
import {TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {addPlayLists, deletePlayList, editPlaylist} from '../../redux/actionsCreator/playLists_action';
import {Alert} from 'react-native';
import MoreList from '../../components/MoreList';
import {useNavigation} from '@react-navigation/native';
import { TouchableNativeFeedback } from 'react-native';
const {height, width} = Dimensions.get('window');


const PlaylistICon = ({list = []}) => (
  <View style={{
    backgroundColor: list.length == 0? '#fff':"#0000",
    height: 60,
    width: 100,
    elevation: 5,
    borderRadius: 10,
    overflow:"hidden",
    alignItems:"center",
    justifyContent:'center',
  }}>
    {list?.slice(0,3)?.map((item, index) => (
      <View
        key={index}
        style={{
          backgroundColor: '#fff',
          height: 60,
          width: 100,
          elevation: 5,
          shadowColor:"#000",
          borderColor:"#eee",
          position: index > 0 ? 'absolute' : 'relative',
          top:index/0.2,
          borderRadius:10,
          zIndex:10,
          transform:[{rotateY:`${index*2+5}deg`}],
          alignItems:"center",
          justifyContent:"center",
          overflow:"hidden",
          
        }}>
            <Image source={item?.path?{uri:`file:///${item?.path}`}:require("../../assets/VN_LOGO.png")} blurRadius={0} resizeMode="cover" style={{width:"100%",height:"100%"}} />
        </View>
    ))}

   {list.length == 0 && <Image 
    source={require("../../assets/VN_LOGO.png")} 
    blurRadius={4} 
    resizeMode="cover" 
    style={{width:30,height:33.3,opacity:0.8,marginRight:4}}
     />}
  </View>
);

const RenderPlayLists = () => {

    const navigation = useNavigation();
    const {playlists} = useSelector(o => o.playlists);
    const dispach = useDispatch();
    const [playListName, setplayListName] = useState('');
    const [showMDLADD, setshowMDLADD] = useState(false);
    const [showMoreList, setshowMoreList] = useState(false);
    const [showMDLRename, setshowMDLRename] = useState(false)
    const [newName, setnewName] = useState("")

    

  const addPlayList = () => {
    if (playListName != '') {
      setplayListName('');
      setshowMDLADD(false);
      addPlayLists(playListName, dispach);
    } else {
      Alert.alert('!', 'أدخل إسمً لقائمة التشغيل');
    }
  };
  
   const reName = () => { 
    let playlistEditing = {...showMoreList,name:newName}
    editPlaylist(playlistEditing,dispach)
    setshowMDLRename(false)
    setshowMoreList(false)
   }

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={playlists}
        ListEmptyComponent={
          <View
            style={{
              height: height - height / 4.5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>لا توجد اي قائمة تشغيل</Text>
            <TouchableOpacity
              style={{
                padding: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => setshowMDLADD(true)}>
              <Icon
                name="playlist-add"
                type="material"
                color="#08d"
                style={{padding: 5}}
              />
              <Text style={{color: '#08d'}}> قائمة تشغيل جديده </Text>
            </TouchableOpacity>
          </View>
        }
        ListHeaderComponent={
          playlists.length > 0 && (
            <TouchableOpacity
              style={{padding: 15, flexDirection: 'row', alignItems: 'center'}}
              onPress={() => setshowMDLADD(true)}>
              <Icon
                name="playlist-add"
                type="material"
                color="#08d"
                style={{padding: 5}}
              />
              <Text style={{color: '#08d'}}> قائمة تشغيل جديده </Text>
            </TouchableOpacity>
          )
        }
        renderItem={({item, index}) => (
              <TouchableNativeFeedback
                    key={index + 1}
                    underlayColor={'#0002'}
                    onPress={() => navigation.navigate('playList', {list: item})}
                    >
                    <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor:"#fff",
                    justifyContent:"space-between"
                    }}>
                        <Icon
                        name="more-vertical"
                        type="feather"
                        containerStyle={{borderRadius: 50, overflow: 'hidden'}}
                        style={{padding: 10}}
                        onPress={()=>{setshowMoreList(item)}}
                        />

                        <View style={{flex: 2}}>
                        <Text style={{fontSize: 14, color: '#333', fontWeight: '600',marginHorizontal:10,textAlign:"right"}} numberOfLines={2}>
                            {item.name} 
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
                            <PlaylistICon list={item.list} />
                        </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
        //    <TouchableNativeFeedback
        //       onPress={() => navigation.navigate('playList', {list: item})}>
        //         <View
        //             style={{
        //             flexDirection: 'row',
        //             alignItems: 'center',
        //             paddingHorizontal: 10,
        //             paddingVertical: 10,
        //             backgroundColor:"#fff",
        //             justifyContent:"space-between"
        //             }}>
        //              <View style={{flexDirection: 'row',alignItems: 'center',flex:1}} >
        //                <PlaylistICon list={item.list} />
        //                <View style={{width:"75%"}} >
        //                <Text
        //                     numberOfLines={1}
        //                     style={{
        //                         marginHorizontal: 10,
        //                         color: '#005',
        //                         fontWeight: 'bold',
        //                         // fontSize: 16,
        //                     }}>
        //                      {item.name} of kf k kmk k k kkkk kmk kkfkfkf 
        //                </Text>
        //                </View>
        //              </View>
        //             <Icon
        //                 name="more-vertical"
        //                 type="feather"
        //                 containerStyle={{borderRadius: 50, overflow: 'hidden'}}
        //                 style={{padding: 10}}
        //                 onPress={()=>{setshowMoreList(item)}}
        //                 />
        //         </View>
        //    </TouchableNativeFeedback>
        )}
      />

      <Modal
        transparent
        visible={showMDLADD}
        onRequestClose={() => setshowMDLADD(false)}>
        <View
          style={styles.bodyMDLADD}>
          <View
            style={styles.bodyMDLADD0}>
            <TextInput
              value={playListName}
              onChangeText={o => setplayListName(o)}
              mode="outlined"
              label="أسم قائمة التشغيل"
            />
            <View style={{marginVertical: 15}}>
              <Button
                title="إضافة"
                color="#08d"
                titleStyle={{fontWeight: '900'}}
                onPress={addPlayList}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={showMDLRename}
        onRequestClose={() => setshowMDLRename(false)}>
        <View
          style={styles.bodyMDLADD}>
          <View
            style={styles.bodyMDLADD0}>
            <TextInput
              value={newName}
              autoFocus
              onChangeText={setnewName}
              mode="outlined"
              onSubmitEditing={reName}
              label="أسم قائمة التشغيل"
              style={{marginBottom:20}}
            />
             <View style={{flexDirection:"row",}} >
                <TouchableOpacity onPress={reName} style={{marginHorizontal:10}} >
                <Text style={{color:"#08d",fontWeight:"900"}} > تسميه </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setshowMDLRename(false)} style={{marginHorizontal:10}} >
                <Text style={{color:"#aaa",fontWeight:"900"}} > إلغاء </Text>
                </TouchableOpacity>
             </View>
          </View>
        </View>
      </Modal>

      <MoreList
        show={showMoreList}
        setShow={setshowMoreList}
        list={[
          {title: 'إعادة التسميه ', icName: 'drive-file-rename-outline', icType: 'material',onPress:()=>{setshowMDLRename(true);setnewName(showMoreList.name)}},
          {title: 'حذف قائمة التشغيل', icName: 'delete', icType: 'ant-design',onPress:()=>{
            Alert.alert("!","هل تود حذف قائمة التشغيل",[
                {text:"نعم",onPress:()=>{deletePlayList(showMoreList.id,dispach);setshowMoreList(false)}},
                {text:"لا"}
            ])
          }},
        ]}
      />
    </View>
  );
};

export default RenderPlayLists;

const styles = StyleSheet.create({
    bodyMDLADD:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0002',
      },
      bodyMDLADD0:{
        backgroundColor: '#fff',
        width: '85%',
        padding: 20,
        elevation: 10,
        borderRadius: 10,
        shadowColor: '#004',
      }
});