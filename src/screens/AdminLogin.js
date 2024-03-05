import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import messaging from '@react-native-firebase/messaging';
import React, {
    useEffect,
    useState
} from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Platform,
    StatusBar,
    Text,
    TextInput,
    TouchableNativeFeedback,
    View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openDatabase } from 'react-native-sqlite-storage';
import { deleteTableAllRows, insertUser_1 } from '../../database/local_database';
import { BASE_URL } from '../utils/consts';
import { employeesForgotPasswordPageStyles, loginPageStyles } from '../utils/styles';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var db = openDatabase({ name: 'BABAS_DB.db' });

const AdminLogin = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isConnected, setConnected] = useState();
    const [fcmToken, setFcmToken] = useState('');
    const [hidePass, setHidePass] = useState(true);

    useEffect(() => {
        checkToken();
        // This function is to get token to call the APIs
        AsyncStorage.getItem('email', (err, item) => {
            console.log('--notificationCount-- nav: ' + item)
            setEmail(item)
        })
    }, [])

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternet = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                setLoading(true)
                callLoginAPI();
            } else {
                Alert.alert(
                    "Alert!",
                    "(Offline) No internet connection. Please try again later.",
                )
            }
            setConnected(state.isConnected);
        });
        return (isConnected);
    }

    // This function is to get User permission for notification, if the user will allow then only we are able to get FCM token
    async function checkToken() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        console.log('Authorization status:', authStatus);

        if (enabled) {
            const fcmToken = await messaging().getToken();
            setFcmToken(fcmToken);
            AsyncStorage.setItem('FCM_token', fcmToken);
            console.log('await messaging().getToken():', fcmToken);
        } else {
            setFcmToken('');
            AsyncStorage.setItem('FCM_token', '');
            // Alert.alert(
            //     "Alert!",
            //     'Notification must be enable.',
            //     [
            //         {
            //             text: 'Ok',
            //             onPress: () => {
            //                 Linking.openURL('app-settings://notification/Babas App')
            //             }
            //         }
            //     ]
            // )
        }
    }

    // Thia function is to call Login API
    callLoginAPI = async () => {
        var deviceType = '';
        if (Platform.OS === 'ios') {
            deviceType = '2'
        } else {
            deviceType = '1'
        }
        var number = parseInt(email);
        console.log('=============deviceType=========== ' + deviceType)
        console.log('=============fcmToken=========== ' + fcmToken)
        var requestOptions = '';
        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: number, password: password, deviceType: deviceType, deviceToken: fcmToken, isAdminLogin: 1 })
        };
        console.log('=========requestOptions.body ===========' + requestOptions.body)
        await fetch(BASE_URL + 'Login/UserLogin/',
            requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then((data) => {
                console.log('==== EMAIL==== ' + data);
                let json = data;

                if (json.responseCode == 200) {
                    deleteTableAllRows(db);

                    var jwtDecode = require('jwt-decode');

                    var token = json.data;
                    var decodedPayLoad = jwtDecode(token, { payload: true });
                    console.log('==decodedPayLoad==' + JSON.stringify(decodedPayLoad));

                    AsyncStorage.setItem('token', json.data);
                    AsyncStorage.setItem('email', email);

                    insertUser_1(db, decodedPayLoad.UserId, json.data, decodedPayLoad.FullName, '', decodedPayLoad.Email, decodedPayLoad.UserRole, decodedPayLoad.Designation, decodedPayLoad.Location);

                    if (decodedPayLoad.UserRole == 1) {
                        // Admin Home Scree
                        navigation.reset({
                            index: 0,
                            routes: [{
                                name: 'AdminHomeDrawer',
                                screen: "AdminDashboard"
                            }],
                        });
                    } else if (decodedPayLoad.UserRole == 2) {
                        // Supervisor Home Screen
                        navigation.reset({
                            index: 0,
                            routes: [{
                                name: 'SuperVisorHomeDrawer',
                                screen: "SuperVisorHome"
                            }],
                        });
                    } else if (decodedPayLoad.UserRole == 3) {
                        // Employee Home Screen
                        navigation.reset({
                            index: 0,
                            routes: [{
                                name: 'EmployeesHomeDrawer',
                                screen: "EmployeesHome"
                            }],
                        });
                    } else {
                        Alert.alert(
                            "Alert!",
                            "Email doesn't exist.",
                        )
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
                setLoading(false);
            });
    }

    // This function is to set the UI
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={loginPageStyles.container}>
                <StatusBar barStyle="default"
                    backgroundColor="#FA0F0A" />
                <KeyboardAwareScrollView >
                    <View style={{ flexDirection: 'column' }}>
                        <Image
                            style={loginPageStyles.top_image}
                            source={require('../assets/images/top_image.png')}
                        />
                        <View style={loginPageStyles.content_container}>
                            <Image
                                style={loginPageStyles.logo_image}
                                source={require('../assets/images/logo.png')}
                            />
                            <Text style={{
                                fontSize: 16,
                                color: '#fb0f0c',
                                fontWeight: '400',
                                marginTop: 20,
                                fontFamily: 'OpenSans-Semibold',
                            }}>
                                Welcome to Baba's Admin section
                            </Text>
                            <View style={loginPageStyles.edit_bg}>
                                <Image
                                    style={loginPageStyles.svg_icons}
                                    source={require('../assets/images/ic_user.png')}
                                />
                                <TextInput
                                    value={email}
                                    style={loginPageStyles.input}
                                    keyboardType="email-address"
                                    placeholder="User ID"
                                    placeholderTextColor="#e0e0e0"
                                    onChangeText={(value) => setEmail(value)}
                                />
                            </View>
                            <View style={loginPageStyles.edit_bg}>
                                <Image
                                    style={loginPageStyles.svg_icons}
                                    source={require('../assets/images/ic_password.png')}
                                />
                                <TextInput
                                    style={loginPageStyles.input_password}
                                    keyboardType="default"
                                    placeholder="Password"
                                    placeholderTextColor="#e0e0e0"
                                    onChangeText={(value) => setPassword(value)}
                                    secureTextEntry={hidePass}
                                />
                                <TouchableOpacity
                                    style={{}}
                                    onPress={() => {
                                        console.log('==hidePass==: ' + hidePass)
                                        if (hidePass) {
                                            setHidePass(false)
                                        } else {
                                            setHidePass(true)
                                        }
                                    }}>
                                    {
                                        hidePass ?
                                            <Image
                                                style={loginPageStyles.svg_icons_1}
                                                source={require('../assets/images/view.png')}
                                            />
                                            :
                                            <Image
                                                style={loginPageStyles.svg_icons_1}
                                                source={require('../assets/images/hide.png')}
                                            />}
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    let reg_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
                                    let reg_password = /^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
                                    if (email !== '' && password !== '') {
                                        if (password.length > 20 || reg_password.test(password) === false) {
                                            Alert.alert(
                                                "Alert!",
                                                "Password must be min: 8, max: 20 Characters, 1 Caps (A-Z) & 1 Numeric (0-9) to strengthen your password.",
                                            )
                                        } else {
                                            setLoading(true)
                                            if (fcmToken === '') {
                                                checkToken();
                                                setTimeout(() => {
                                                    checkInternet();
                                                }, 1000);
                                            } else {
                                                checkInternet();
                                            }
                                        }
                                        // }
                                    } else {
                                        Alert.alert(
                                            "Alert!",
                                            "Email & Password should not be empty.",
                                        )
                                    }
                                }}
                                style={loginPageStyles.btn}>
                                {loading ? <View style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                    {
                                        loading &&
                                        <ActivityIndicator color={'#fff'} />
                                    }
                                </View> : <Text style={loginPageStyles.btn_text}>
                                    Admin Login
                                </Text>}
                            </TouchableOpacity>
                            <Text style={{
                                fontSize: 16,
                                color: 'gray',
                                fontWeight: '400',
                                marginTop: 30,
                                width: width * .7,
                                textAlign: 'center',
                                fontFamily: 'OpenSans-Regular',
                            }}>
                                Access restricted to authorized Admin only.
                            </Text>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <TouchableNativeFeedback
                    onPress={() => { navigation.goBack(null) }}
                    style={employeesForgotPasswordPageStyles.back_btn_layout}>
                    <Image
                        style={employeesForgotPasswordPageStyles.back_btn}
                        source={require('../assets/images/ic_back.png')}
                    />
                </TouchableNativeFeedback >
            </View>
        </SafeAreaView>
    );
};
export default AdminLogin;