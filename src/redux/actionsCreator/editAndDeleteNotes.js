import { db } from "../../../App";
import { deleteNoteReduser, editeNotesReduser, TablesName } from "../slices/database_slice";
import { Alert } from "react-native";
import { Toaster } from "../../components/Toaster";

export const editeNotes = async (data,dispach) => { 

    try {

      db.transaction((tx) => {
        tx.executeSql(
          `UPDATE ${TablesName.notes} SET title = ? , content = ? WHERE noteId = ?`,
          [data.title,data.content, data.noteId],
          (tx, results) => {
            console.log("edit note succesfuly ");
            dispach(editeNotesReduser(data))
          }
        );
      });
      
    } catch (error) {
      console.error(error);
    }
    
 }
export const deleteNotes = async (data,dispach) => { 
    try {
      db.transaction((tx) => {
        tx.executeSql(
          `DELETE FROM ${TablesName.notes} WHERE noteId = ?`,
          [data],
          (tx, results) => {
            dispach(deleteNoteReduser(data))
            Toaster({title:"تم حذف الملاحظه"})
            console.log("delete note succesfuly  ");
          }
        );
      });
    } catch (error) {
      console.error(error);
    }
    
 }