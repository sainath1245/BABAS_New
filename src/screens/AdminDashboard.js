import React, { useEffect, useState } from 'react';
import {
    Image, StatusBar, Text,
    View,
    ActivityIndicator,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { adminDashboardStyles, employeesForgotPasswordPageStyles, employeesHomePageStyles, employeesSuccessMessagePageStyles, loginPageStyles } from '../utils/styles';
import { format } from "date-fns";
import { BASE_URL } from '../utils/consts';
import NetInfo from "@react-native-community/netinfo";
import { openDatabase } from 'react-native-sqlite-storage';
import { deleteTableAllAttendanceType, insertAttendanceType, deleteTableAllRows, deleteTableAllClockRequest } from '../../database/local_database';
import { Dimensions, StyleSheet } from 'react-native';
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import { useDispatch } from 'react-redux';
import { clearLogin } from '../../actions/login_action';
import notificationStore from '../../notification_redux/notificationStore';


var width_1 = Dimensions.get('window').width;
var db = openDatabase({ name: 'BABAS_DB.db' });

const AdminDashboard = ({ navigation }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [noOfSupervisor, setNoOfSupervisor] = useState('0');
    const [noOfEmployee, setNoOfEmployee] = useState('0');
    const [token, setToken] = useState('');
    const [isConnected, setConnected] = useState();
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [designation, setDesignation] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [fcmToken, setFcmToken] = useState();
    const dispatch = useDispatch();

    useEffect(() => {

        // This piece of code sets the Date & Time for UI
        setLoading(true)
        var today = new Date();
        var formattedDate = format(today, "dd/MM/yyyy");
        setDate(formattedDate);
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        setTime(strTime);

        // This functio to get userId and userName from local DB
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
        // This function is to get token to call the APIs
        AsyncStorage.getItem('token', (err, item) => {
            setToken(item);
        })
        setTimeout(() => {
            checkInternet();
        }, 1000);
    }, []);

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternet = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                AsyncStorage.getItem('FCM_token', (err, fcmToken) => {
                    getDashboardData(fcmToken);
                    getWorkType(fcmToken);
                })
            } else {
                setLoading(false)
                Alert.alert(
                    "Alert!",
                    "(Offline) No internet connection. Clock In/Clock Out feature allow user to execute as normal.",
                )
            }
            setConnected(state.isConnected);
        });
        return (isConnected);
    }

    const checkToken = async () => {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log('fcmToken ::: ::: ' + fcmToken);
            setFcmToken(fcmToken);
        }
    }

    // This function is to get Dashboard data from server
    getDashboardData = async (fcmToken) => {
        var number = parseInt(userId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID: number, deviceToken: fcmToken })
        };
        await fetch(BASE_URL + 'Admin/GetAdminDashboard',
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
                    console.log('resposne ========= ===== ==== ' + JSON.stringify(json.data))
                    setNoOfEmployee(json.data.employeeCount);
                    setNoOfSupervisor(json.data.supervisorCount);
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

    // This function is to get Attendance type & other conditions related data
    getWorkType = async (fcmToken) => {
        var number = parseInt(userId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID: number, deviceToken: fcmToken })
        };
        console.log('=======requestOptions====== ' + requestOptions.body)
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
                console.log('==== resp  onseCode==== ' + data.responseCode);
                console.log('==== resp  onseCode==== ' + JSON.stringify(data));
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
                                            callLogoutAPI(item);
                                        })
                                    }
                                }
                            ]
                        )
                    } else {
                        console.log(json.data)
                        console.log('json.data.lastActionCode ::: ' + json.data.lastActionCode)
                        var length = json.data.workTypeList.length;
                        if (length > 0) {
                            deleteTableAllAttendanceType(db);
                        }
                        for (let i = 0; i < length; i++) {
                            insertAttendanceType(db, json.data.workTypeList[i].workTypeId, json.data.workTypeList[i].workTypeValue);
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
                                            navigation.navigate("AdminHomeDrawer", {
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
                                            navigation.navigate("AdminHomeDrawer", {
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

    // This function is to call logout API to clear the login session
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
                // setLoading(false);
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
                            <Text style={{ fontFamily: 'OpenSans-Semibold', width: width_1 * .8, fontSize: 24, color: '#000', marginTop: 15 }}>
                                Welcome!
                            </Text>
                            <Text style={{ fontFamily: 'OpenSans-Regular', width: width_1 * .8, fontSize: 12, color: '#000', marginTop: 26 }}>
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
                                style={{ fontFamily: 'OpenSans-Regular', width: width_1 * .8, fontSize: 12, color: '#000', marginTop: 6, marginBottom: 20 }}>
                                Branch: {location}
                            </Text>
                            <View style={adminDashboardStyles.main_container}>
                                <View
                                    onPress={() => {
                                        navigation.navigate('EmployeesHistory');
                                    }}
                                    style={adminDashboardStyles.circle_1}>
                                    <Image
                                        style={employeesSuccessMessagePageStyles.bottom_btns}
                                        source={require('../assets/images/calendar.png')}
                                    />
                                </View>
                                <Text style={adminDashboardStyles.text_date}>
                                    {date}{"\n"}({time})
                                </Text>
                            </View>
                            <View style={adminDashboardStyles.second_container}>
                                <View
                                    onPress={() => {
                                        navigation.navigate('EmployeesHistory');
                                    }}
                                    style={adminDashboardStyles.circle_1}>
                                    <Image
                                        style={employeesSuccessMessagePageStyles.bottom_btns}
                                        source={require('../assets/images/people.png')}
                                    />
                                </View>
                                <Text style={adminDashboardStyles.text_numbers}>
                                    {noOfSupervisor}
                                </Text>
                                <Text style={adminDashboardStyles.text_numberof}>
                                    Number of{"\n"}Supervisor
                                </Text>
                            </View>
                            <View style={adminDashboardStyles.second_container}>
                                <View
                                    onPress={() => {
                                        navigation.navigate('EmployeesHistory');
                                    }}
                                    style={adminDashboardStyles.circle_1}>
                                    <Image
                                        style={employeesSuccessMessagePageStyles.bottom_btns}
                                        source={require('../assets/images/people.png')}
                                    />
                                </View>
                                <Text style={adminDashboardStyles.text_numbers}>
                                    {noOfEmployee}
                                </Text>
                                <Text style={adminDashboardStyles.text_numberof}>
                                    Number of{"\n"}Users
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Modal isVisible={loading} style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <ActivityIndicator color={'#fff'} />
            </Modal>
        </View>
    );
};

export default AdminDashboard;