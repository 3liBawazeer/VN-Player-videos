import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

export const getStartingAsync = createAsyncThunk(
  'getStarting/getData',
  async action => {

    try {

    const getALLVideos = async () => {
      const count = await CameraRoll.getAlbums({assetType: 'Videos'});
      let num = count.map(Item => Item.count).reduce((a, e, x) => a + e);
      const data = await CameraRoll.getPhotos({
        assetType: 'Videos',
        first: num,
        mimeTypes: ['video/mp4'],
        include: [
          // 'playableDuration',
          'fileSize',
        ],
      });

      const Videos = data.edges.map(Item => {
        // get video name from path
        let videoName = Item.node.image.uri.split("/")[Item.node.image.uri.split("/").length-1];

        // For Getting Extention Of Video From Path Or Uri >
        let letter = Item.node.image.uri.split("/")[Item.node.image.uri.split("/").length-1].split("");
        let videoExtention = letter[-3] + letter[-2] + letter[-1];
        // For Getting Extention Of Video From Path Or Uri <

        return {
          groupName: Item.node.group_name,
          filename: videoName ,
          fileSize: Item.node.image.fileSize,
          duration: Item.node.image.playableDuration,
          fileExtension: videoExtention,
          path: Item.node.image.uri,
          type: Item.node.type,
          timestamp: Item.node.timestamp,
          modified: Item.node.modified,
        };
      });

      return Videos;
    };

    const videos  =  await getALLVideos();
    
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

    console.log(" أنا أستطيع 😁✌️ ");
    
    return data;

    } catch (error) {
      console.log(error);
    }

  },
);

const getStarting = createSlice({
  name: 'getStarting',
  initialState: {
    videosAlbums: [],
    allAlbums:[],
    AllFolders: [],
    storageLoading:false
  },
  reducers: {},
  extraReducers: builder => {

    builder.addCase(getStartingAsync.fulfilled, (state, action) => {
      state.storageLoading = true;
      state.allAlbums = action?.payload?.allAlbums ;
      state.videosAlbums = action?.payload?.videosAlbums ;
      state.AllFolders  = action?.payload?.folders ;
    });

    builder.addCase(getStartingAsync.rejected, (state, action) => {
      // state.storageLoading = true;
      console.log('getStartingAsync.rejected'?.toLowerCase + " : " + "There is an Error on" + action.error);
    });
  },
});

export const {} = getStarting.actions;

export default getStarting.reducer;
