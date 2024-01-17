import {
  Image,
  Text,
  View,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
  BackHandler,
  TouchableNativeFeedback,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import React, {useEffect, useRef, useState, memo} from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {Button, Icon} from '@rneui/themed';
import {useDispatch, useSelector} from 'react-redux';
import MoreList from '../../components/MoreList.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getlastVideoReduser} from '../../redux/slices/database_slice.js';
import {Toaster} from '../../components/Toaster.js';
import RenderFoldersAndVideos from './RenderFoldersAndVideos.js';
import RenderPlayLists from './RenderPlayLists.js';
import RenderAllNotes from './RenderAllNotes.js';
import {Modal} from 'react-native';
import {addVideoToPlayLists} from '../../redux/actionsCreator/playLists_action.js';
import {
  enterSourse,
  finshloadFiles,
  startCopyFile,
  stoploadingFiles,
} from '../../redux/slices/fileManager_slice.js';
import LoadModal from '../../components/loadModal.js';
import {videoExtentions} from '../../assets/videoEXt.js';
import RenderAlbums from './RenderAlbums.js';
// import { FlashList } from "@shopify/flash-list";

const {height, width} = Dimensions.get('window');

const Home = ({navigation}) => {
  // for know if i in this screen to go back

  const {lastVideo} = useSelector(o => o.DB);
  const {playlists} = useSelector(o => o.playlists);
  const {videosAlbums} = useSelector(o => o.storageData);
  const {files, isCopy, isCut, loading, refreshFolders} = useSelector(
    o => o.fileM,
  );
  const dispach = useDispatch();

  const [currentPath, setcurrentPath] = useState('/storage/emulated/0/');
  const [Folders, setFolders] = useState([]);
  const [Videos, setVideos] = useState([]);
  const [filesSelected, setfilesSelected] = useState([]);
  const [isSelector, setisSelector] = useState(false);
  const [titleName, settitleName] = useState('Video Notes Player');
  const [isSearch, setisSearch] = useState(false);
  const [loadFiles, setloadFiles] = useState(false);
  const [search, setsearch] = useState('');
  const [resSearchV, setresSearchV] = useState([]);
  const [resSearchF, setresSearchF] = useState([]);
  const [ALLFolders, setALLFolders] = useState([]);
  const [loadSearch, setloadSearch] = useState(false);

  const [videosAlbum, setvideosAlbum] = useState([]);

  // For Top Bar
  const listBar = [
    {
      title: 'الألبومات',
      key: 'ALBUM',
      onPress: () => {},
      icn: 'albums',
      ict: 'ionicon',
    },
    {
      title: 'الملفات',
      key: 'FOL',
      onPress: () => {},
      icn: 'folder-open',
      ict: 'ionicon',
    },
    {
      title: 'قوائم التشغيل',
      key: 'PLA',
      onPress: () => {},
      icn: 'playlist-play',
      ict: 'material',
    },
    {
      title: 'جميع الملاحظات',
      key: 'NOT',
      onPress: () => {},
      icn: 'notebook',
      ict: 'material-community',
    },
  ];
  const [selectedBar, setselectedBar] = useState('ALBUM');
  const [showPLaylistsMDL, setshowPLaylistsMDL] = useState(null);

  // for more lists
  const [showMoreList, setshowMoreList] = useState(null);
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
      title: 'إضافة الى قائمة تشغيل',
      onPress: () => {
        setshowMoreList(false);
        setshowPLaylistsMDL(showMoreList);
      },
    },
  ];



  const getFoldersHome = async current => {
    try {
      setsearch('');
      setisSearch(false);
      setresSearchF([]);
      setresSearchV([]);
      setloadFiles(true);

      const allvideos = videosAlbums?.filter(
        im => !im?.filename.endsWith('.mp3'),
      ); // جميع الفيديوهات في ذاكرة الجهاز

      const AllFiles = await RNFetchBlob.fs.lstat(current); // جميع الملفات في المسار الحالي

      // [ فلترة المفات نخلي الملفات الي ما تبدأ بــ . وبس ]
      let filterFolders = AllFiles.filter(
        item => !item?.filename?.startsWith('.'),
      );

      // [ الملفات الموجودة في المسار الحالي ]
      const currentFolders = filterFolders.filter(
        item => item.type == 'directory',
      );

      // [ الفيديوهات في المسار الحالي ]
      let currentVideos = filterFolders.filter(item =>
        videoExtentions(item?.filename),
      );
      currentVideos = currentVideos.map(ele => {
        if (
          allvideos.find(one => one.path.replace('file://', '') == ele.path)
        ) {
          return allvideos.find(
            one => one.path.replace('file://', '') == ele.path,
          );
        }
      });
      // ---------------------------- START DANGER 😶‍🌫️ ------------------------- \\

      let foldersWithYourVideos = [];
      // sort folders with videos into it
      currentFolders.map((item, index) => {
        allvideos.map(it => {
          if (it.path.includes(item.path)) {
            // for check is the folder found in (foldersWithYourVideos => array) or not .
            // content of folder of videos [videos]
            const ele = foldersWithYourVideos.find(
              iem => iem.path == item.path,
            );

            if (ele) {
              const index = foldersWithYourVideos.indexOf(ele);
              foldersWithYourVideos[index].content.push(it);
            } else {
              foldersWithYourVideos.push({
                path: item.path,
                content: [it],
                filename: item.path.split('/')[item.path.split('/').length - 1],
                lastModified: item.lastModified,
                size: item.size,
                type: item.type,
                folders: [],
                videos: [],
              });
            }
          }
        });
      });

      console.log(foldersWithYourVideos,"ssssssssssssssssssssssssssss");

      // يجيب عدد الفيديوهات والمفات داخل كل ملف
      const filterVideosAndFolders = foldersWithYourVideos.map((im, ix) => {
        let fol = [];
        let vid = [];
        const videosFilter = im.content.filter((ele, inx) => {
          const group_name = ele.path
            .replace('file://' + im.path, '')
            .split('/')[1];

          if (videoExtentions(group_name)) {
            vid.push({...ele, name: group_name});
            return videoExtentions(group_name);
          }
        });
        const foldersFilter = im.content.filter((ele, inx) => {
          const group_name = ele.path
            .replace('file://' + im.path)
            .split('/')[1];
          if (
            !videoExtentions(group_name) &&
            !fol.find((e, x) => e.name == group_name)
          ) {
            fol.push({...ele, name: group_name});
            return (
              videoExtentions(group_name) &&
              !vid.find((e, x) => e.name == group_name)
            );
          }
        });
        return {...im, videos: vid, folders: fol};
      });

      // ---------------------------- END DANGER 😁👌 ------------------------- \\

      // allvideos => جميع فيديوهات الجهاز
      // AllFiles => جميع ملفات المسار الحالي
      // filterFolders => جميع الفيديوهات
      // currentFolders => ملفات المسار الحالي
      // currentVideos => فيديوهات المسار الحالي
      // foldersWithYourVideos => الملفات مع الفيديوهات الي فيها
      // filterVideosAndFolders => الملفات مع الفيديوهات و الملفات الي فيها

      setALLFolders(filterFolders);
      setVideos(allvideos);
      setFolders(filterVideosAndFolders.concat(currentVideos));
      setisSelector(false);
      setloadFiles(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFoldersHome(currentPath);
  }, [currentPath, refreshFolders]);

  const enterfi = async data => {
    try {
      const checkPath = videoExtentions(data.path);
      if (checkPath) {
        // # save last video in storage  ^
        await AsyncStorage.setItem(
          'lastVideo',
          JSON.stringify({video: data, seek: {currentTimer: 0}}),
        );
        dispach(getlastVideoReduser({video: data}));
        const pth = data.path.split('/' + data.filename)[0];
        RNFetchBlob.fs.lstat(pth).then(res => {
          const videos = res.filter(item => videoExtentions(item.filename));
          const video = videos.find(itm => itm.filename == data.filename);
          navigation.navigate('video', {video: video, allLastVideos: videos});
        });
      } else {
        setisSelector(false);
        setFolders([]);
        setVideos([]);
        settitleName(data.filename);
        setcurrentPath(data.path);
        getFoldersHome(data.path);
      }
    } catch (error) {
      console.log(error);
    }
  };

  let exit = 0;
  function handleBackButtonClick() {
    if (isSearch) {
      setisSearch(false);
      setsearch('');
      setresSearchV([]);
      return true;
    }
    if (currentPath == '/storage/emulated/0/' && (isCopy || isCut)) {
      
      dispach(stoploadingFiles());
      return true;
    }
    if (isSelector) {
      setfilesSelected([]);
      setisSelector(false);
      return true;
    } else {

    
      if ((currentPath == '/storage/emulated/0' || currentPath == '/storage/emulated/0/') && selectedBar == 'FOL') {
        setselectedBar('ALBUM');
      } else if (selectedBar !== 'ALBUM' && selectedBar !== 'FOL') {
        setselectedBar('ALBUM');
      } else {

        if (selectedBar == 'ALBUM' && videosAlbum.length !== 0) {

          setvideosAlbum([])
          
        } else if (selectedBar == 'ALBUM' && videosAlbum.length == 0) {
          setfilesSelected([]);
          exit += 1;
          setTimeout(() => {
            exit = 0;
          }, 3000);
          if (exit == 1) {
            Toaster({title: 'إنقر مرتين للخروج'});
          } else if (exit == 2) {
            return false;
          }
        } else if ((currentPath !== '/storage/emulated/0' || currentPath !== '/storage/emulated/0/') && selectedBar == 'FOL') {

        

          let str = currentPath;
          let arr = str.split('/');
          let fff = arr.slice(0, arr.length - 1);
          if (
            fff.join('/').endsWith('/128/') ||
            fff.join('/').endsWith('/128')
          ) {
            fff = fff.join('/').replace('128', '0').split('/');
          }
          setFolders([]);
          setVideos([]);
          getFoldersHome(fff.join('/'));
          settitleName(
            fff[fff.length - 1] == 0
              ? 'Video Notes Player'
              : fff[fff.length - 1],
          );
          setcurrentPath(fff.join('/'));
          // console.log(fff.join('/'), 'dddddddddd');
        }
      }
    }
    return true;
  }
  // BackHandker => useEffect
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [currentPath, selectedBar, isSelector, isCopy, isCut, isSearch]);

  const onSearch = async x => {
    setloadSearch(true);
    if (x == '') {
      setresSearchV([]);
      setloadSearch(false);
      return;
    }
    let arr = Videos.map(item => {
      return {
        filename: item.split('/')[item.split('/').length - 1],
        path: item,
      };
    });
    const arrFilterV = arr.filter(it =>
      it.filename.toLocaleLowerCase().includes(x.toLocaleLowerCase()),
    );
    setresSearchV(arrFilterV);
    setloadSearch(false);
  };

  const runlastVideo = () => {
    if (lastVideo) {
      // console.log(lastVideo);
      const data = lastVideo.video;
      const pth = data.path
        .split('/')
        .slice(0, data.path.split('/').length - 1)
        .join('/');
      RNFetchBlob.fs.lstat(pth).then(res => {
        const videos = res.filter(item => videoExtentions(item.filename));
        const video = videos.filter(item => item.filename == data.filename);

        navigation.navigate('video', {
          video: video[0],
          allLastVideos: videos,
          seek: {currentTimer: lastVideo.currentTimer},
        });
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* Header Home */}
      <View
        style={{
          backgroundColor: '#08d',
          paddingVertical: 5,
        }}>
        {!(isCopy || isCut) && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
            }}>
            <View style={{}}>
              {/* <Icon
              name="more-vertical"
              type="feather"
              onPress={() => {}}
              color={'#fff'}
              // size={30}
              style={{padding: 15, opacity: 0}}
            /> */}
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
              }}>
              {!isSearch ? (
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: '800',
                    marginHorizontal: 10,
                  }}>
                  {!isSelector && titleName}
                  {isSelector &&
                    Folders.length + ' / ' + filesSelected.length + ' محدد '}
                </Text>
              ) : (
                <TextInput
                  placeholder="Search"
                  autoFocus
                  value={search}
                  onChangeText={x => {
                    setsearch(x);
                    onSearch(x);
                  }}
                  onSubmitEditing={onSearch}
                  style={{
                    color: '#fff',
                    borderBottomWidth: 1,
                    borderBottomColor: '#fff',
                    width: '100%',
                    padding: 5,
                    margin: 5,
                  }}
                  placeholderTextColor="#fff"
                />
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name={isSearch ? 'close' : 'search-outline'}
                  type="ionicon"
                  color={'#fff'}
                  style={{padding: 10}}
                  onPress={() => {
                    if (isSearch) {
                      setisSearch(false);
                      setsearch('');
                      setresSearchV([]);
                    } else {
                      setisSearch(true);
                    }
                  }}
                />
                {lastVideo && (
                  <Icon
                    name={'motion-play-outline'}
                    type="material-community"
                    color={'#fff'}
                    style={{padding: 10}}
                    onPress={runlastVideo}
                  />
                )}
              </View>
            </View>
          </View>
        )}
        {(isCopy || isCut) && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="arrowright"
                type="ant-design"
                onPress={() => {
                  dispach(stoploadingFiles());
                }}
                color={'#fff'}
                style={{padding: 15}}
              />
              <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                {' '}
                {isCopy && 'نسخ'} {isCut && 'نقل'}{' '}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="close"
                  type="ionicon"
                  color={'#fff'}
                  style={{padding: 10}}
                  onPress={() => {
                    dispach(stoploadingFiles());
                  }}
                />
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={{flex: 1}}>
        {!(isCopy || isCut) && (
          <View style={{flexDirection: 'row'}}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {!isSelector &&
                !(isCut || isCopy) &&
                listBar.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      item.onPress();
                      setisSelector(false);
                      setfilesSelected([]);
                      setselectedBar(item.key);
                    }}
                    key={index}
                    style={[
                      styles.float,
                      {
                        backgroundColor:
                          selectedBar == item.key ? '#08d' : '#fff',
                        borderWidth: 1,
                        borderColor: selectedBar !== item.key ? '#08d' : '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 5,
                        borderRadius: 10,
                        flexDirection: 'row',
                        borderWidth: 1,
                        padding: 5,
                      },
                    ]}>
                    <Icon
                      name={item.icn}
                      type={item.ict}
                      color={selectedBar == item.key ? '#fff' : '#08d'}
                      style={{marginHorizontal: 5}}
                    />
                    <Text
                      style={[
                        styles.floatText,
                        {color: selectedBar !== item.key ? '#08d' : '#fff'},
                      ]}>
                      {item.title}{' '}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}

        {(isCopy || isCut) && (
          <View style={{backgroundColor: '#08d2', padding: 5}}>
            <Text
              style={{
                marginHorizontal: 10,
                color: '#aaa',
                fontSize: 12,
              }}
              numberOfLines={1}>
              {files.length + '  ' + 'عناصر محدده'}
            </Text>

            {/* <Text
          style={{
            marginHorizontal: 10,
            color: '#aaa',
            fontSize: 12,
          }}
          numberOfLines={1}>
          <Text style={{color: '#08d', fontWeight: '900'}}>المسار</Text> :
          {selectedBar == 'FOL' &&
            currentPath.replace('/storage/emulated/0', '/Internal storage')}
          {selectedBar == 'PLA' && 'قوائم التشغيل'}
          {selectedBar == 'NOT' && 'جميع الملاحظات'}
        </Text> */}
          </View>
        )}
        {/* the sourse view */}
        {selectedBar == 'FOL' && (
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'flex-start',
              margin: 10,
            }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              centerContent
              alwaysBounceHorizontal
              style={{
                flexDirection: 'row',
                // alignItems: 'center',
                // justifyContent: 'flex-start',
                margin: 10,
                marginVertical: 5,
              }}>
              {currentPath
                .replace('/storage/emulated/0', '/التخزين الداخلي')
                .replace('/storage/emulated/128', '/التخزين الداخلي')
                .split('/')
                .filter(it => it != '')
                .map((item, ix, arr) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    key={ix}>
                    <Icon
                      name="arrow-left"
                      type="material"
                      size={25}
                      containerStyle={{marginHorizontal: -5}}
                    />
                    <Text
                      key={ix}
                      style={{
                        color: ix == arr.length - 1 ? '#08d' : '#044',
                        textAlign: 'center',
                      }}>
                      {' '}
                      {item}{' '}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}

        <View style={{flex: 1}}>
          {selectedBar == 'FOL' && (
            <RenderFoldersAndVideos
              showMoreList={showMoreList}
              setshowMoreList={setshowMoreList}
              data={Folders}
              navigation={navigation}
              currentPath={currentPath}
              setcurrentPath={setcurrentPath}
              onRefresh={x => getFoldersHome(currentPath)}
              refreshing={loadFiles}
              onEnter={enterfi}
              isSelector={isSelector}
              setisSelector={setisSelector}
              filesSelected={filesSelected}
              setfilesSelected={setfilesSelected}
              Folders={ALLFolders}
            />
          )}

          {selectedBar == 'PLA' && <RenderPlayLists />}
          {selectedBar == 'NOT' && <RenderAllNotes />}
          {selectedBar == 'ALBUM' && (
            <RenderAlbums
              videosAlbum={videosAlbum}
              setvideosAlbum={setvideosAlbum}
            />
          )}
        </View>

        <MoreList list={list} show={showMoreList} setShow={setshowMoreList} />
        {/* play lists modal */}
        <Modal
          visible={showPLaylistsMDL != null}
          transparent
          animationType="fade"
          onRequestClose={() => setshowPLaylistsMDL(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#0002',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                padding: 10,
                borderRadius: 5,
                width: width - 100,
                height: height / 2.5,
                elevation: 10,
                shadowColor: '#08d ',
              }}>
              {playlists.length == 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}>
                  <Text> لأ توجد قوائم تشغيل </Text>
                </View>
              )}
              <Text style={{paddingHorizontal: 10, margin: 5, color: '#08d'}}>
                {' '}
                قوائم التشغيل{' '}
              </Text>
              <ScrollView>
                {playlists.map((item, index, arr) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      const data = {
                        playlist: item,
                        video: showPLaylistsMDL,
                      };
                      addVideoToPlayLists(data, dispach);
                      setshowPLaylistsMDL(null);
                    }}
                    style={styles.MDLplay}>
                    {/* <Icon name='' /> */}
                    <Text style={{color: '#004', fontSize: 16}}>
                      {' '}
                      {item.name}{' '}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ################ footer bar ################# */}

        {loading != '' && <LoadModal title={loading} />}

        {/* ################ Mdl search videos ############### */}

        {isSearch && (
          <Pressable
            style={[
              {...StyleSheet.absoluteFillObject, backgroundColor: '#0002'},
            ]}
            onPress={() => {
              setisSearch(false);
              setsearch('');
              setresSearchV([]);
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                padding: 10,
                height: '65%',
                top: 100,
                // bottom: 100,
                margin: 20,
                elevation: 10,
                position: 'absolute',
                width: '90%',
                borderRadius: 15,
                shadowColor: '#08d',
              }}>
              <FlatList
                data={resSearchV}
                keyExtractor={(_, x) => x.toString()}
                contentContainerStyle={{
                  flex: resSearchV.length == 0 ? 1 : null,
                }}
                ListEmptyComponent={
                  loadSearch ? (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <ActivityIndicator color="#08d" size={50} />
                    </View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text>
                        {' '}
                        {search != '' && 'لا يوجد اي فيديو'}{' '}
                        {search == '' && 'البحث عن الفيديوهات'}{' '}
                      </Text>
                    </View>
                  )
                }
                renderItem={({item, index}) => (
                  <TouchableNativeFeedback
                    key={index + 1}
                    // onLongPress={
                    //   isCopy || isCut
                    //     ? null
                    //     : () => {
                    //         onSelectFile(item);
                    //         setisSel(true);
                    //       }
                    // }
                    onPress={() => {
                      const pth = item.path.split('/' + item.filename)[0];
                      console.log(pth);
                      RNFetchBlob.fs.lstat(pth).then(res => {
                        const videos = res.filter(item =>
                          videoExtentions(item.filename),
                        );
                        const video = videos.find(
                          itm => itm.filename == item.filename,
                        );
                        navigation.navigate('video', {
                          video: video,
                          allLastVideos: videos,
                        });
                      });
                    }}
                    // onPressOut={() => {
                    //   setisSel(false);
                    // }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        // backgroundColor: filesSelected.includes(item) ? '#eef' : null,
                      }}>
                      {
                        // <Icon
                        //   name="more-vertical"
                        //   type="feather"
                        //   containerStyle={{borderRadius: 50, overflow: 'hidden'}}
                        //   style={{padding: 10}}
                        //   onPress={() => {
                        //     setshowMoreList(item);
                        //   }}
                        // />
                      }

                      <View style={{flex: 2}}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#333',
                            fontWeight: '600',
                            marginHorizontal: 10,
                            textAlign: 'right',
                          }}
                          numberOfLines={2}>
                          {item.filename.split('.mp4')[0]}
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
                          {!(isCopy || isCut) && (
                            <Image
                              source={{
                                uri: 'file://' + item.path,
                              }}
                              style={{
                                height: 60,
                                width: 100,
                                backgroundColor: '#eee',
                              }}
                            />
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                )}
              />
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  backgroundVideo: {
    // backgroundColor:"#08d",
    height: 200,
  },
  float: {
    backgroundColor: '#08d',
    padding: 5,
    borderRadius: 10,
    margin: 5,
  },
  floatText: {
    color: '#fff',
  },
  MDLplay: {
    padding: 10,
    borderBottomWidth: 0.5,
    marginHorizontal: 5,
    paddingVertical: 20,
    borderColor: '#08d5',
    flexDirection: 'row',
  },
});
