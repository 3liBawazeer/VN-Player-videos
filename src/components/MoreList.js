import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import React , {useEffect,useRef} from 'react'
import RBSheet from "react-native-raw-bottom-sheet";
import { Icon } from '@rneui/themed';
const MoreList = ({show = false,setShow,list = [{title:"",icName:"",icType:"",onPress:()=>{}}]}) => {



    const refRBSheet = useRef();


    useEffect(() => {
        if (show) {
          refRBSheet.current.open()
        }else{
          refRBSheet.current.close()
        }
    }, [show])
    


  return (
    <View style={{backgroundColor:"#08d",elevation:10,}}>
      <RBSheet
        ref={refRBSheet}
        onClose={()=>{setShow(false)}}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: "#0002"
          },
          draggableIcon: {
            backgroundColor: "#08d",
            borderRadius:50
          }
        }}
        openDuration={200}
        closeDuration={200}
      >
        {list.map((item,index)=>(
            <TouchableNativeFeedback key={index} onPress={item.onPress}>
                <View style={{padding:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingHorizontal:15}}>
                    <Text style={{fontSize:18,color:"#08d"}} > {item.title} </Text>
                    <Icon name={item.icName} type={item.icType}  style={{padding:10,backgroundColor:"#08d1",borderRadius:50}} color="#08a" />
                </View>
           </TouchableNativeFeedback>
        ))}
      </RBSheet>
    </View>
  )
}

export default MoreList

const styles = StyleSheet.create({})