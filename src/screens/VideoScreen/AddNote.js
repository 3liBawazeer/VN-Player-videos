import {StyleSheet, Text, ToastAndroid, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {StatusBar} from 'react-native';
import {Icon} from '@rneui/themed';
import {TextInput} from 'react-native-paper';
import {ScrollView} from 'react-native';
import {Alert} from 'react-native';
import { convertDurationToTime } from '../../components/time';

const AddNote = ({show, setShow, onEndRequist}) => {
  const [title, setTitle] = useState('');
  const [content, setcontent] = useState('');

  const save = () => {
    if (title == '') {
       Alert.alert('!', 'يجب أن تكتب عنوان للملاحظه');
    } else if ((content == '')) {
      Alert.alert('!', 'يجب أن تكتب محتوى للملاحظه');
    } else {
        // setShow(null);
        // setTitle('');
        // setcontent('');
      onEndRequist({title: title, content: content});
      setShow(null)
      
    }
  };

  return (
    <Modal
      isVisible={show != null}
      style={{margin: 0, padding: 0}}
      onBackButtonPress={() => {
        setShow(null);
        setTitle('');
        setcontent('');
      }}>
      <View
        style={{
          backgroundColor: '#08d',
          padding: 10,
          borderRadius: 0,
          alignItems: 'center',
          flexDirection: 'row',
          elevation: 10,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name="arrow-right"
            type="feather"
            color={'#fff'}
            containerStyle={{overflow: 'hidden', borderRadius: 50}}
            style={{padding: 10}}
            onPress={() => {
              setShow(null);
              setTitle('');
              setcontent('');
            }}
          />
          <Text style={{color: '#fff', fontSize: 16}}>
            {' '}
            ملاحظه عند |{' '}
            <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
           {convertDurationToTime(show)}
            </Text>{' '}
          </Text>
        </View>

        <Icon
          name="save"
          type="feather"
          color={'#fff'}
          containerStyle={{overflow: 'hidden', borderRadius: 50}}
          style={{padding: 10}}
          onPress={save}
        />
      </View>
      <View style={{backgroundColor: '#fff', flex: 1}}>
        <ScrollView>
          <View style={{flex: 1}}>
            <View style={{margin: 5, marginBottom: 10}}>
              <TextInput
                value={title}
                onChangeText={setTitle}
                label="عنون الملاحظه"
                mode="outlined"
              />
            </View>

            <View style={{margin: 5}}>
              <TextInput
                value={content}
                onChangeText={setcontent}
                label="محتوى الملاحظه"
                mode="outlined"
                multiline
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default AddNote;

const styles = StyleSheet.create({});
