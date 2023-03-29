import { configureStore } from "@reduxjs/toolkit";
import database_slice from "./slices/database_slice";
import fileManager_slice from "./slices/fileManager_slice";
import getStarting from "./slices/getStarting";
import playlist_slice from "./slices/playlist_slice";
import video_slice from "./slices/video_slice";
export default configureStore({
    reducer:{
        storageData:getStarting,
        video:video_slice,
        DB:database_slice,
        playlists:playlist_slice,
        fileM:fileManager_slice,
        
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: { warnAfter: 128 },
        serializableCheck: { warnAfter: 128 },
      })
})