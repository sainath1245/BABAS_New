import NetInfo from "@react-native-community/netinfo";
import React, {
    useEffect,
    useState
} from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    StatusBar,
    Text,
    View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ScrollView,
    TouchableOpacity
} from 'react-native-gesture-handler';
import Modal from "react-native-modal";
import { openDatabase } from 'react-native-sqlite-storage';
import { useDispatch } from 'react-redux';
import { clearLogin } from '../../actions/login_action';
import {
    deleteSingleClockRequest,
    deleteTableAllAttendanceType,
    deleteTableAllClockRequest,
    deleteTableAllRows,
    insertAttendanceType
} from '../../database/local_database';
import notificationStore from '../../notification_redux/notificationStore';
import { BASE_URL } from '../utils/consts';
import {
    employeesForgotPasswordPageStyles,
    employeesHomePageStyles,
    loginPageStyles
} from '../utils/styles';

var width_1 = Dimensions.get('window').width;
var db = openDatabase({ name: 'BABAS_DB.db' });

const SuperVisorHome = ({ navigation }) => {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [designation, setDesignation] = useState('');
    const [offlineData, setOfflineData] = useState('');
    const [offlineDataCount, setOfflineDataCount] = useState(0);
    const [location, setLocation] = useState('');
    const [lastActionCode, setLastActionCode] = useState();
    const [isUserOnLeave, setUserOnLeave] = useState();
    const [isHoliday, setHoliday] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        // This function to get userId and userName from local DB
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
                    setName(temp[0].firstName);
                    setDesignation(temp[0].desigination);
                    setLocation(temp[0].location);
                }
            );
        });

        // This function to get clock in/out data from local DB if availabe 
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM CLOCK_DATA',
                [],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                        console.log('======results.rows.item(i).id====' + results.rows.item(i).id)
                    }
                    console.log('===============temp.length============= ' + temp.length)

                    setOfflineData(temp);
                    setOfflineDataCount(temp.length);

                    NetInfo.fetch().then(state => {
                        console.log('no internet === ' + state.isConnected)
                        console.log('CLOCK REQUEST COUNT === ' + temp.length)
                        AsyncStorage.getItem('lastAction', (err, item) => {
                            console.log('Sohel :' + item)
                            setLastActionCode(parseInt(item))
                        })
                        if (state.isConnected) {
                            if (temp.length > 0) {
                                Alert.alert(
                                    "Alert!",
                                    '(Offline) You have attendance clocking records pending for submission in local device. Please click Ok as below to proceed for submission to server.',
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => {
                                                AsyncStorage.getItem('token', (err, item) => {
                                                    saveAll(temp, item).then(() => {
                                                        console.log('All data processed')
                                                    }).catch(err => {
                                                        console.log('Save All Error')
                                                    })
                                                })
                                            }
                                        }
                                    ]
                                )
                            } else {
                                AsyncStorage.getItem('token', (err, deviceToken) => {
                                    AsyncStorage.getItem('FCM_token', (err, fcmToken) => {
                                        setLoading(true)
                                        getWorkType(deviceToken, fcmToken);
                                    })
                                })
                            }
                        } else {
                            Alert.alert(
                                "Alert!",
                                "(Offline) No internet connection. Clock In/Clock Out feature allow user to execute as normal.",
                            )
                        }
                    });
                }
            );
        });
    }, [])

    // This function is to check if data available in local DB
    async function saveAll(temp, item) {
        setLoading(true);
        for (let index = 0; index < temp.length; index++) {
            console.log('============token======================token=========== ' + item)
            setToken(item);
            await saveClockIn(temp[index], item, temp.length, index);
        }
    }

    // This function is to save local DB clock in/out data to server 
    saveClockIn = async (temp, token, length, index) => {
        var imageData = {
            uri: temp.image,
            type: 'image/jpeg', //the mime type of the file
            name: temp.startDate + temp.startTime + 'image.jpg'
        }

        const data = new FormData()
        data.append("userID", temp.userID)
        data.append("longitude", temp.longitude)
        data.append("latitude", temp.latitude)
        data.append("startDate", temp.startDate)
        data.append("startTime", temp.startTime)
        data.append("startDateTime", temp.startDateTime)
        data.append("requestType", temp.requestType)
        data.append("workType", temp.workType)
        data.append("shopName", temp.shopName)
        data.append("location", temp.location)
        data.append("remark", temp.remark)
        data.append('image', imageData)

        console.log('===============data============= ' + JSON.stringify(data))
        console.log('===============data============= ' + token)

        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            body: data
        };
        console.log('======REQUEST BODY======= ' + JSON.stringify(requestOptions.body));
        await fetch(BASE_URL + 'Attendance/SaveAttendanceRequest/',
            requestOptions)
            .then(response => {
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
                    deleteSingleClockRequest(db, temp.id)
                    var lastIndex = index + 1;
                    console.log('----length-----' + length);
                    console.log('----length----- :: ' + index);
                    console.log('----length----- :: ' + lastIndex);
                    if (length == lastIndex) {
                        Alert.alert(
                            "Alert!",
                            "Offline attendance clocking records added to server successfully. You may check your request in History section now.",
                        )
                        AsyncStorage.getItem('token', (err, deviceToken) => {
                            AsyncStorage.getItem('FCM_token', (err, fcmToken) => {
                                // setLoading(true)
                                getWorkType(deviceToken, fcmToken);
                            })
                        })
                    }
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
                // setLoading(false);
            });
    }

    // This function is to get Dashboard data and for managin some conditions
    getWorkType = async (devicdToken, fcmToken) => {
        var number = parseInt(userId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + devicdToken, 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID: number, deviceToken: fcmToken })
        };
        console.log('=======requestOptions======::getWorkType:: ' + requestOptions.body)
        console.log('=======token====== ' + token)
        await fetch(BASE_URL + 'User/GetDashboardData',
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
                console.log('===json.data=== ' + JSON.stringify(data))
                console.log('==== resp  onseCode==== ' + data.responseCode);
                let json = data;
                if (json.responseCode == 200) {
                    if (json.data.isLoggedIn == 1) {
                        Alert.alert(
                            "Alert!",
                            'You disallow to use the same login credentials for >1 device at same time. Kindly re-login if you want to continue using on this device.',
                            [
                                {
                                    text: "Ok",
                                    onPress: () => {
                                        AsyncStorage.getItem('token', (err, item) => {
                                            setLoading(true);
                                            callLogoutAPI(item);
                                        })
                                    }
                                }
                            ]
                        )
                    } else {
                        console.log(json.data)
                        console.log('json.data.lastActionCode ::: ' + json.data.lastActionCode)
                        setLastActionCode(json.data.lastActionCode)
                        AsyncStorage.setItem('lastAction', json.data.lastActionCode + '');
                        console.log('--notificationCount--json.data.notificationCount:: ' + json.data.notificationCount)

                        var notificationCount = json.data.notificationCount;

                        console.log('==json.data.isUserOnLeave==: ' + json.data.isUserOnLeave);
                        console.log('==json.data.isUserOnLeave==:1 ' + json.data.isHoliday);

                        setUserOnLeave(json.data.isUserOnLeave);
                        setHoliday(json.data.isHoliday)

                        notificationStore.dispatch({
                            type: "COUNT_CHANGE",
                            payload: { count: notificationCount + '' }
                        });

                        var length = json.data.workTypeList.length;
                        if (length > 0) {
                            deleteTableAllAttendanceType(db);
                        }
                        for (let i = 0; i < length; i++) {
                            insertAttendanceType(db, json.data.workTypeList[i].workTypeId, json.data.workTypeList[i].workTypeValue);
                        }

                        if (json.data.requestPendingFrom == 45 || json.data.requestPendingFrom == 30 || json.data.requestPendingFrom == 15 || json.data.requestPendingFrom == 1) {
                            Alert.alert(
                                "Alert!",
                                'Kindly be reminded to perform Approve/Reject request before data cleaning cut-off activity start. \nThanks.',
                                [
                                    {
                                        text: "Cancel",
                                        onPress: () => console.log("Now Now"),
                                        style: "cancel"
                                    },
                                    {
                                        text: "Ok",
                                        onPress: () => {
                                            navigation.navigate("SuperVisorHomeDrawer", {
                                                ndex: 0,
                                                screen: "Attendance Approval"
                                            });
                                        }
                                    }
                                ]
                            )
                        } else {
                            console.log('SOHEL :: requestPendingFrom ::: ::: ' + json.data.requestPendingFrom);
                        }

                        if (json.data.daysLeftForPassword === '15' || json.data.daysLeftForPassword === '7' || json.data.daysLeftForPassword === '1') {
                            Alert.alert(
                                "Alert!",
                                'Your password will expire soon. Please change your password.',
                                [
                                    {
                                        text: "Cancel",
                                        onPress: () => console.log("Now Now"),
                                        style: "cancel"
                                    },
                                    {
                                        text: "Change Password",
                                        onPress: () => {
                                            navigation.navigate("SuperVisorHomeDrawer", {
                                                ndex: 0,
                                                screen: "Change Password"
                                            });
                                        }
                                    }
                                ]
                            )
                        } else if (json.data.daysLeftForPassword === '0') {
                            Alert.alert(
                                "Alert!",
                                'Your password expired. Please change your password.',
                                [
                                    {
                                        text: "Change Password",
                                        onPress: () => {
                                            navigation.navigate("SuperVisorHomeDrawer", {
                                                ndex: 0,
                                                screen: "Change Password"
                                            });
                                        }
                                    }
                                ]
                            )
                        }
                    }
                } else if (json.responseCode == 450) {
                    Alert.alert(
                        "Alert!",
                        json.responseMessage,
                        [
                            {
                                text: "Ok",
                                onPress: () => {
                                    AsyncStorage.getItem('token', (err, item) => {
                                        setLoading(true);
                                        callLogoutAPI(item);
                                    })
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
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // This function is to get Logout from App 
    callLogoutAPI = async (token) => {
        var number = parseInt(userId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID: number })
        };
        console.log('=======requestOptions====== ' + requestOptions.body)
        console.log('=======token====== ' + token)
        await fetch(BASE_URL + 'User/UserLogout',
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
                console.log('==== resp  onseCode==== ' + JSON.stringify(data));
                let json = data;
                if (json.responseCode == 200) {
                    console.log('--json.data.attendaceHistories--' + json.data.attendaceHistories)
                    AsyncStorage.setItem('lastAction', '');
                    AsyncStorage.setItem('token', '');
                    notificationStore.dispatch({
                        type: "COUNT_CHANGE",
                        payload: { count: '0' }
                    });
                    dispatch(clearLogin());
                    deleteTableAllRows(db);
                    deleteTableAllClockRequest(db);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                } else {
                    Alert.alert(
                        "Alert!",
                        data.data.status,
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

    // This function is to set the UI 
    return (
        <View style={loginPageStyles.container_1}>
            <StatusBar barStyle="default"
                backgroundColor="#FA0F0A" />
            <ScrollView>
                <View style={{ flexDirection: 'column' }}>
                    <Image
                        style={loginPageStyles.top_image}
                        source={require('../assets/images/top_image.png')}
                    />
                    <View style={employeesForgotPasswordPageStyles.top_image_layer} />
                    <View style={loginPageStyles.content_container}>
                        <Image
                            style={loginPageStyles.logo_image}
                            source={require('../assets/images/logo.png')}
                        />
                        <View style={employeesHomePageStyles.btn_container_home}>
                            <Text style={{ fontFamily: 'OpenSans-Semibold', width: width_1 * .8, fontSize: 24, color: '#000', marginTop: 10 }}>
                                Welcome!
                            </Text>
                            <Text style={{ fontFamily: 'OpenSans-Regular', width: width_1 * .8, fontSize: 12, color: '#000', marginTop: 20 }}>
                                Name: {name}
                            </Text>
                            <Text style={{ fontFamily: 'OpenSans-Regular', width: width_1 * .8, fontSize: 12, color: '#000', marginTop: 6 }}>
                                ID: {userId}
                            </Text>
                            <Text
                                numberOfLines={1}
                                style={{ fontFamily: 'OpenSans-Regular', width: width_1 * .8, fontSize: 12, color: '#000', marginTop: 6 }}>
                                Post: {designation}
                            </Text>
                            <Text
                                numberOfLines={1}
                                style={{ fontFamily: 'OpenSans-Regular', width: width_1 * .8, fontSize: 12, color: '#000', marginTop: 6 }}>
                                Branch: {location}
                            </Text>
                            <View style={{ marginTop: 10, alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        NetInfo.fetch().then(state => {
                                            if (offlineDataCount > 0 && state.isConnected) {
                                                Alert.alert(
                                                    "Alert!",
                                                    '(Offline) You have attendance clocking records pending for submission in local device. Please click Ok as below to proceed for submission to server.',
                                                    [
                                                        {
                                                            text: "OK",
                                                            onPress: () => {
                                                                AsyncStorage.getItem('token', (err, item) => {
                                                                    saveAll(offlineData, item).then(() => {
                                                                        setOfflineData('');
                                                                        setOfflineDataCount(0);
                                                                        console.log('All data processed')
                                                                    }).catch(err => {
                                                                        console.log('Save All Error')
                                                                    })
                                                                })
                                                            }
                                                        }
                                                    ]
                                                )
                                            } else {
                                                // navigation.navigate('EmployeesClockIn')
                                                // if (isHoliday == 1) {
                                                //     Alert.alert(
                                                //         "Alert!",
                                                //         "Please be inform that today is Public Holiday/Weekend. You may perform Clock In/Out request if require to work on these day.",
                                                //         [
                                                //             {
                                                //                 text: "Cancel",
                                                //                 style: "cancel"
                                                //             },
                                                //             {
                                                //                 text: "Clock In",
                                                //                 onPress: () => {
                                                //                     if (isUserOnLeave == 1) {
                                                //                         Alert.alert(
                                                //                             "Alert!",
                                                //                             "Please note that you applied leave for these day. You are not require to perform Clock In/Out request. Kindly be inform.",
                                                //                         )
                                                //                     } else if (lastActionCode == 2 || lastActionCode == 0) {
                                                //                         navigation.navigate('EmployeesClockIn')
                                                //                     } else {
                                                //                         Alert.alert(
                                                //                             "Alert!",
                                                //                             "Your last request was for Clock-In. You disallow to submit the same.",
                                                //                         )
                                                //                     }

                                                //                 }
                                                //             }
                                                //         ]
                                                //     )
                                                // } else 
                                                if (isUserOnLeave == 1) {
                                                    Alert.alert(
                                                        "Alert!",
                                                        "Please note that you applied leave for these day. You are not require to perform Clock In/Out request. Kindly be inform.",
                                                    )
                                                } else {
                                                    navigation.navigate('EmployeesClockIn', {
                                                        branch: location,
                                                    })
                                                    // navigation.navigate('EmployeesClockIn')
                                                }
                                                // else if (lastActionCode == 2 || lastActionCode == 0) {
                                                //     navigation.navigate('EmployeesClockIn')
                                                // } else {
                                                //     Alert.alert(
                                                //         "Alert!",
                                                //         "Your last request was for Clock-In. You disallow to submit the same.",
                                                //     )
                                                // }
                                            }
                                        })
                                    }}
                                    style={employeesHomePageStyles.clock_btn}>
                                    <Text style={employeesHomePageStyles.btn_text}>
                                        Clock In
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        NetInfo.fetch().then(state => {
                                            if (offlineDataCount > 0 && state.isConnected) {
                                                Alert.alert(
                                                    "Alert!",
                                                    '(Offline) You have attendance clocking records pending for submission in local device. Please click Ok as below to proceed for submission to server.',
                                                    [
                                                        {
                                                            text: "OK",
                                                            onPress: () => {
                                                                AsyncStorage.getItem('token', (err, item) => {
                                                                    saveAll(offlineData, item).then(() => {
                                                                        setOfflineData('');
                                                                        setOfflineDataCount(0);
                                                                        console.log('All data processed')
                                                                    }).catch(err => {
                                                                        console.log('Save All Error')
                                                                    })
                                                                })
                                                            }
                                                        }
                                                    ]
                                                )
                                            } else {
                                                // if (isHoliday == 1) {
                                                //     Alert.alert(
                                                //         "Alert!",
                                                //         "Please be inform that today is Public Holiday/Weekend. You may perform Clock In/Out request if require to work on these day.",
                                                //         [
                                                //             {
                                                //                 text: "Cancel",
                                                //                 style: "cancel"
                                                //             },
                                                //             {
                                                //                 text: "Clock Out",
                                                //                 onPress: () => {
                                                //                     if (isUserOnLeave == 1) {
                                                //                         Alert.alert(
                                                //                             "Alert!",
                                                //                             "Please note that you applied leave for these day. You are not require to perform Clock In/Out request. Kindly be inform.",
                                                //                         )
                                                //                     } else if (lastActionCode == 1) {
                                                //                         navigation.navigate('EmployeesClockOut')
                                                //                     } else {
                                                //                         Alert.alert(
                                                //                             "Alert!",
                                                //                             "Your last request was for Clock-Out. You disallow to submit the same.",
                                                //                         )
                                                //                     }

                                                //                 }
                                                //             }
                                                //         ]
                                                //     )
                                                // } else 
                                                if (isUserOnLeave == 1) {
                                                    Alert.alert(
                                                        "Alert!",
                                                        "Please note that you applied leave for these day. You are not require to perform Clock In/Out request. Kindly be inform.",
                                                    )
                                                } else {
                                                    navigation.navigate('EmployeesClockOut', {
                                                        branch: location,
                                                    })
                                                    // navigation.navigate('EmployeesClockOut')
                                                }
                                                // else if (lastActionCode == 1) {
                                                //     navigation.navigate('EmployeesClockOut')
                                                // } else {
                                                //     Alert.alert(
                                                //         "Alert!",
                                                //         "Your last request was for Clock-Out. You disallow to submit the same.",
                                                //     )
                                                // }
                                            }
                                        })
                                    }}
                                    style={employeesHomePageStyles.clock_btn}>
                                    <Text style={employeesHomePageStyles.btn_text}>
                                        Clock Out
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontFamily: 'OpenSans-Regular', width: width_1 * .8, fontSize: 12, marginTop: 30, alignItems: 'center', color: 'gray' }}>
                                The mobile apps able to store clock in & clock out data locally when there is no internet connectivity. You require to submit the data to server when internet connectivity back to normal.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView >
            <Modal isVisible={loading} style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <ActivityIndicator color={'#fff'} />
            </Modal>
        </View >
    );
};

export default SuperVisorHome;