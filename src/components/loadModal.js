import { StyleSheet, Text, View,Modal } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native'

const LoadModal = ({title="جاري التحميل ..."}) => {
  return (
    <Modal visible transparent >
        <View style={{flex:1,backgroundColor:"#0005",alignItems:"center",justifyContent:"center"}} >
            <View style={{backgroundColor:"#fff",alignItems:"center",justifyContent:"center",borderRadius:10,padding:20}} >
              <ActivityIndicator color={"#08d"} size={40} style={{backgroundColor:"#fff"}} />
              <Text style={{marginTop:10,color:"#08f",fontWeight:"700"}} > {title} </Text>
            </View>
        </View>
    </Modal>
  )
}

export default LoadModal

const styles = StyleSheet.create({})