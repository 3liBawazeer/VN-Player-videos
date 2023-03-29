import RNFetchBlob from 'rn-fetch-blob';
import {Toaster} from '../../components/Toaster';
import RNFS from 'react-native-fs';
import { finshloadFiles, startloadFiles, stoploadingFiles } from '../slices/fileManager_slice';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

export const copyFilesAction = async (data, dispach) => {
  try {
    dispach(startloadFiles("جاري النسخ يرجى الإنتظار..."))
    data.files.map((item, index,arr) => {
    //  مصدر الملف الذي سيتم إرسال الملفات اليه
     let destinationPath = data.To

    // أسم الملف الذي سيتم نسخه
      let FileName = item.filename;
      //  إضافة اسم الملف الى مصدر الملف الذي يتم النسخ له
      destinationPath = `${data.To}/${FileName}`
      let check = false
      let i = 0
      while (i <= 10) {
        if (FileName.includes(`(${i})`)) {
          FileName = FileName.replace(`(${i})`,`(${i+1})`)
          const findPath = data.Folders.find((item)=> item.path.includes(FileName))
          if (findPath) {
            continue;
          }else{
            check = true
            break;
          }
        } 
        if(i==10 && !check){
          FileName = FileName.split(".")[0]+` (0) .${FileName.split(".")[1]}`   
          i = 0
          continue 
        }
        i+=1
      }
   
      if (check) {
        destinationPath = data.To + '/' + FileName;
      } 
     

    //  path:موقع الملف الذي سيتم نسخه , dest:مصدر المجلد الذي سيتم النسخ له + اسم الملف الذي يتم نسخه 
     RNFetchBlob.fs.cp(item.path, destinationPath)
        .then(result => {
          console.log('file copied:', result);
          Toaster({title:`تم نسخ ${arr.length > 1?"الفيديوهات":"الفيديو"} بنجاح`})
          dispach(finshloadFiles())
          dispach(stoploadingFiles())
        })
        .catch(err => {
          console.log(err);
        });

    });
  } catch (error) {
    console.log(error);
  }
};


export const cutFilesAction = async (data, dispach) => {
    try {
        dispach(startloadFiles("جاري النقل يرجى الإنتظار..."))
      data.files.map((item, index,arr) => {
  
      //  مصدر الملف الذي سيتم إرسال الملفات اليه
        let destinationPath = data.To;
  
      // أسم الملف الذي سيتم نسخه
        let FileName = item.filename;
  
      //  إضافة اسم الملف الى مصدر الملف الذي يتم النسخ له
        destinationPath = destinationPath + '/' + FileName;
      //  path:موقع الملف الذي سيتم نسخه , dest:مصدر المجلد الذي سيتم النسخ له + اسم الملف الذي يتم نسخه 
        RNFS.moveFile(item.path, destinationPath)
          .then(result => {
            console.log('file moved:', result);
            dispach(finshloadFiles())
            dispach(startloadFiles())
            Toaster({title:`تم نقل ${arr.length > 1?"الفيديوهات":"الفيديو"} بنجاح `})
          })
          .catch(err => {
            console.log(err);
          });
  
      });
    } catch (error) {
      console.log(error);
    }
  };

export const makeDirAction = async (data, dispach) => {
  RNFetchBlob.fs
    .mkdir(data.path + '/' + data.name)
    .then(() => {
      console.log('make dir true');
    })
    .catch(err => console.log(err));
};


export const deleteFile = async (data,dispach) => {
  let path = data.path
  dispach(startloadFiles("جاري الحذف يرجى الإنتظار..."))
  data.files.map((item)=>{
    RNFetchBlob.fs.unlink(path+"/"+item.filename)
      .then((res) => {
        dispach(finshloadFiles())
        Toaster({title:"تم الحذف بنجاح"})
        dispach(stoploadingFiles())
      })
      .catch((err) => {
        console.log(err.message);
      });
     })
}

