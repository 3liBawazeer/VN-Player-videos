import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {db} from '../../../App';
import { TablesName } from './database_slice';



const playlist_slice = createSlice({
  name: 'PLAYLISTS',
  initialState: {
    playlists: [],
  },
  reducers: {
    getPlaylistFinsh:(state,action)=>{
      state.playlists = action.payload
    },
    newPlaylist:(state,action)=>{
     state.playlists.push(action.payload)
    },
    addToplayList:(state,action)=>{
     const arr = state.playlists.map((itm,ix)=>{
        if (itm.id == action.payload.playlist.id ) {
            itm.list.push(action.payload.video)
        }
        return itm
     })
     state.playlists = arr
    },
    deletePlaylistReduser:(state,action)=>{
     state.playlists = state.playlists.filter((ele,ix)=>ele.id != action.payload)
    },
    editPlayListReduser:(state,action)=>{
        const arr = state.playlists.map((itm,ix)=>{
            if (itm.id == action.payload.id ) {
                return action.payload
            }
            return itm
         })
         state.playlists = arr
    },
  },
});

// Action creators are generated for each case reducer function
export const { getPlaylistFinsh , newPlaylist , addToplayList , deletePlaylistReduser , editPlayListReduser } = playlist_slice.actions;

export default playlist_slice.reducer;
