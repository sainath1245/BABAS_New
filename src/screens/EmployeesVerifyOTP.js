import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, Image,
    StatusBar,
    Text,
    TextInput,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from 'react-native';
import Modal from "react-native-modal";
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../utils/consts';
import {
    employeesForgotPasswordPageStyles,
    employeesVerifyOTPPageStyles,
    loginPageStyles
} from '../utils/styles';

const EmployeesVerifyOTP = ({ route, navigation }) => {
    const [OTP, setOTP] = useState('');
    const [timerCount, setTimer] = useState(60);
    const [loading, setLoading] = useState(false);
    const [isConnected, setConnected] = useState();
    const { email } = route.params;
    console.log('======email=====' + email)

    useEffect(() => {
        timeInterval()
    }, []);

    // This function is to set time interval to resend OTP 
    const timeInterval = () => {
        let interval = setInterval(() => {
            setTimer(lastTimerCount => {
                lastTimerCount <= 1 && clearInterval(interval)
                return lastTimerCount - 1
            })
        }, 1000) //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval)
    }

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternet = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                setLoading(true)
                callForgotPasswordAPI();
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

    // This function is to forgot password 
    callForgotPasswordAPI = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        };
        console.log('=========requestOptions.body ===========' + requestOptions.body)
        await fetch(BASE_URL + 'User/ForgotPassword',
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
                    console.log('--JSON.stringify(json)--: ' + JSON.stringify(json))
                    setTimer(60);
                    timeInterval();
                    Alert.alert(
                        "Alert!",
                        "OTP sent to your register email address.",
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

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternetForVerifyOTP = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                setLoading(true)
                callVerifyPasswordAPI();
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

    // This function is to verify OTP 
    callVerifyPasswordAPI = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, otp: OTP })
        };
        console.log('=========requestOptions.body ===========' + requestOptions.body)
        await fetch(BASE_URL + 'User/VerifyOTP',
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
                console.log('--JSON.stringify(json)--: ' + JSON.stringify(json))
                if (json.responseCode == 200) {
                    navigation.navigate('EmployeesResetPassword', {
                        email: email
                    })
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
                        <View style={employeesForgotPasswordPageStyles.top_image_layer} />
                        <View style={loginPageStyles.content_container}>
                            <Image
                                style={loginPageStyles.logo_image}
                                source={require('../assets/images/logo.png')}
                            />
                            <View style={employeesForgotPasswordPageStyles.btn_container}>
                                <Text style={loginPageStyles.welcome_text}>
                                    Verify OTP
                                </Text>
                                <View style={employeesForgotPasswordPageStyles.edit_bg}>
                                    <TextInput
                                        style={employeesVerifyOTPPageStyles.input}
                                        keyboardType="numeric"
                                        placeholder="OTP"
                                        placeholderTextColor="#e0e0e0"
                                        textAlign="center"
                                        maxLength={6}
                                        onChangeText={(value) => setOTP(value)}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        let reg_OTP = /^(?=.*[0-9])(?=.{6,})/;
                                        if (OTP.length !== 0) {
                                            if (reg_OTP.test(OTP) === false) {
                                                Alert.alert(
                                                    "Alert!",
                                                    "OTP must be 6 digit.",
                                                )
                                            } else {
                                                checkInternetForVerifyOTP()
                                            }
                                        } else {
                                            Alert.alert(
                                                "Alert!",
                                                "OTP should not be empty.",
                                            )
                                        }
                                    }}
                                    style={employeesForgotPasswordPageStyles.btn}>
                                    <Text style={loginPageStyles.btn_text}>
                                        Submit
                                    </Text>
                                </TouchableOpacity>
                                {
                                    timerCount > 0 ? <Text style={loginPageStyles.resend_text}>
                                        New OTP in {timerCount}
                                    </Text> : <TouchableOpacity
                                        onPress={() => {
                                            checkInternet();
                                        }}>
                                        <Text style={loginPageStyles.resend_btn_text}>
                                            Send New OTP
                                        </Text>
                                    </TouchableOpacity>
                                }
                            </View>
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
                <Modal isVisible={loading} style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <ActivityIndicator color={'#fff'} />
                </Modal>
            </View>
        </SafeAreaView>
    );
};

export default EmployeesVerifyOTP;