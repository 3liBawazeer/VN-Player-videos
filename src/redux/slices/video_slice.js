import { createSlice } from "@reduxjs/toolkit";

const videoSilce = createSlice({
    name: 'video',
    initialState:{
          currentTime:14141414,
          duration:1,
          startSeek:false
    },
    reducers:{
      onLoadVideo:(state,payload)=>{
        state.duration = payload.payload
      },
      onProgress:(state,payload)=>{
        state.currentTime = payload.payload
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { onLoadVideo , onProgress } = videoSilce.actions
  
  export default videoSilce.reducer