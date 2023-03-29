import AsyncStorage from "@react-native-async-storage/async-storage"
import { getlastVideoReduser } from "../slices/database_slice";

export const getlastVideo = async (dispach) => { 
   const result = await AsyncStorage.getItem("lastVideo");
  //  console.log(result, " :::: last video :::");
   dispach(getlastVideoReduser(JSON.parse(result)))
 }