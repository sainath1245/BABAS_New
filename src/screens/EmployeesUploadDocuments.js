import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image, Keyboard,
  StatusBar,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import ModalDropdown from 'react-native-modal-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    clockInPageStyles,
    employeesForgotPasswordPageStyles,
    employeesSuccessMessagePageStyles,
    EmployeesUploadDocumentsPageStyles,
    loginPageStyles
} from '../utils/styles';
import ImagePicker from 'react-native-image-crop-picker';
import Marker from "react-native-image-marker";
import Modal from "react-native-modal";
import { Dimensions } from 'react-native';
import { request, PERMISSIONS } from 'react-native-permissions';
import NetInfo from "@react-native-community/netinfo";
import { openDatabase } from 'react-native-sqlite-storage';
import { BASE_URL } from '../utils/consts';
import { insertClock } from '../../database/local_database';
import notificationStore from '../../notification_redux/notificationStore';
import ViewShot from "react-native-view-shot";
// import {useTimer} from '../utils/SessionContext';

var db = openDatabase({ name: 'BABAS_DB.db' });

const EmployeesUploadDocuments = ({ route, navigation }) => {
    const [selectedValue, setSelectedValue] = useState('Attendance Type');
    const [selectedValueToSend, setSelectedValueTosend] = useState('Attendance Type');
    const [dropDown, setDropDown] = useState(false);
    const [remark, setRemark] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [imageUri_1, setImageUri_1] = useState('');
    const [isImagePopupVisible, setImagePopupVisible] = useState(false);
    const [isConnected, setConnected] = useState();
    const [userId, setUserId] = useState('');
    const [attendanceType, setAttendanceType] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isBtnClicked, setBtnClicked] = useState(false);
    // const [exactDateInUpload, setExactDateInUpload] = useState('');

    var notificationCount = notificationStore.getState().count;
    const { token, datetime, date, time, lat, lng, clockType, branch } = route.params;

    console.log('Date: ' + date + ' ' + time + '\n' + 'Latitude :' + lat + '\n' + 'Longitude: ' + lng + '\n' + token + '\n' + datetime + '\n' + clockType, branch)

    const [shopName, setShopName] = useState(branch);
    const [shopLocation, setShopLocation] = useState(branch);

    const [branch_1, setBranch] = useState(branch);
    const [shop_1, setShop] = useState(branch);

    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height;

    const ref = useRef();
//   const {timer, stopTimer, sessionExpired} = useTimer();
//   const [appState, setAppState] = useState(AppState.currentState);
  const [userData, setUserData] = useState([]);
  const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        // This function to get userId and userdata from local DB
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user',
                [],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    setUserId(temp[0].userId);
                    setUserData(temp);
                }
            );
        });

        // This functio to get attendace type from local DB to perform clock in/out in offline mode
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM attendance_type',
                [],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    console.log(' TEMP :: ::' + JSON.stringify(temp) + "\n length: " + temp.length)
                    if (temp.length <= 0) {
                        getWorkType();
                    } else {
                        setAttendanceType(temp);
                    }
                }
            );
        });
        checkInternet();
        // const handleAppStateChange = (nextAppState) => {
        //     if (appState.match(/inactive|background/) && nextAppState === 'active') {
        //     // App has returned from the background
        //     console.log('App returned to foreground');
        //     } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        //     // App has entered the background
        //     console.log('App entered background');
        //     // stopTimer();
        //         }
        //         setAppState(nextAppState);
        //       };
          
        //       // Subscribe to app state changes
        //       const subscription = AppState.addEventListener('change', handleAppStateChange);
          
        //       return () => {
        //         // Unsubscribe from app state changes when component unmounts
        //         subscription.remove();
        //       };
    }, []);

    // This function is to capture the screenshot for the Image popup 
    const onCapture = useCallback(uri => {
        if (imageUri_1 === '') {
            console.log("do something with ", uri);
            setImageUri_1(uri);
        } else {
            console.log("do something with no image ", uri);
        }
    }, []);

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternet = () => {
        NetInfo.fetch().then(state => {
            setConnected(state.isConnected);
        });
        return (isConnected);
    }

    // This function is to get All attendanceType 
    getWorkType = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        };
        await fetch(BASE_URL + 'Admin/GetWorkType',
            requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong :: ' + response.status);
                }
            })
            .then((data) => {
                console.log('==== resp  onseCode==== ' + data.responseCode);
                let json = data;
                console.log('==== resp  onseCode==== ' + json.responseCode);
                if (json.responseCode == 200) {
                    console.log('resposne ========= ===== ====11::: :  ' + JSON.stringify(json.data))
                    setAttendanceType(json.data);
                } else {
                    Alert.alert(
                        "Alert!",
                        json.responseMessage,
                    )
                }
            })
            .catch((error) => {
                console.log('==ERROR== : ' + error)
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // This function is to save clock in/out request to server 
    saveClockIn = async () => {
        var number = parseInt(userId);

        var imageData = {
            uri: imageUri_1,
            type: 'image/jpeg', //the mime type of the file
            name: date + time + 'image.jpg'
        }
        const data = new FormData()
        data.append("userID", number)
        data.append("longitude", lng)
        data.append("latitude", lat)
        data.append("startDate", date)
        data.append("startTime", time)
        data.append("startDateTime", datetime)
        data.append("requestType", clockType)
        data.append("workType", selectedValueToSend)
        data.append("shopName", shopName)
        data.append("location", shopLocation)
        data.append("remark", remark)
        data.append('image', imageData)
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            body: data
        };
        console.log('======REQUEST BODY======= ' + JSON.stringify(requestOptions.body));
        await fetch(BASE_URL + 'Attendance/SaveAttendanceRequest/',
            requestOptions)
            .then(response => {
                console.log('==== resp  onseCode 11 - ==== ' + response.responseCode);
                console.log('==== resp  onseCode 11 - ==== ' + response.ok);
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong :: ' + response.status);
                }
            })
            .then((data) => {
                let json = data;
                console.log('==== resp  onseCode 11 - ==== ' + json.responseCode);
                if (json.responseCode == 200) {
                    console.log('resposne ========= ===== ==== ' + JSON.stringify(json.data.requestID))
                    AsyncStorage.setItem('lastAction', clockType + '');
                    navigation.reset({
                        index: 0,
                        routes: [{
                            name: "EmployeesSuccessMessage",
                            params: { requestID: JSON.stringify(json.data.requestID) }
                        }],
                    });
                } else {
                    Alert.alert(
                        "Alert!",
                        json.responseMessage,
                    )
                }
            })
            .catch((error) => {
                console.log('==ERROR== : ' + error)
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // This function is to launch camera to capture the image 
    const launchCamera = () => {
        request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then((result) => {
            // setPermissionResult(result)
            if (result === 'granted') {
                request(Platform.OS === 'ios' ? null : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
                    // setPermissionResult(result)
                    if (result === 'granted') {
                        // let options = {
                        //     storageOptions: {
                        //         skipBackup: true,
                        //         path: 'images',
                        //     },
                        //     quality: 0.7,
                        //     cameraType: 'front',
                        //     maxWidth: 1200,
                        //     maxHeight: 1200
                        // };
                        setTimeout(() => {
                            try {
                                ImagePicker.openCamera({
                                    width: 900,
                                    height: 1200,
                                    cropping: false,
                                    quality: 0.7,
                                    useFrontCamera: true,
                                }).then(image => {
                                    console.log('==image==image==image==:: :: ' + JSON.stringify(image));
                                    console.log('==image==image==image==:: :: ' + image.path);
                                    // markText(image.path);
                                    setImageUri('file://' + image.path)
                                    console.log("the path is : " + image.path)
                                    setImagePopupVisible(true);
                                }).then(error => {
                                    // alert(error)
                                });
                            } catch (e) {
                                alert(e)
                            }
                        }, 100);
                    } else {
                        setTimeout(() => {
                            try {
                                ImagePicker.openCamera({
                                    width: 900,
                                    height: 1200,
                                    cropping: false,
                                    quality: 0.7,
                                    useFrontCamera: true,
                                }).then(image => {
                                    console.log('==image==image==image==:: :: ' + JSON.stringify(image));
                                    console.log('==image==image==image==:: :: ' + image.path);
                                    // markText(image.path);
                                    setImageUri('file://' + image.path)
                                    console.log("the path is : " + image.path)
                                    setImagePopupVisible(true);
                                }).then(error => {
                                    // alert(error)
                                });
                            } catch (e) {
                                alert(e)
                            }
                        }, 100);
                    }
                });
            }
        });
    }

    // This function is to set Date, Time, Latitude & Longitude over image 
    const markText = ((image_uri) => {
        var font_size = 0
        if (Platform.OS === 'ios') {
            font_size = 120
        } else {
            if (height <= 640) {
                font_size = height / 48 * 12
            } else if (height <= 782) {
                font_size = height / 72 * 5.5
            } else if (height <= 790) {
                font_size = height / 72 * 4
            } else if (height <= 792) {
                font_size = height / 48 * 12
            } else if (height <= 824) {
                font_size = height / 72 * 4
            } else if (height <= 838) {
                font_size = height / 48 * 5
            } else if (height <= 854) {
                font_size = height / 72 * 4
            } else if (height >= 890) {
                font_size = height / 72 * 4
            } else {
                font_size = height / 48 * 2
            }
        }

        Marker.markText({
            src: image_uri,
            text: date + ' ' + time + '\n' + 'Latitude: ' + lat + '\n' + 'Longitude: ' + lng,
            color: '#ffffff',
            fontSize: font_size,
            padding: 5,
            position: 'bottomLeft',
            fontName: 'OpenSans-Regular',
            shadowStyle: {
                dx: 0,
                dy: 0,
                radius: 0,
                color: '#000000'
            },
            textBackgroundStyle: {
                type: 'stretchX',
                paddingX: 0,
                paddingY: 0,
                color: '#000000',
            },
            scale: 1,
            quality: 50,
        }).then((res) => {
            setImageUri('file://' + res)
            console.log("the path is : " + res)
            setImagePopupVisible(true);

        }).catch((err) => {
            console.log('error ::: ' + err)
        })
    })

    // This function is to set Attendace type data into Drop-down menu 
    const renderDropDownList = (rowData) => {
        if (rowData.typeValue == undefined) {
            return <Text style={{ fontFamily: 'OpenSans-Regular', color: '#000', fontSize: 11, fontWeight: "300", padding: 6 }}>{rowData.workName}</Text>
        } else {
            return <Text style={{ fontFamily: 'OpenSans-Regular', color: '#000', fontSize: 11, fontWeight: "300", padding: 6 }}>{rowData.typeValue}</Text>
        }
    }

    const changeLocation = (value) => {
        setBranch(value)
        setShopLocation(value)
    }

    const changeShopName = (value) => {
        setShop(value)
        setShopName(value)
    }
    callApiToGetSrverTime = async item => {
    // console.log('timer in Upload Docs...');
    let timerDifferenceinSeconds = 0;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + item,
            'Content-Type': 'application/json',
          },
        };
        await fetch(BASE_URL + 'Attendance/GetServerTime', requestOptions)
          .then(response => {
            console.log('====response.ok in upload=====' + response.ok);
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Something went wrong :: ' + response.status);
            }
          })
          .then(data => {
            let json = data;
            let date = json.data.date;
            // console.log('Timer data in upload---', datetime, json.data.exactDate);
            // setExactDateInUpload(json.data.exactDate);
            timerDifferenceinSeconds = getTimeDifferenceInSeconds(datetime, json.data.exactDate);
            // console.log('time diff val --', timerDifferenceinSeconds);
          })
          .catch(error => {
            // stopTimer();
            console.log('==ERROR while fetching date and time in upload : ' + error);
            
          })
          .finally(() => {
            setLoading(false);
            console.log('response got successfully in finally -- ',timerDifferenceinSeconds );
            if (timerDifferenceinSeconds == 0) {
                Alert.alert(
                    "Alert!",
                    "Something went wrong. Please try again.",
                )
            } else if (timerDifferenceinSeconds > 180) {
                setSessionExpired(true);
                showAlertWhenSessionExpired();
            } else {
                console.log('about to start upload from here...');
                setLoading(true);
                saveClockIn();
            }
          });
      };
      const showAlertWhenSessionExpired = () => {
        Alert.alert(
                    "Alert!",
                    'Your Session expired. Please start Clock In / Clock Out again.',
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        {
                            text: "Ok",
                            onPress: () => {
                                console.log('session expired in upload documents', userData);
                                if (userData.length > 0 ){
                                    if (userData[0].userRole == 3) {
                                        console.log('role - 3');
                                        navigation.reset({
                                            index: 0,
                                            routes: [{
                                                name: 'EmployeesHomeDrawer',
                                                screen: "Home"
                                            }],
                                        });
                                    } else if (userData[0].userRole == 2) {
                                        console.log('role-2');
                                        navigation.reset({
                                            index: 0,
                                            routes: [{
                                                name: 'SuperVisorHomeDrawer',
                                                screen: "Home"
                                            }],
                                        });
                                    } else if (userData[0].userRole == 1) {
                                        console.log('role-1');
                                        navigation.reset({
                                            index: 0,
                                            routes: [{
                                                name: 'AdminHomeDrawer',
                                                screen: "AdminDashboard"
                                            }],
                                        });
                                    }
                                }
                            }
                        }
                    ]
                )
      }
      //diff in timers before --', '2024-03-21 19:21:27.548', '2024-03-21 19:21:33.428'
    function getTimeDifferenceInSeconds(time1, time2) {
        if (Platform.OS === 'android') {
        // Parse the time strings into Date objects
        // console.log('diff in timers before getTime--', time1, time2);
        // const date1 = new Date(time1).getTime();
        // const date2 = new Date(time2).getTime();

        let dateParam1 = time1.split(/[\s-:]/);
        // console.log('diff dateparam2--', dateParam1);
        dateParam1[1] = (parseInt(dateParam1[1], 10) - 1).toString();
        // console.log('diff res of dateParam-1', dateParam1);
        const finalVal1 =  new Date(...dateParam1);
        // console.log('diff finalVal 1--', finalVal1);

        let dateParam2 = time2.split(/[\s-:]/);
        // console.log('diff dateparam2--', dateParam2);
        dateParam2[1] = (parseInt(dateParam2[1], 10) - 1).toString();
        // console.log('diff res of dateParam-2', dateParam2);
        const finalVal2 =  new Date(...dateParam2);
        // console.log('diff finalVal 2--', finalVal2);
        const diffInMillSec = Math.abs(finalVal1 - finalVal2);
        // console.log('diff in mill sec is --', diffInMillSec);
        const diffInSec = parseInt(diffInMillSec / 1000);
        console.log('Diff in Sec Andriod---', diffInSec);
        // const date1 = new Date(time1.replace(/-/g, '/'));
        // const date2 = new Date(time2.replace(/-/g, '/'));
        // const date1 = new Date(time1).getTime();
        // const date2 = new Date(time2).getTime();
        // const date1 = new Date(`${time1}`).getTime();
        // const date2 = new Date(`${time2}`).getTime();
        // const date1 = new Date("2024-03-21 19:21:27.548");
        // const date2 = new Date("2024-03-21 19:21:33.428");
        // console.log('diff in two timmers - ', time1, time2);
        // console.log('diff in before date1 and date2 are --', date1, date2);
        //getting as Invalid Date for date1 and date2

        // Calculate the difference in milliseconds
        // const differenceMilliseconds = Math.abs(date1 - date2);
    //   console.log('diff in mill secs', differenceMilliseconds);
        // Convert difference to seconds
        // const differenceSeconds = parseInt(differenceMilliseconds / 1000);
        // console.log('diff in secs---', differenceSeconds);
        return diffInSec;
        } else {
        const date1 = new Date(time1);
        const date2 = new Date(time2);
        // console.log('diff in two timmers - ', time1, time2);
        // console.log('date1 and date2 are --', date1, date2);
        // Calculate the difference in milliseconds
        const differenceMilliseconds = Math.abs(date1 - date2);
        // console.log('diff in mill secs', differenceMilliseconds);
        // Convert difference to seconds
        const differenceSeconds = parseInt(differenceMilliseconds / 1000);
        console.log('diff in secs iOS---', differenceSeconds);
        return differenceSeconds;
        }
      }

    // This function is to set the UI 
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={loginPageStyles.container}>
                <StatusBar barStyle="default"
                    backgroundColor="#FA0F0A" />
                <View style={{ flexDirection: 'column' }}>
                    <Image
                        style={EmployeesUploadDocumentsPageStyles.top_image}
                        source={require('../assets/images/top_image_1.png')}
                    />
                    <View style={employeesForgotPasswordPageStyles.top_image_layer} />
                    <TouchableNativeFeedback
                        onPress={() => { navigation.goBack(null) }}
                        style={employeesForgotPasswordPageStyles.back_btn_layout}>
                        <View style={clockInPageStyles.back_view}>
                            <Image
                                style={clockInPageStyles.back_btn}
                                source={require('../assets/images/ic_back.png')}
                            />
                            <Text style={clockInPageStyles.back_text}>
                                Upload Image
                            </Text>
                        </View>
                    </TouchableNativeFeedback >
                    <TouchableOpacity
                        style={{ position: 'absolute', alignSelf: 'flex-end', marginTop: 20 }}
                        onPress={() => { navigation.navigate('Notifications') }}>
                        <View style={{ flexDirection: 'row', paddingEnd: 8 }}>
                            <Image
                                style={loginPageStyles.svg_bell_icons}
                                source={require('../assets/images/notification.png')}
                            />
                            <View style={EmployeesUploadDocumentsPageStyles.circle_badge}>
                                <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 10 }}>
                                    {notificationCount}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <KeyboardAwareScrollView enableOnAndroid={true}
                        keyboardShouldPersistTaps='handled'
                        enableResetScrollToCoords={false}>
                        <View style={EmployeesUploadDocumentsPageStyles.content_container}>
                            <View style={clockInPageStyles.btn_container}>
                                <View style={EmployeesUploadDocumentsPageStyles.container}>
                                    <Text style={EmployeesUploadDocumentsPageStyles.upload_text}>
                                        Upload Image
                                    </Text>
                                    <View style={EmployeesUploadDocumentsPageStyles.circle}>
                                        <Image
                                            style={EmployeesUploadDocumentsPageStyles.upload_btn}
                                            source={require('../assets/images/ic_upload.png')}
                                        />
                                    </View>
                                    {
                                        imageUri.length > 0 ? <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                                            <TouchableOpacity
                                                onPress={() => setImagePopupVisible(true)}>
                                                <Text style={EmployeesUploadDocumentsPageStyles.file_name_text}>
                                                    Image.jpeg
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setImageUri('')
                                                    setImageUri_1('')
                                                }}>
                                                <Image
                                                    style={EmployeesUploadDocumentsPageStyles.camera_btn}
                                                    source={require('../assets/images/cross.png')}
                                                />
                                            </TouchableOpacity>
                                        </View> : null
                                    }
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        // navigation.navigate('Login')
                                        Alert.alert(
                                            "Alert!",
                                            "1. Please ensure your photo is taken with bright background/no blurry image.\n2. Please check your photo before click save.",
                                            [
                                                {
                                                    text: "Cancel",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                },
                                                {
                                                    text: "OK",
                                                    onPress: () => {
                                                        launchCamera()
                                                    }
                                                }
                                            ],
                                        )
                                    }}
                                    style={EmployeesUploadDocumentsPageStyles.btn}>
                                    <View style={EmployeesUploadDocumentsPageStyles.btn_container}>
                                        <Image
                                            style={EmployeesUploadDocumentsPageStyles.camera_btn}
                                            source={require('../assets/images/ic_camera.png')}
                                        />
                                        <Text style={EmployeesUploadDocumentsPageStyles.btn_text}>
                                            Use Camera
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={EmployeesUploadDocumentsPageStyles.dropdown}
                                    onPress={() => { dropDown && dropDown.show(); }}>
                                    <View style={EmployeesUploadDocumentsPageStyles.drop_container}>
                                        <ModalDropdown ref={(el) => { setDropDown(el) }}
                                            options={attendanceType}
                                            renderRow={(rowData) => renderDropDownList(rowData)}
                                            textStyle={EmployeesUploadDocumentsPageStyles.drop_text}
                                            dropdownStyle={EmployeesUploadDocumentsPageStyles.drop_1}
                                            saveScrollPosition={false}
                                            onSelect={
                                                (e) => {
                                                    console.log('att :::: ' + attendanceType.length)
                                                    if (attendanceType[e].typeValue == undefined) {
                                                        console.log('ABC 1--- ' + attendanceType[e].workName)
                                                        var temp = attendanceType[e].workName;
                                                        setSelectedValue(temp)
                                                        setSelectedValueTosend(attendanceType[e].workId)
                                                    } else {
                                                        console.log('ABC 2--- ' + attendanceType[e].typeValue)
                                                        var temp = attendanceType[e].typeValue;
                                                        setSelectedValue(temp)
                                                        setSelectedValueTosend(attendanceType[e].typeId)
                                                    }
                                                }}
                                        />
                                        <View style={{ position: 'absolute', backgroundColor: '#fff', width: 200 }}>
                                            <Text style={{ fontFamily: 'OpenSans-Regular', marginLeft: 10 }}>
                                                {selectedValue}
                                            </Text>
                                        </View>
                                        <View style={EmployeesUploadDocumentsPageStyles.drop_icon}>
                                            <Text>▼</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={EmployeesUploadDocumentsPageStyles.location_container}>
                                    <View style={EmployeesUploadDocumentsPageStyles.edit_shop}>
                                        <Image
                                            style={loginPageStyles.svg_icons}
                                            source={require('../assets/images/ic_shop.png')}
                                        />
                                        <TextInput
                                            maxLength={20}
                                            style={loginPageStyles.input}
                                            keyboardType="default"
                                            placeholder="Shop Name"
                                            placeholderTextColor="#e0e0e0"
                                            onChangeText={(value) => changeShopName(value)}
                                            value={shop_1}
                                        />
                                    </View>
                                    <View style={EmployeesUploadDocumentsPageStyles.edit_location}>
                                        <Image
                                            style={loginPageStyles.svg_icons}
                                            source={require('../assets/images/pin.png')}
                                        />
                                        <TextInput
                                            maxLength={20}
                                            style={loginPageStyles.input}
                                            keyboardType="default"
                                            placeholder="Location"
                                            placeholderTextColor="#e0e0e0"
                                            onChangeText={(value) => changeLocation(value)}
                                            value={branch_1}
                                        />
                                    </View>
                                </View>
                                <View style={EmployeesUploadDocumentsPageStyles.edit_remark}>
                                    <TextInput
                                        multiline
                                        style={EmployeesUploadDocumentsPageStyles.input}
                                        keyboardType="default"
                                        placeholder="Remark(50 Chars)"
                                        placeholderTextColor="#e0e0e0"
                                        maxLength={50}
                                        numberOfLines={2}
                                        onChangeText={(value) => setRemark(value)}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        // console.log("shopName :::: :::: " + shopName)
                                        // console.log("shopLocation :::::: ::: " + shopLocation)
                                        // console.log('status--', checkInternet());
                                        // console.log('token in upload ---', token);
                                        Keyboard.dismiss();
                                        if (sessionExpired) {
                                            showAlertWhenSessionExpired();
                                            return;
                                        }
                                        // callApiToGetSrverTime(token);
                                        // if (sessionExpired) {
                                        //     Alert.alert(
                                        //         "Alert!",
                                        //         'Your Session expired. Please start Clock In / Clock Out again',
                                        //         [
                                        //             {
                                        //                 text: "Cancel",
                                        //                 onPress: () => console.log("Cancel Pressed"),
                                        //                 style: "cancel"
                                        //             },
                                        //             {
                                        //                 text: "Ok",
                                        //                 onPress: () => {
                                        //                     console.log('session expired in upload documents', userData);
                                        //                     if (userData.length > 0 ){
                                        //                         if (userData[0].userRole == 3) {
                                        //                             console.log('role - 3');
                                        //                             navigation.reset({
                                        //                                 index: 0,
                                        //                                 routes: [{
                                        //                                     name: 'EmployeesHomeDrawer',
                                        //                                     screen: "Home"
                                        //                                 }],
                                        //                             });
                                        //                         } else if (userData[0].userRole == 2) {
                                        //                             console.log('role-2');
                                        //                             navigation.reset({
                                        //                                 index: 0,
                                        //                                 routes: [{
                                        //                                     name: 'SuperVisorHomeDrawer',
                                        //                                     screen: "Home"
                                        //                                 }],
                                        //                             });
                                        //                         } else if (userData[0].userRole == 1) {
                                        //                             console.log('role-1');
                                        //                             navigation.reset({
                                        //                                 index: 0,
                                        //                                 routes: [{
                                        //                                     name: 'AdminHomeDrawer',
                                        //                                     screen: "AdminDashboard"
                                        //                                 }],
                                        //                             });
                                        //                         }
                                        //                     }
                                        //                 }
                                        //             }
                                        //         ]
                                        //     )
                                        //     return;
                                        // }
                                        if (selectedValue !== 'Attendance Type') {
                                            if (shopName.length !== 0 && shopLocation.length !== 0 && remark.length !== 0) {
                                                if (imageUri.length > 0) {
                                                    if (!isBtnClicked) {
                                                        setBtnClicked(true)
                                                        setTimeout(() => {
                                                            setBtnClicked(false)
                                                        }, 2000);
                                                        if (checkInternet()) {
                                                            setLoading(true);
                                                            callApiToGetSrverTime(token)
                                                            // setLoading(true);
                                                            // saveClockIn();
                                                        } else {
                                                            // Alert.alert(
                                                            //     "Alert!",
                                                            //     "(Offline) No internet connection. Your request is currently saved in local device temporarily. Kindly submit your request when internet connection is available.",
                                                            //     [
                                                            //         {
                                                            //             text: "Cancel",
                                                            //             onPress: () => console.log("Cancel Pressed"),
                                                            //             style: "cancel"
                                                            //         },
                                                            //         {
                                                            //             text: "OK",
                                                            //             onPress: () => {
                                                            //                 var number = parseInt(userId);
                                                            //                 // var imageData = {
                                                            //                 //     uri: imageUri,
                                                            //                 //     type: 'image/jpeg', //the mime type of the file
                                                            //                 //     name: date + time + 'image.jpg'
                                                            //                 // }
                                                            //                 AsyncStorage.setItem('lastAction', clockType + '');
                                                            //                 insertClock(db, number, lng, lat, date, time, datetime, clockType, selectedValueToSend, shopName, shopLocation, remark, imageUri_1)
                                                            //                 navigation.reset({
                                                            //                     index: 0,
                                                            //                     routes: [{
                                                            //                         name: "EmployeesSuccessMessage",
                                                            //                         params: { requestID: 0 }
                                                            //                     }],
                                                            //                 });
                                                            //             }
                                                            //         }
                                                            //     ]
                                                            // )
                                                            Alert.alert(
                                                                "Alert!",
                                                                "The Clock In / Clock Out functionality is only available while connected to the internet.",
                                                            )
                                                        }
                                                    }
                                                } else {
                                                    Alert.alert(
                                                        "Alert!",
                                                        "Please take Photo.",
                                                    )
                                                }
                                            } else {
                                                Alert.alert(
                                                    "Alert!",
                                                    "Shop name, shop location & remark should not be empty.",
                                                )
                                            }
                                        } else {
                                            Alert.alert(
                                                "Alert!",
                                                "Please select Attendance Type *",
                                            )
                                        }
                                    }}
                                    style={EmployeesUploadDocumentsPageStyles.btn_upload}>
                                    {loading ? <View style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                        {
                                            loading &&
                                            <ActivityIndicator color={'#fff'} />
                                        }
                                    </View> : <Text style={loginPageStyles.btn_text}>
                                        Submit
                                    </Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
                <Modal isVisible={isImagePopupVisible}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    useNativeDriver={true}>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'column', backgroundColor: 'white', width: width * .8, height: height * .6, alignSelf: 'center' }}>
                            <ViewShot ref={ref} onCapture={onCapture} captureMode="continuous" options={{ fileName: "Your-File-Name", format: "jpg", quality: 0.9 }}>
                                <View style={{ alignItems: 'center', height: '100%' }}>
                                    <Image
                                        source={{ uri: imageUri }}
                                        style={{
                                            width: '100%',
                                            height: '87%',
                                            resizeMode: 'center',
                                            resizeMode: 'contain'
                                        }}
                                    />
                                    <View style={{ width: '100%', padding: 10, bottom: 0, position: 'absolute', backgroundColor: 'black' }}>
                                        <Text style={{ fontSize: 14, color: 'white', fontFamily: 'OpenSans-Regular' }}>
                                            {date + ' ' + time + '\n' + 'Lat: ' + lat + '\n' + 'Long: ' + lng}
                                        </Text>
                                    </View>
                                </View>
                            </ViewShot>
                            <TouchableOpacity
                                onPress={() => {
                                    setImageUri('');
                                    setImageUri_1('');
                                    setImagePopupVisible(false)
                                }}
                                style={EmployeesUploadDocumentsPageStyles.circle_upload_image}>
                                <View style={employeesSuccessMessagePageStyles.circle_2}>
                                    <Image
                                        style={loginPageStyles.svg_icons_close}
                                        source={require('../assets/images/cross_1.png')}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                setImagePopupVisible(false)
                            }}
                            style={{
                                height: 45,
                                width: width * .8,
                                backgroundColor: '#fb0f0c',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bottom: 0
                            }}>
                            <Text style={loginPageStyles.btn_text}>
                                Confirm your photo?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

export default EmployeesUploadDocuments;