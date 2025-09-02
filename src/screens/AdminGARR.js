import {ActivityIndicator, Alert, Dimensions, Image, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { adminDelegateDetails, clockInPageStyles, EmployeesUploadDocumentsPageStyles, historyDetailPageStyles, loginPageStyles } from '../utils/styles'
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Button, RadioButton } from 'react-native-paper';
import moment from 'moment';
import { format } from "date-fns";
import AsyncStorage from '@react-native-async-storage/async-storage';

//Generate Attendance Range Report
const AdminGARR = () => {

  var width = Dimensions.get('window').width;
  const [startDate, setStartDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [dobToShow, setDOBToShow] = useState('Select Date');
  const [show, setShow] = useState(false);
  const [token, setToken] = useState('');

  // const [show_1, setShow_1] = useState(false);
  // const [dobToShow_1, setDOBToShow_1] = useState('Select Date');
  
  const [selectedValue, setSelectedValue] = useState('');

  const [loading, setLoading] = useState(false);


useEffect(() => {
  AsyncStorage.getItem('token', (err, item) => {
    console.log('token value--', token);
            setToken(item);
        })
},[])

  const hideCancelPickerForStart = () => {
    setShow(false);
  };
  const handleConfirmPickerForStart = date => {
    const currentDate = date;
    // console.log('Start Date', moment(currentDate).format('DD/MM/YYYY'));
    setShow(false);
    setDOBToShow(moment(currentDate).format('DD/MM/YYYY'));
    setStartDate(currentDate);
  };

  const checkValidation = () => {
    console.log('dobToShow--', dobToShow);
    
    if (dobToShow === 'Select Date') {
      Alert.alert(
        "Alert!",
        "Please select report start date.")
    } else if (selectedValue === '')
    {
      Alert.alert(
        "Alert!",
        "Please select specific time.")
    } else {
      generateReport()
    }
  }

  const generateReport = async () => {  
    const startDateToSend_1 = format(startDate, "yyyy-MM-dd");    
    // console.log('startDateToSend_1 ', startDateToSend_1);
    setLoading(true);
    
  let selectedDateWithTime = ''

  if (selectedValue === '8') {
    selectedDateWithTime = startDateToSend_1 + 'T00:00'
  } else if (selectedValue === '10') {    
    selectedDateWithTime = startDateToSend_1 + 'T02:00'
  } else if (selectedValue === '15') {
    selectedDateWithTime = startDateToSend_1 + 'T07:00'
  } else if (selectedValue === '20') {
    selectedDateWithTime = startDateToSend_1 + 'T12:00'
  }
  console.log('hello...selectedValue', selectedDateWithTime);
console.log('API token ', token);

  const requestOptions = {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  startDate: selectedDateWithTime
                })
            };
            console.log('--requestOptions.body--:' + requestOptions.body)
            await fetch(BASE_URL + 'Admin/ExportAttendanceInfo',
                requestOptions)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Something went wrong, status ' + response.status);
                    }
                })
                .then((data) => {
                    console.log('==== responseCode==== ' + data.responseCode);
                    let json = data;
                    console.log(json.data)
                    if (json.responseCode == 200) {
                        Alert.alert(
                            "Alert!",
                            "Report exported successfully.",
                            [
                                {
                                    text: "OK",
                                    onPress: () => {
                                        navigation.navigate("AdminHomeDrawer", {
                                            screen: "AdminDashboard"
                                        });
                                    }
                                }
                            ]
                        )
                    } else {
                        Alert.alert(
                            "Alert!",
                            json.responseMessage,
                        )
                    }
                })
                .catch((error) => {
                console.log('==ERROR== : ' + error)
                Alert.alert(
                        "Alert!",
                        error.message,
                    )
            })
                .finally(() => {
                    setLoading(false);
                });
  }
  

  return (
    
            <View style={loginPageStyles.container}>
                <StatusBar barStyle="default"
                    backgroundColor="#FA0F0A" />
                <View style={{ flexDirection: 'column' }}>
                    <Image
                        style={EmployeesUploadDocumentsPageStyles.top_image}
                        source={require('../assets/images/top_image_1.png')}
                    />
                    <View style={clockInPageStyles.top_image_layer} />
                    <KeyboardAwareScrollView>
                        <View style={loginPageStyles.content_container}>
                            <View style={historyDetailPageStyles.btn_container}>
                                <Text style={adminDelegateDetails.delegate_text}>
                                    Report Start Date
                                </Text>
                                <View style={adminDelegateDetails.edit_bg}>
                                    <Image
                                        style={loginPageStyles.svg_icons}
                                        source={require('../assets/images/calendar.png')}
                                    />
                                    <View style={{flex: 1}}>
                    <Button
                      backgroundColor={'white'}
                      onPress={() => {
                        setShow(true);
                      }}>
                      <Text style={{color: 'black', alignSelf: 'flex-start'}}>
                        {dobToShow}
                      </Text>
                    </Button>
                    <DateTimePickerModal
                      isVisible={show}
                      mode="date"
                      date={startDate}
                      maximumDate={minDate}
                      onConfirm={handleConfirmPickerForStart}
                      onCancel={hideCancelPickerForStart}
                    />
                  </View>
                </View>
                <View style={{alignItems: 'flex-start', width: width, marginLeft: 30}}>
                <Text style={styles.header}>Select time:</Text>

      <View style={styles.radioButtonContainer}>
        <Pressable onPress={()=> setSelectedValue('8')} style={{flexDirection:'row'}}>
        <RadioButton
          value="8"
          status={selectedValue === '8' ? 'checked' : 'unchecked'}
          disabled  
        />
        <Text style={styles.label}>08:00 AM</Text>
        </Pressable>
      </View>

      <View style={styles.radioButtonContainer}>
        <Pressable onPress={()=> setSelectedValue('10')} style={{flexDirection: 'row'}}>
        <RadioButton
          value="10"
          status={selectedValue === '10' ? 'checked' : 'unchecked'}
          disabled
        />
        <Text style={styles.label}>10:00 AM</Text>
        </Pressable>
      </View>

      <View style={styles.radioButtonContainer}>
        <Pressable onPress={()=> setSelectedValue('15')} style={{flexDirection: 'row'}}>
        <RadioButton
          value="15"
          status={selectedValue === '15' ? 'checked' : 'unchecked'}
          disabled
        />
        <Text style={styles.label}>03:00 PM</Text>
        </Pressable>
      </View>
      <View style={styles.radioButtonContainer}>
        <Pressable onPress={()=> setSelectedValue('20')} style={{flexDirection: 'row'}}>
        <RadioButton
          value="20"
          disabled
          status={selectedValue === '20' ? 'checked' : 'unchecked'}
        />
          <Text style={styles.label}>08:00 PM</Text>
        </Pressable>
      </View>

      {/* <Text style={styles.selectionText}>Selected: {selectedValue}</Text> */}
                         
                </View>
                                
                                
                                <TouchableOpacity
                                    onPress={() => {
                                        checkValidation()
                                    }}
                                    style={EmployeesUploadDocumentsPageStyles.btn_upload_filter}>
                                    {loading ? <View style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                        {
                                            loading &&
                                            <ActivityIndicator color={'#fff'} />
                                        }
                                    </View> : <Text style={loginPageStyles.btn_text}>
                                        Generate Report
                                    </Text>}
                                </TouchableOpacity>
                                
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View>
    
    // <View>
    //   <RadioButton
    //     value="apple"
    //     status={checked === 'apple' ? 'checked' : 'unchecked'}
    //     onPress={() => setChecked('apple')}
    //   />
    //   <Text>Apple</Text>

    //   <RadioButton
    //     value="samsung"
    //     status={checked === 'samsung' ? 'checked' : 'unchecked'}
    //     onPress={() => setChecked('samsung')}
    //   />
    //   <Text>Samsung</Text>

    //   <Text>Selected: {checked}</Text>
    // </View>
  )
}

export default AdminGARR

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'flex-start',
  //   padding: 20,
  //   backgroundColor: 'red'
  // },
  header: {
    // fontSize: 20,
    // fontWeight: 'bold',
    // marginBottom: 15,
    // marginTop: 15
    // width: width * .9,
    fontSize: 14,
    color: 'gray',
    marginTop: 30,
    // marginBottom: 10,
    fontFamily: 'OpenSans-Regular',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    marginTop: 10
  },
  selectionText: {
    marginTop: 20,
    fontSize: 18,
  },
})