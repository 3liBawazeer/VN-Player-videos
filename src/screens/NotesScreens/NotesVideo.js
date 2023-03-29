import {StyleSheet, Text, View, BackHandler, Dimensions} from 'react-native';
import React, {useEffect} from 'react';
import {Icon, Image} from '@rneui/themed';
import {TouchableOpacity} from 'react-native';
import Video from 'react-native-video';
import {TouchableNativeFeedback} from 'react-native';
import {FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import { convertDurationToTime } from '../../components/time';
const {height, width} = Dimensions.get('window');
export default function NotesVideo({navigation, route}) {
  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  const {data} = route?.params;
  const {notes} = useSelector(o => o.DB);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{
          backgroundColor: '#08d',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
        }}>
        <View style={{}}>
          <Icon
            name="timeline-check-outline"
            type="material-community"
            onPress={() => {}}
            color={'#fff'}
            size={30}
            style={{padding: 15}}
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
          }}>
          <Text style={{color: '#fff'}}>
            {' '}
            {data.filename.split('.mp4')[0]}{' '}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        
        <View 
          style={{
            fontSize: 16,
            color: '#333',
            borderBottomWidth: 0.5,
            margin: 10,
            borderColor: '#aaa',
            marginHorizontal:20,
          }}
        >
        <Text
          style={{
            fontSize: 16,
            color: '#333',
            margin: 10,
          }}>
          {' '}
          جميع الملاحظات{' '}
        </Text>
        </View>

        <FlatList
          data={notes.filter((im)=>im.id == data.lastModified )}
          ListEmptyComponent={<View style={{height:height-200,width:width,alignItems:"center",justifyContent:"center"}} >
            <Text>لا توجد اي ملاحظات في هذا الفيديو</Text>
          </View>}
          keyExtractor={(_, x) => x.toString()}
          renderItem={({item,index}) => (
            <TouchableNativeFeedback
              onPress={() => {
                navigation.navigate('Note', {data: item});
              }}>
              <View style={{padding: 10, flexDirection: 'row',alignItems:"center"}}>
                <View
                  style={{
                    marginHorizontal: 5,
                    width: '30%',
                    overflow: 'hidden',
                    alignItems:"center",
                    justifyContent:"center"
                  }}>
                  <View style={{height: 50, width: 100, borderRadius: 5,overflow:"hidden"}}>
                    <Image
                      source={{uri: 'file://' + data.path}}
                      style={{height: 50, width: 100, borderRadius: 10}}
                    />
                    <View
                      style={{
                        backgroundColor: '#0005',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        alignItems:"center",
                        justifyContent:"center"
                      }}>
                      <Text
                        style={{
                          zIndex: 11,
                          color: '#fff',
                          borderRadius: 5,
                          padding: 3,
                          fontWeight:"900",
                          fontSize:16
                        }}>
                        {convertDurationToTime(item.currentTimer)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: '70%',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      zIndex: 11,
                      color: '#005',
                      padding: 5,
                      fontWeight: '700',
                      fontSize: 16,
                    }}>
                    {item.title}
                  </Text>
                  <Text style={{zIndex: 11, color: '#aaa'}} numberOfLines={2}>
                   {item.content}
                  </Text>
                </View>
              </View>
            </TouchableNativeFeedback>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
