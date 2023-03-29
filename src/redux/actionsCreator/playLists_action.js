import {db} from '../../../App';
import { addToplayList, deletePlaylistReduser, editPlayListReduser, getPlaylistFinsh, newPlaylist } from '../slices/playlist_slice';
import { TablesName } from '../slices/database_slice';
import uuid from 'react-native-uuid';
import { Toaster } from '../../components/Toaster';
export const getPLaylists = async (dispach) => {
    await db.transaction(tx => {
        tx.executeSql(
            `SELECT * FROM ${TablesName.playlist}`,
            [],
            (x, res) => {
                const len = res.rows.length
                if (len == 0) {
                    dispach(getPlaylistFinsh([]))
                }else{
                    let list = []
                    for (let i = 0; i < len; i++) {
                        res.rows.item(i).list = JSON.parse(res.rows.item(i).list)
                        list.push(res.rows.item(i));
                    };
                    dispach(getPlaylistFinsh(list))
                }
            },
            err => {
                console.log("ERROR ON GET PLAY LISTS");
            },
        );
        }); 
} 

export const addPlayLists = async (data,dispach) => {
 
    await db.transaction(tx => {
        const id = uuid.v1()
        const arr = []
        tx.executeSql(
          'INSERT INTO ' +
            TablesName.playlist +
            " (id,name, list) VALUES (?,?,?) ;",
          [id, data, JSON.stringify(arr)],
          (tx, res) => {
            Toaster({title:`تم إضافة قائمة تشغيل جديده  `})
            dispach(newPlaylist({id:id, name:data,list:[]}))
          },
          err => {
            console.log(err);
          },
        );
      });
    
}

export const addVideoToPlayLists = async (data,dispach) => {
    try {

       const check = data.playlist.list.find((it,ix)=>it.path == data.video.path)
       console.log(check);
       if (check) {
        Toaster({title:`تم إضافة هذا الفيديو الى قائمة التشغيل هذه مسبقا  `})
       }else{
        const arr = [...data.playlist.list,data.video]

        db.transaction((tx) => {
          tx.executeSql(
            `UPDATE ${TablesName.playlist} SET list = ?  WHERE id = ?`,
            [JSON.stringify(arr), data.playlist.id],
            (tx, results) => {
              dispach(addToplayList(data))
              Toaster({title:`تم إضافة فيديو الى قائمة التشغيل  `})
            }
          );
        });
       }
       
        
      } catch (error) {
        console.error(error);
      }
}


export const deletePlayList = async (data,dispach) => { 
    try {
      db.transaction((tx) => {
        tx.executeSql(
          `DELETE FROM ${TablesName.playlist} WHERE id = ?`,
          [data],
          (tx, results) => {
            dispach(deletePlaylistReduser(data))
            Toaster({title:"تم حذف قائمة التشغيل"})
          }
        );
      });
    } catch (error) {
      console.error(error);
    }
    
 }

 export const editPlaylist = async (data,dispach) => {
    try {

      console.log(data,"this is data after delet vide");
      
        db.transaction((tx) => {
          tx.executeSql(
            `UPDATE ${TablesName.playlist} SET list = ? , name = ? WHERE id = ?`,
            [JSON.stringify(data.list), data.name,data.id],
            (tx, results) => {
              dispach(editPlayListReduser(data))
            }
          );
        });
       
        
      } catch (error) {
        console.error(error);
      }
}