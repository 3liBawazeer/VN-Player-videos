import SQLite from 'react-native-sqlite-storage';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from '../../../App';
import { rejectedGetNoteDB, startGetNoteDB, TablesName , fulfilledGetNoteDB } from '../slices/database_slice';
export const getAllNotesData = async (dispach)=> {
    dispach(startGetNoteDB())
    try {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM ${TablesName.notes}`,
                [],
                (x, res) => {
                    const len = res.rows.length
                    if (len == 0) {
                        dispach(fulfilledGetNoteDB([]))
                    }else{
                        let note = [];
                        for (let i = 0; i < len; i++) {
                            note.push(res.rows.item(i));
                        };
                        dispach(fulfilledGetNoteDB(note)) 
                    }
                },
                err => {
                     dispach(rejectedGetNoteDB(err))
                },
            );
            }); 
    } catch (error) {
        console.log(error);
        dispach(rejectedGetNoteDB(error))
    }
};
  


