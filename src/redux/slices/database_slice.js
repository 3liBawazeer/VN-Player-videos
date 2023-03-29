import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {db} from '../../../App';
import { Toaster } from '../../components/Toaster';
import {getAllNotesData} from '../actionsCreator/getAllNotesData';

export const TablesName = {
  notes: 'Notes',
  lastVideo: 'lastVideo',
  playlist:"playList",
  history:"history"
};

export const createTables = createAsyncThunk('localDB', async () => {
  console.log('createTables function running');

  // # <<<<<<<<<<<<[ NOTES TABLE ]>>>>>>>>>>>>>

  await db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS ' +
        TablesName.notes +
        '(id TEXT,content TEXT, title TEXT, path TEXT, currentTimer TEXT,noteId TEXT);',
      [],
      () => {
        // console.log('CREATE Notes TABLE SUCCESSFULY :) ...');
      },
      err => console.log('CREATE Notes TABLE ERROR :( ', err),
    );
  });

  await db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS ' +
        TablesName.playlist +
        '(id TEXT,name TEXT,list TEXT);',
      [],
      () => {
        // console.log('CREATE playlist TABLE SUCCESSFULY :) ...');
      },
      err => console.log('CREATE playlist TABLE ERROR :( ', err),
    );
  });

  // await db.transaction(tx => {
  //   tx.executeSql(
  //     'CREATE TABLE IF NOT EXISTS ' +
  //       TablesName.history +
  //       '(id TEXT,content TEXT, title TEXT, path TEXT, currentTimer TEXT,noteId TEXT);',
  //     [],
  //     () => {
  //       // console.log('CREATE history TABLE SUCCESSFULY :) ...');
  //     },
  //     err => console.log('CREATE history TABLE ERROR :( ', err),
  //   );
  // });


});

const database_slice = createSlice({
  name: 'localDB',
  initialState: {
    notes: [],
    lastVideo: null,
    loading: false,
    getData:false
  },
  reducers: {
    startGetNoteDB: ({loading}) => {
      loading = true;
    },
    fulfilledGetNoteDB: (state, action) => {
      state.notes = action.payload
      state.getData = true;
      state.loading = false;
    },
    rejectedGetNoteDB: ({loading}) => {
      state.getData = true;
      loading = false;
    },
    getlastVideoReduser:(state,action) => {
      state.lastVideo = action.payload
    },
    saveNewNoteReduser:(state,action)=>{
      state.notes.push(action.payload)
      
    },
    editeNotesReduser:(state,action)=>{
      console.log("fffffffffff");
      const edAr = []
      const arr = state.notes.map((item,index)=>{
        if (item.noteId == action.payload.noteId ) {
            item.content = action.payload.content 
            item.title = action.payload.title 
        }
        edAr.push(item)
      })
      state.notes = edAr 
      
    },
    deleteNoteReduser:(state,action)=>{
      console.log(action.payload,"    ff  f  f  fff  fff   ff fd");
      state.notes = state.notes.filter((item,index)=>item.noteId != action.payload )
    }
  },

  extraReducers: builder => {
    // builder.addCase(getAllNotesData.fulfilled, (state, action) => {
    //     state.loading = true
    //     console.log(action.payload, " this is  ");
    // })
  },
});

// Action creators are generated for each case reducer function
export const {fulfilledGetNoteDB, startGetNoteDB, rejectedGetNoteDB ,getlastVideoReduser,saveNewNoteReduser, deleteNoteReduser , editeNotesReduser} =
  database_slice.actions;

export default database_slice.reducer;
