import React, {useEffect, useState} from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  clockInPageStyles,
  employeesForgotPasswordPageStyles,
  EmployeesUploadDocumentsPageStyles,
  loginPageStyles,
} from '../utils/styles';
import Geolocation from '@react-native-community/geolocation';
import {format} from 'date-fns';
import {BASE_URL} from '../utils/consts';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';
import notificationStore from '../../notification_redux/notificationStore';
import moment from 'moment';
// import { backgroundColor, marginLeft } from 'styled-system';

const EmployeesClockIn = ({route, navigation}) => {
  // const [tempData, setTempData] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [exactDate, setExactDate] = useState('');
  const [lat, setLatitude] = useState('');
  const [lng, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [isConnected, setConnected] = useState();
  const {branch} = route.params;

  // const {timer, startTimer, stopTimer, sessionExpired} = useTimer();
  // const [appState, setAppState] = useState(AppState.currentState);

  // console.log('LOCATION ::: ::: ::: ' + branch);

  var notificationCount = notificationStore.getState().count;

  const getGeoLocaation = () => {
    const config = {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 0,
      forceLocationManager: true,
      forceRequestLocation: true,
    };

    Geolocation.getCurrentPosition(
      info => {
        console.log('==location erro==  INFO :: ', info);
        console.log('latitude getlocation:: ' + info.coords.latitude);
        console.log('longitude getlocation:: ' + info.coords.longitude);
        console.log(
          'position.coords.latitude :: ' +
            parseFloat(info.coords.latitude.toFixed(6)),
        );
        console.log(
          'position.coords.longitude :: ' +
            parseFloat(info.coords.longitude.toFixed(6)),
        );
        setLatitude(parseFloat(info.coords.latitude.toFixed(6)));
        setLongitude(parseFloat(info.coords.longitude.toFixed(6)));
        setLoading(false);
      },
      error => console.log('==location erro==  ERROR', error),
      config,
    );
  };

  useEffect(() => {
    setLoading(true);
    getGeoLocaation();
    // Get users current location online/offline
    if (lat === '') {
      Geolocation.getCurrentPosition(
        position => {
          console.log('latitude :: ' + position.coords.latitude);
          console.log('longitude :: ' + position.coords.longitude);
          console.log(
            'position.coords.latitude :: ' +
              parseFloat(position.coords.latitude.toFixed(6)),
          );
          console.log(
            'position.coords.longitude :: ' +
              parseFloat(position.coords.longitude.toFixed(6)),
          );
          setLatitude(parseFloat(position.coords.latitude.toFixed(6)));
          setLongitude(parseFloat(position.coords.longitude.toFixed(6)));
          setLoading(false);
        },
        error => {
          console.log('==location erro== ' + error.message);
          console.log('==location erro== ' + JSON.stringify(error));
          console.log('==location erro== ' + error.code);
          //   var message = '';
          // if (error.POSITION_UNAVAILABLE == 2) {
          //     message = 'Not able to get Latitude & Longitude, please turn on your Location to continue.'
          // } else {
          //     message = 'Not able to get Latitude & Longitude, please try again after later.'
          // }
          Alert.alert('Alert!', error.message, [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack(null);
              },
            },
          ]);
        },
        {
          // enableHighAccuracy: false,
          // timeout: 8000,
          // maximumAge: 0,
          // forceLocationManager: true,
          // forceRequestLocation: true,
          enableHighAccuracy: false,
          timeout: 20000,
          maximumAge: 60000,
        },
      );
    }

    // This function is to get token to call the APIs
    AsyncStorage.getItem('token', (err, item) => {
      console.log(
        '============token======================token=========== ' + item,
      );
      setToken(item);
      setDateTime(item);
    });
  }, []);

  const setDateTime = item => {
    // setLoading(true);
    NetInfo.fetch().then(state => {
      setConnected(state.isConnected);
      if (state.isConnected) {
        setLoading(true);
        console.log('getting server time in clock IN...', item);
        callApiToGetSrverTime(item);
      } else {
        Alert.alert(
          'Alert!',
          'Please check the internet connection to get data.',
        );
      }
    });
  };

  const callApiToGetSrverTime = async item => {
    console.log('token123 In Employee ClockIn:: ' + item);
    console.log('timer in clockIn...');
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + item,
        'Content-Type': 'application/json',
      },
    };
    console.log('requestOptions in ClockIn--', requestOptions);
    await fetch(BASE_URL + 'Attendance/GetServerTime', requestOptions)
      .then(response => {
        console.log('====response.ok=====' + response.ok);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong :: ' + response.status);
        }
      })
      .then(data => {
        let json = data;
        let date = json.data.date;
        console.log('total timer data---', json.data);
        if (Platform.OS === 'android') {
          var today = new Date(date);
          var formattedDate = format(today, 'dd/MM/yyyy');
          setDate(formattedDate);
          setTime(json.data.time);
          // var formattedDate_1 = format(today, "yyyy-MM-dd " + (json.data.time).replace('AM', '').replace('PM', '').replace(' ', ''));
          setExactDate(json.data.exactDate);
        } else {
          const formattedDate = moment(date, 'MMM DD, YYYY').format(
            'DD/MM/yyyy',
          );
          setDate(formattedDate);
          setTime(json.data.time);
          console.log('total time data in iOS---', json.data.exactDate);
          // var formattedDate_1 = moment(date, "MMM DD, YYYY").format("yyyy-MM-DD ") + (json.data.time).replace('AM', '').replace('PM', '').replace(' ', '');
          setExactDate(json.data.exactDate);
        }
        // startTimer();
        // startTimerBasedOnCondition(true);
      })
      .catch(error => {
        // stopTimer();
        // setTempData('==ERROR== : ' + error);
        console.log('==ERROR== : ' + error);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // This function is to set the UI
  return (
    // <SafeAreaView style={{flex: 1}}>
      <View style={loginPageStyles.container}>
        <StatusBar barStyle="default" backgroundColor="#FA0F0A" />
        <View style={{flexDirection: 'column'}}>
          <Image
            style={EmployeesUploadDocumentsPageStyles.top_image}
            source={require('../assets/images/top_image_1.png')}
          />
          <View style={clockInPageStyles.top_image_layer} />
          <TouchableNativeFeedback
            onPress={() => {
              // stopTimer();
              navigation.goBack(null);
            }}
            style={employeesForgotPasswordPageStyles.back_btn_layout}>
            <View style={clockInPageStyles.back_view}>
              <Image
                style={clockInPageStyles.back_btn}
                source={require('../assets/images/ic_back.png')}
              />
              <Text style={clockInPageStyles.back_text}>Clock In</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableOpacity
            style={{position: 'absolute', alignSelf: 'flex-end', marginTop: 20}}
            onPress={() => {
              navigation.navigate('Notifications');
            }}>
            <View style={{flexDirection: 'row', paddingEnd: 8, marginTop: 20}}>
              <Image
                style={loginPageStyles.svg_bell_icons_white}
                source={require('../assets/images/notification.png')}
              />
              {notificationCount > 0 ? (
                <View style={EmployeesUploadDocumentsPageStyles.circle_badge}>
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      color: 'white',
                      fontSize: 10,
                    }}>
                    {notificationCount}
                  </Text>
                </View>
              ) : (
                <View
                  style={EmployeesUploadDocumentsPageStyles.white_circle_badge}
                />
              )}
            </View>
          </TouchableOpacity>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            keyboardShouldPersistTaps={'handled'}
            style={{
              flexGrow: 1,
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 10,
            }}
            enableResetScrollToCoords={false}>
            <View style={EmployeesUploadDocumentsPageStyles.content_container}>
              <View style={clockInPageStyles.btn_container}>
                <Text style={clockInPageStyles.text}>Start Latitude</Text>
                <View style={clockInPageStyles.edit_bg}>
                  <Image
                    style={loginPageStyles.svg_icons}
                    source={require('../assets/images/pin.png')}
                  />
                  <TextInput
                    style={loginPageStyles.input}
                    keyboardType="default"
                    placeholder="Latitude"
                    value={lat.toString()}
                    placeholderTextColor="#e0e0e0"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
                <Text style={clockInPageStyles.text}>Start Longitude</Text>
                <View style={clockInPageStyles.edit_bg}>
                  <Image
                    style={loginPageStyles.svg_icons}
                    source={require('../assets/images/pin.png')}
                  />
                  <TextInput
                    style={loginPageStyles.input}
                    keyboardType="default"
                    placeholder="Longitude"
                    value={lng.toString()}
                    placeholderTextColor="#e0e0e0"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
                <Text style={clockInPageStyles.text}>Start Date</Text>
                <View style={clockInPageStyles.edit_bg}>
                  <Image
                    style={loginPageStyles.svg_icons}
                    source={require('../assets/images/pin.png')}
                  />
                  <TextInput
                    style={loginPageStyles.input}
                    keyboardType="default"
                    placeholder="Start Date"
                    value={date}
                    placeholderTextColor="#e0e0e0"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
                <Text style={clockInPageStyles.text}>Start Time</Text>
                <View style={clockInPageStyles.edit_bg}>
                  <Image
                    style={loginPageStyles.svg_icons}
                    source={require('../assets/images/pin.png')}
                  />
                  <TextInput
                    style={loginPageStyles.input}
                    keyboardType="default"
                    placeholder="Start Time"
                    value={time}
                    placeholderTextColor="#e0e0e0"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    NetInfo.fetch().then(state => {
                      if (state.isConnected) {
                        // if (!sessionExpired) {
                        if (lat !== '') {
                          if (date !== '') {
                            navigation.navigate('EmployeesUploadDocuments', {
                              token: token,
                              datetime: exactDate,
                              date: date,
                              time: time,
                              lat: lat,
                              lng: lng,
                              clockType: 1,
                              branch,
                            });
                          } else {
                            Alert.alert(
                              'Alert!',
                              'Not able to get date and time, please try after sometime.',
                            );
                          }
                        } else {
                          Alert.alert(
                            'Alert!',
                            'Not able to get Location, please try after sometime.',
                          );
                        }
                      } else {
                        Alert.alert(
                          'Alert!',
                          'The Clock In functionality is only available while connected to the internet.',
                        );
                      }
                    });
                  }}
                  style={EmployeesUploadDocumentsPageStyles.btn_upload}>
                  <Text style={loginPageStyles.btn_text}>Clock In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
        <Modal
          isVisible={loading}
          style={{
            position: 'relative',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color={'#fff'} />
        </Modal>
      </View>
    // </SafeAreaView>
  );
};

export default EmployeesClockIn;
