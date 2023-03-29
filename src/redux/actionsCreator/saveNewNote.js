import SQLite from 'react-native-sqlite-storage';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from '../../../App';
import { rejectedGetNoteDB, startGetNoteDB, TablesName , fulfilledGetNoteDB, saveNewNoteReduser } from '../slices/database_slice';
import { ToastAndroid , Alert } from 'react-native';
import { convertDurationToTime } from '../../components/time';
import { Toaster } from '../../components/Toaster';
export const saveNewNote = async (data,dispach)=> {
    try {
      await db.transaction(tx => {
            // Example :-
            // 'INSERT INTO Student_Table (student_name, student_phone, student_address) VALUES (?,?,?)',
            // [S_Name, S_Phone, S_Address],
            tx.executeSql(
              'INSERT INTO ' +
                TablesName.notes +
                " (id,content, title, path, currentTimer,noteId) VALUES (?,?,?,?,?,?) ;",
              [data.id, data.content, data.title, data.path, data.currentTimer,data.noteId],
              (tx, res) => {
                Toaster({title:`تم إضافة ملاحظة عند   ${convertDurationToTime(data.currentTimer)}`})
                dispach(saveNewNoteReduser(data))
                console.log("save succefuly");
                // ToastAndroid.show(`تم إضافة ملاحظة عند الدقيقه ${convertDurationToTime(data.currentTimer)}`)
                // console.log('Results', res.rowsAffected);
                // if (res.rowsAffected > 0) {
                //     Alert.alert('Note Inserted Successfully....');
                // } else Alert.alert(' Note Inserted Failed....');
              },
              err => {
                console.log(err);
              },
            );
          });
    } catch (error) {
        console.log(error);
    }
};
  


