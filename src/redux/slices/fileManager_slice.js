import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { stat } from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';


const fileManager_slice = createSlice({
  name: 'files',
  initialState: {
    files:[],
    sourse:["التخزين الداخلي"],
    isCopy:false,
    isCut:false,
    loading:"",
    refreshFolders:false,
  },
  reducers: {
    startCopyFile:(state,action) =>{ 
        state.isCopy = true
        state.files = action.payload.files
     },
     startcutFile:(state,action) =>{ 
      state.isCut = true
      state.files = action.payload.files
   },
     startloadFiles:(state,action)=>{state.loading = action.payload},
     finshloadFiles:(state)=>{
       state.refreshFolders = !state.refreshFolders
       state.isCopy = false
       state.isCut = false
    },
    stoploadingFiles:(state,action)=>{
      state.isCopy = false
      state.isCut = false
      state.loading = ""
    }
  },
});

// Action creators are generated for each case reducer function
export const { startCopyFile, enterSourse, copyFilesReduser, startloadFiles, finshloadFiles, startcutFile ,stoploadingFiles} = fileManager_slice.actions;

export default fileManager_slice.reducer;
