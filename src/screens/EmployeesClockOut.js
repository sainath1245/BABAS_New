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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clockInPageStyles, employeesForgotPasswordPageStyles, EmployeesUploadDocumentsPageStyles, loginPageStyles } from '../utils/styles';
import Geolocation from '@react-native-community/geolocation';
import { format } from "date-fns";
import { BASE_URL } from '../utils/consts';
import NetInfo from "@react-native-community/netinfo";
import Modal from "react-native-modal";
import notificationStore from '../../notification_redux/notificationStore';
import moment from 'moment';
// import {useTimer} from '../utils/SessionContext';

const EmployeesClockOut = ({route, navigation}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [exactDate, setExactDate] = useState('');
  const [lat, setLatitude] = useState('');
  const [lng, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [isConnected, setConnected] = useState();
  var notificationCount = notificationStore.getState().count;
  const {branch} = route.params;
//   const {startTimer, stopTimer, sessionExpired} = useTimer();
//   const [appState, setAppState] = useState(AppState.currentState);

    console.log('LOCATION ::: ::: ::: ' + branch)

    const getGeoLocaation = () => {
        const config = {
            enableHighAccuracy: false,
            timeout: 8000,
            maximumAge: 0,
            forceLocationManager: true,
            forceRequestLocation: true
        };

        Geolocation.getCurrentPosition(
            info => {
                console.log("==location erro==  INFO :: ", info)
                console.log('latitude :: ' + info.coords.latitude);
                console.log('longitude :: ' + info.coords.longitude);
                console.log('position.coords.latitude :: ' + parseFloat(info.coords.latitude.toFixed(6)));
                console.log('position.coords.longitude :: ' + parseFloat(info.coords.longitude.toFixed(6)));
                setLatitude(parseFloat(info.coords.latitude.toFixed(6)));
                setLongitude(parseFloat(info.coords.longitude.toFixed(6)));
                setLoading(false);
                // getAddressFromCoordinates(info.coords.latitude, info.coords.longitude);
            },
            error => console.log("==location erro==  ERROR", error),
            config,
        );
    };

    // function getAddressFromCoordinates(latitude, longitude) {
    //     console.log('getAddressFromCoordinates called here', latitude, longitude);
    //     // https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
    //     return new Promise((resolve) => {
    //         // const APIKey = 'AAAAdXij3fY:APA91bG1ssyCSee4Z6d1z_o68ozHblcthsOzcNlWL-i9k_8mHvXO7zPCzGHz7X9Qet7tZLDwvlUXADDague0q2jYdiJuT57ZEcS1ppPrf9k6yCQxSiar5xtrYA5hHBB4wyGjd9KwPRnl'
    //         // const APIKey = 'AAAAdXij3fY:APA91bFxljRRfZOXSzHo6mVuP8LtMEsC-kbau1Ck_sjRLJhCZ8XU_1pWCaBYSmngHi7FyEFDF9aGHW5Ps4Cm_o3KLZRBdbZgwwPVVGX5YVTg0vhXYtMAN3xMjXoTdHcKDemPU3kpnd-7'
    //         // const APIKey = 'AIzaSyBLRWKlB3r_mVOC0xZPgtuzQQHkNWbfSqE';
    //         //AIzaSyBLRWKlB3r_mVOC0xZPgtuzQQHkNWbfSqE //iOS
    //         //AIzaSyDruXLwXk6kMbJcFmvc5nynfEpfap9YG90 //Android
    //         //AIzaSyBuZ9EPtYH_OpcWiJQOATgtKwfxzRE9L7I //Android key in iOS app
    //         //AIzaSyCPWZ6CUK2Fy6zDr0SOrE5DRXc0w7EoTHA //Browser Key
    //     //   const url = `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${APIKey}&mode=retrieveAddresses&prox=${latitude},${longitude}`
    //     const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBLRWKlB3r_mVOC0xZPgtuzQQHkNWbfSqE`
    //       console.log('url for reverseGroCoding google--', url);
    //       fetch(url)
    //         .then(res => res.json())
    //         .then((resJson) => {
    //           // the response had a deeply nested structure :/
    //           console.log('resjson --- ', resJson);
    //           console.log('resjson additionalData --- ', resJson.additionalData);
    //           if (resJson
    //             && resJson.Response
    //             && resJson.Response.View
    //             && resJson.Response.View[0]
    //             && resJson.Response.View[0].Result
    //             && resJson.Response.View[0].Result[0]) {
    //             resolve(resJson.Response.View[0].Result[0].Location.Address.Label)
    //           } else {
    //             resolve()
    //           }
    //         })
    //         .catch((e) => {
    //           console.log('Error in getAddressFromCoordinates', e)
    //           resolve()
    //         })
    //     })
    //   }
    useEffect(() => {
        setLoading(true);

        getGeoLocaation();

        // Get users current location online/offline
        if (lat === '') {
            Geolocation.getCurrentPosition((position) => {
                console.log('latitude :: ' + position.coords.latitude);
                console.log('longitude :: ' + position.coords.longitude);
                console.log('position.coords.latitude :: ' + parseFloat(position.coords.latitude.toFixed(6)));
                console.log('position.coords.longitude :: ' + parseFloat(position.coords.longitude.toFixed(6)));
                setLatitude(parseFloat(position.coords.latitude.toFixed(6)));
                setLongitude(parseFloat(position.coords.longitude.toFixed(6)));
                setLoading(false);
                // checkInternet();
            },
                (error) => {
                    console.log('==location erro== ' + error.message)
                    console.log('==location erro== ' + JSON.stringify(error))
                    console.log('==location erro== ' + error.code)
                    var message = '';
                    if (error.POSITION_UNAVAILABLE == 2) {
                        message = 'Not able to get Latitude & Longitude, please turn on your Location to continue.'
                    } else {
                        message = 'Not able to get Latitude & Longitude, please try again after later.'
                    }
                    Alert.alert(
                        "Alert!",
                        message,
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    navigation.goBack(null)
                                }
                            }
                        ]
                    )
                },
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 }
            );
        }

        // This piece of code is to set Date * Time on UI
        // var today = new Date();
        // var formattedDate = format(today, "dd/MM/yyyy");
        // setDate(formattedDate);

        // var tempHours = today.getHours();
        // var hours = today.getHours();
        // var minutes = today.getMinutes();
        // var ampm = hours >= 12 ? 'PM' : 'AM';
        // hours = hours % 12;
        // hours = hours ? hours : 12; // the hour '0' should be '12'
        // minutes = minutes < 10 ? '0' + minutes : minutes;
        // var strTime = hours + ':' + minutes + ' ' + ampm;
        // setTime(strTime);

        // var formattedDate_1 = format(today, "yyyy-MM-dd " + tempHours + ':' + minutes);
        // console.log('formattedDate_1 ======== ' + formattedDate_1);
        // setExactDate(formattedDate_1);

        // This function is to get token to call the APIs
        AsyncStorage.getItem('token', (err, item) => {
            console.log('============token======================token=========== ' + item)
            setToken(item);
            setDateTime(item);
        })
        // const handleAppStateChange = nextAppState => {
        //     if (appState.match(/inactive|background/) && nextAppState === 'active') {
        //       // App has returned from the background
        //       stopTimer();
        //     } else if (
        //       appState === 'active' &&
        //       nextAppState.match(/inactive|background/)
        //     ) {
        //       // App has entered the background
        //       stopTimer();
        //     }
        //     setAppState(nextAppState);
        //   };
        //   // Subscribe to app state changes
        //   const subscription = AppState.addEventListener(
        //     'change',
        //     handleAppStateChange,
        //   );
        //   return () => {
        //     // Unsubscribe from app state changes when component unmounts
        //     subscription.remove();
        //   };
    }, []);

    const setDateTime = (item) => {
        setLoading(true);
        NetInfo.fetch().then(state => {
            setConnected(state.isConnected);
            if (state.isConnected) {
                callApiToGetSrverTime(item);
            } else {
                // This piece of code is to set Date * Time on UI
                // var today = new Date();
                // var formattedDate = format(today, "dd/MM/yyyy");
                // setDate(formattedDate);

                // var tempHours = today.getHours();
                // var hours = today.getHours();
                // var minutes = today.getMinutes();
                // var ampm = hours >= 12 ? 'PM' : 'AM';
                // hours = hours % 12;
                // hours = hours ? hours : 12; // the hour '0' should be '12'
                // minutes = minutes < 10 ? '0' + minutes : minutes;
                // var strTime = hours + ':' + minutes + ' ' + ampm;
                // setTime(strTime);

                // var formattedDate_1 = format(today, "yyyy-MM-dd " + tempHours + ':' + minutes);

                // console.log('formattedDate_1 ======== ' + formattedDate_1);
                // setExactDate(formattedDate_1);
                Alert.alert(
                    'Alert!',
                    'Please check the internet connection to get data.',
                  );
            }
        });
    }

    callApiToGetSrverTime = async (item) => {
        console.log('token :: ' + item)
        const requestOptions = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + item, 'Content-Type': 'application/json' },
        };
        await fetch(BASE_URL + 'Attendance/GetServerTime',
            requestOptions)
            .then(response => {
                console.log('====response.ok=====' + response.ok)
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong :: ' + response.status);
                }
            })
            .then((data) => {
                let json = data;
                let date = json.data.date;
                if (Platform.OS === 'android') {
                    var today = new Date(date);
                    var formattedDate = format(today, "dd/MM/yyyy");
                    setDate(formattedDate);
                    setTime(json.data.time);
                    // var formattedDate_1 = format(today, "yyyy-MM-dd " + (json.data.time).replace('AM', '').replace('PM', '').replace(' ', ''));
                    setExactDate(json.data.exactDate);
                } else {
                    const formattedDate = moment(date, "MMM DD, YYYY").format("DD/MM/yyyy");
                    setDate(formattedDate);
                    setTime(json.data.time);
                    // var formattedDate_1 = moment(date, "MMM DD, YYYY").format("yyyy-MM-DD ") + (json.data.time).replace('AM', '').replace('PM', '').replace(' ', '');
                    setExactDate(json.data.exactDate);
                }
                // startTimer();
            })
            .catch((error) => {
                // stopTimer()
                console.log('==ERROR== : ' + error)
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // This function is to set the UI
    return (
        // <SafeAreaView style={{ flex: 1 }}>
            <View style={loginPageStyles.container}>
                <StatusBar barStyle="default"
                    backgroundColor="#FA0F0A" />
                <View style={{ flexDirection: 'column' }}>
                    <Image
                        style={EmployeesUploadDocumentsPageStyles.top_image}
                        source={require('../assets/images/top_image_1.png')}
                    />
                    <View style={clockInPageStyles.top_image_layer} />
                    <TouchableNativeFeedback
                        onPress={() => { navigation.goBack(null) }}
                        style={employeesForgotPasswordPageStyles.back_btn_layout}>
                        <View style={clockInPageStyles.back_view}>
                            <Image
                                style={clockInPageStyles.back_btn}
                                source={require('../assets/images/ic_back.png')}
                            />
                            <Text style={clockInPageStyles.back_text}>
                                Clock Out
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableOpacity
                        style={{ position: 'absolute', alignSelf: 'flex-end', marginTop: 20 }}
                        onPress={() => { navigation.navigate('Notifications') }}>
                        <View style={{ flexDirection: 'row', paddingEnd: 8, marginTop: 20 }}>
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
                    <KeyboardAwareScrollView enableOnAndroid={true}
                        keyboardShouldPersistTaps={"handled"}
                        style={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20, marginTop: 10 }}
                        enableResetScrollToCoords={false}>
                        <View style={EmployeesUploadDocumentsPageStyles.content_container}>
                            <View style={clockInPageStyles.btn_container}>
                                <Text style={clockInPageStyles.text}>
                                    End Latitude
                                </Text>
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
                                        editable={false} selectTextOnFocus={false}
                                    />
                                </View>
                                <Text style={clockInPageStyles.text}>
                                    End Longitude
                                </Text>
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
                                        editable={false} selectTextOnFocus={false}
                                    />
                                </View>
                                <Text style={clockInPageStyles.text}>
                                    End Date
                                </Text>
                                <View style={clockInPageStyles.edit_bg}>
                                    <Image
                                        style={loginPageStyles.svg_icons}
                                        source={require('../assets/images/pin.png')}
                                    />
                                    <TextInput
                                        style={loginPageStyles.input}
                                        keyboardType="default"
                                        placeholder="End Date"
                                        value={date}
                                        placeholderTextColor="#e0e0e0"
                                        editable={false} selectTextOnFocus={false}
                                    />
                                </View>
                                <Text style={clockInPageStyles.text}>
                                    End Time
                                </Text>
                                <View style={clockInPageStyles.edit_bg}>
                                    <Image
                                        style={loginPageStyles.svg_icons}
                                        source={require('../assets/images/pin.png')}
                                    />
                                    <TextInput
                                        style={loginPageStyles.input}
                                        keyboardType="default"
                                        placeholder="End Time"
                                        value={time}
                                        placeholderTextColor="#e0e0e0"
                                        editable={false} selectTextOnFocus={false}
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
                                                clockType: 2,
                                                branch
                                            })
                                            } else {
                                                Alert.alert(
                                                    "Alert!",
                                                "Not able to get date and time, please try after sometime.",
                                                )
                                            }
                                        } else {
                                            Alert.alert(
                                                "Alert!",
                                                "Not able to get Location, please try after sometime.",
                                            )
                                        }
                                    // } else {
                                    //     Alert.alert(
                                    //         "Alert!",
                                    //         'Your Session expired. Please start Clock Out again',
                                    //         [
                                    //             {
                                    //                 text: "Cancel",
                                    //                 onPress: () => console.log("Cancel Pressed"),
                                    //                 style: "cancel"
                                    //             },
                                    //             {
                                    //                 text: "Clock Out",
                                    //                 onPress: () => {
                                    //                     navigation.goBack(null);
                                    //                 }
                                    //             }
                                    //         ]
                                    //     )
                                    // }
                                    } else {
                                        Alert.alert(
                                            "Alert!",
                                            "The Clock Out functionality is only available while connected to the internet.",
                                        )
                                    }
                                    })
                                }
                            }
                                    style={EmployeesUploadDocumentsPageStyles.btn_upload}>
                                    <Text style={loginPageStyles.btn_text}>
                                        Clock Out
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
                <Modal isVisible={loading} style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <ActivityIndicator color={'#fff'} />
                </Modal>
            </View>
        // </SafeAreaView>
    );
};

export default EmployeesClockOut;