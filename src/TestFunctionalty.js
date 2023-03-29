import {
    Image,
    Text,
    View,
    FlatList,
    TextInput,
    StyleSheet,
    BackHandler,
    TouchableNativeFeedback,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Button,
    Dimensions
  } from 'react-native';
  import React, {useEffect, useRef, useState, memo} from 'react';
  import RNFetchBlob from 'rn-fetch-blob';
  import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import { videoExtentions } from './assets/videoEXt';
import RNFS from "react-native-fs"
import { useDispatch, useSelector } from 'react-redux';
import { getStartingAsync } from './redux/slices/getStarting';
import Draggable from 'react-native-draggable';
import { TapGestureHandler } from "react-native-gesture-handler"
import { PermissionsAndroid } from 'react-native';
import { getFoldersHome } from './screens/home/mainFunctions';

const {height, width} = Dimensions.get('window');

const TestFunctionalty = () => {

  const dispach = useDispatch()
  const {videosAlbums} = useSelector(o=>o.storageData)

  useEffect(()=>{
    dispach(getStartingAsync())
  },[])

    const getALLVideosFunction = async () => {
      
      const getALLVideos = async () => {
        const count = await CameraRoll.getAlbums({assetType: 'Videos'});
        let num = count.map(Item => Item.count).reduce((a, e, x) => a + e);
        const data = await CameraRoll.getPhotos({
          assetType: 'Videos',
          first: num,
          mimeTypes: ['video/mp4'],
          include: [
            'playableDuration',
            // 'fileExtension',
            // 'fileSize',
            // 'filename',
            // 'location',
          ],
        });
        const Videos = data.edges.map(Item => {
          return {
            groupName: Item.node.group_name,
            videoName: Item.node.image.filename,
            fileSize: Item.node.image.fileSize,
            duration: Item.node.image.playableDuration,
            fileExtension: Item.node.image.extension,
            location: Item.node.image.uri,
            type: Item.node.type,
            timestamp: Item.node.timestamp,
            modified: Item.node.modified,
          };
        });
        return Videos;
        /*
             Data Shape ;')
            {
              groupName:Item.node.group_name,
              videoName:Item.node.image.filename,
              fileSize:Item.node.image.filesize,
              duration:Item.node.image.playableDuration,
              fileExtension:Item.node.image.extension,
              location:Item.node.image.uri,
              type:Item.node.type,
              timestamp:Item.node.timestamp,
              modified:Item.node.modified,
              
            }
          */
      };
      const videos  =  await getALLVideos()

     
      
      let arr = [...videos]
      
      let allAlbums = []; // shape {groupName:"",videos:[]}
      // for getting albums with videos
      arr.forEach((ele,ix)=>{
        const item = allAlbums.find((e,x)=> e.groupName == ele.groupName ) 
        if(!item){
          const d = {groupName:ele.groupName,videos:[ele]}
          allAlbums.push(d)
        }else{
         const index = allAlbums.indexOf(item);
         allAlbums[index].videos.push(ele)
        }
      })

  
      const data = {videosAlbums:videos,allAlbums:allAlbums,folders:[]};
  
      };

    //  const get = async () => { 
    //   const exist128 = await RNFetchBlob.fs.exists("/storage/emulated/128/")
    //   console.log(exist128);
    //   }

    

    // const getFoldersHome = async (current) => { 
    //   try {
       
      
    //   const allvideos = videosAlbums?.filter( im => !im?.filename.endsWith(".mp3") ); // جميع الفيديوهات في ذاكرة الجهاز


    //   const AllFiles = await RNFetchBlob.fs.lstat(current); // جميع الملفات في المسار الحالي

    //   // [ فلترة المفات نخلي الملفات الي ما تبدأ بــ . وبس ]
    //   let filterFolders = AllFiles.filter(item => !item?.filename?.startsWith('.'));

    //   // [ الملفات الموجودة في المسار الحالي ]
    //   const currentFolders = filterFolders.filter(item => item.type == 'directory');
     

    //   // [ الفيديوهات في المسار الحالي ]
    //   let currentVideos = filterFolders.filter(item => videoExtentions(item?.filename) );
    //   currentVideos = currentVideos.map((ele)=>{
    //     if (allvideos.find((one)=> one.path.replace("file://","") == ele.path )) {
    //       return allvideos.find((one)=> one.path.replace("file://","") == ele.path )
    //     }
    //   })
    //   // ---------------------------- START DANGER 😶‍🌫️ ------------------------- \\

    //   let foldersWithYourVideos = [];
    //   // sort folders with videos into it
    //   currentFolders.map((item, index) => {
    //     allvideos.map(it => {
    //       if (it.path.includes(item.path)) {
    //           // for check is the folder found in (foldersWithYourVideos => array) or not .
    //           // content of folder of videos [videos]
    //           const ele = foldersWithYourVideos.find(iem => iem.path == item.path);
              
    //           if (ele) {

    //             const index = foldersWithYourVideos.indexOf(ele);
    //             foldersWithYourVideos[index].content.push(it);
                
    //           } else {
    //             foldersWithYourVideos.push({
    //               path: item.path,
    //               content: [it],
    //               filename:item.path.split('/')[item.path.split('/').length - 1],
    //               lastModified: item.lastModified,
    //               size: item.size,
    //               type: item.type,
    //               folders:[],
    //               videos:[],
    //             });
    //           }
    //       }
    //     });
    //   });

     

    //   // يجيب عدد الفيديوهات والمفات داخل كل ملف
    //   const filterVideosAndFolders = foldersWithYourVideos.map((im, ix) => {
    //     let fol = [];
    //     let vid = [];
    //     const videosFilter = im.content.filter((ele, inx) => {
    //     const group_name = ele.path.replace('file://' + im.path,'').split('/')[1];

    //       if (
    //         videoExtentions(group_name) 
    //       ) {
    //         vid.push({ ...ele,name: group_name,});
    //         return (
    //           videoExtentions(group_name)
    //         );
    //       }
    //     });
    //     const foldersFilter = im.content.filter((ele, inx) => {
    //       const group_name = ele.path.replace('file://' + im.path).split('/')[1];
    //       if (
    //         !videoExtentions(group_name) &&
    //         !fol.find((e, x) => e.name == group_name)
    //       ) {
    //         fol.push({ ...ele,name: group_name,});
    //         return (
    //           videoExtentions(group_name) &&
    //           !vid.find((e, x) => e.name == group_name)
    //         );
    //       }
    //     });
    //     return {...im, videos: vid, folders: fol};
    //   });

    //   // ---------------------------- END DANGER 😁👌 ------------------------- \\

    //   // allvideos => جميع فيديوهات الجهاز
    //   // AllFiles => جميع ملفات المسار الحالي
    //   // filterFolders => جميع الفيديوهات
    //   // currentFolders => ملفات المسار الحالي
    //   // currentVideos => فيديوهات المسار الحالي
    //   // foldersWithYourVideos => الملفات مع الفيديوهات الي فيها
    //   // filterVideosAndFolders => الملفات مع الفيديوهات و الملفات الي فيها

    //   console.log(filterVideosAndFolders);

    //   } catch (error) {
    //     console.log(error);
    //   }
    //  }

    
    const getFolders = async path => {
      try {
         
          let allFolders = []
          let res1 = []
          const exist128 = await RNFetchBlob.fs.exists("/storage/emulated/128/")
         if ((path == "/storage/emulated/0/" || path == "/storage/emulated/0" || path == "/storage/emulated/128/" || path == "/storage/emulated/128") && exist128 ) {
             res1 = await RNFetchBlob.fs.lstat("/storage/emulated/128/")
            }
           RNFetchBlob.fs.lstat(path).then( async res2 => {
  
              // const currentFoldersWithContent = []
  
              // for (let i = 0; i < currentFolders.length; i++) {
              //   const content = await RNFetchBlob.fs.lstat(currentFolders[i].path)
              //   currentFoldersWithContent.push({...currentFolders[i],content:content})
              // }
             
              // console.log("this is all folders with conten",`
              
              // `,currentFoldersWithContent,`
              
              // "this is all folders with conten"
              // `);
  
              // setALLFolders(currentFolders)
              //   this contan all videos in current path
              const currentVideos = filter.filter(item => videoExtentions(item.filename) );
              // shape = {}
              let foldersWithYourVideos = [];
              
              // sort folders with videos into it
              currentFolders.map((item, index) => {
                allvideos.map(it => {
                  if (it.includes(item.path)) {
                      // For check is the folder found in (foldersWithYourVideos > array) or not .
                      const ele = foldersWithYourVideos.find(iem => iem.path == item.path);
                      
                      if (ele) {
                        const index = foldersWithYourVideos.indexOf(ele);
                        foldersWithYourVideos[index].content.push(it);

                      } else {
                        foldersWithYourVideos.push({
                          path: item.path,
                          content: [it],
                          filename:item.path.split('/')[item.path.split('/').length - 1],
                          lastModified: item.lastModified,
                          size: item.size,
                          type: item.type,
                          folders:[],
                          videos:[],
                        });
                      }
                  }
                });
              });
  
  
              // to get how many folders and videos in one folder 
              const filterVideosAndFolders = foldersWithYourVideos.map((im, ix) => {
                let fol = [];
                let vid = [];
                const videosFilter = im.content.filter((ele, inx) => {
                  const group_name = ele.replace('file://' + im.path,'').split('/')[1];
  
                  if (
                    videoExtentions(group_name) &&
                    !vid.find((e, x) => e.name == group_name)
                  ) {
                    vid.push({name: group_name, path: ele});
                    return (
                      videoExtentions(group_name) &&
                      !vid.find((e, x) => e.name == group_name)
                    );
                  }
                });
                const foldersFilter = im.content.filter((ele, inx) => {
                  const group_name = ele.replace('file://' + im.path).split('/')[1];
                  if (
                    !videoExtentions(group_name) &&
                    !fol.find((e, x) => e.name == group_name)
                  ) {
                    fol.push({name: group_name, path: ele});
                    return (
                      videoExtentions(group_name) &&
                      !vid.find((e, x) => e.name == group_name)
                    );
                  }
                });
                return {...im, videos: vid, folders: fol};
              });
                // setVideos(allvideos);
                // // console.log(filterVideosAndFolders.concat(currentVideos));
                // setFolders(filterVideosAndFolders.concat(currentVideos));
                // setisSelector(false);
                // setloadFiles(false);
            });
          
          
         
  
      } catch (error) {
        console.log(error);
      }
    };

    let volum = 0
  return (
    <View style={{flex:1,backgroundColor:"#08d",alignItems:"center",justifyContent:"center"}} >
      <Button title='Get' onPress={() =>{
        getFoldersHome("/storage/emulated/0/").then((data)=>{
          // console.log(data);
        })
      }} ></Button>
    </View>
  )
}

export default TestFunctionalty

const styles = StyleSheet.create({})


// 'video/3gpp',
// 'video/3gpp2',
// 'video/annodex',
// 'video/divx',
// 'video/flv',
// 'video/h264',
// 'video/mp4',
// 'video/mp4v-es',
// 'video/mpeg',
// 'video/mpeg-2',
// 'video/mpeg4',
// 'video/ogg',
// 'video/ogm',
// 'video/quicktime',
// 'video/ty',
// 'video/vdo',
// 'video/vivo',
// 'video/vnd.rn-realvideo',
// 'video/vnd.vivo',
// 'video/webm',
// 'video/x-bin',
// 'video/x-cdg',
// 'video/x-divx',
// 'video/x-dv',
// 'video/x-flv',
// 'video/x-la-asf',
// 'video/x-m4v',
// 'video/x-matroska',
// 'video/x-motion-jpeg',
// 'video/x-ms-asf',
// 'video/x-ms-dvr',
// 'video/x-ms-wm',
// 'video/x-ms-wmv',
// 'video/x-msvideo',
// 'video/x-sgi-movie',
// 'video/x-tivo',
// 'video/avi',
// 'video/x-ms-asx',
// 'video/x-ms-wvx',
// 'video/x-ms-wmx',