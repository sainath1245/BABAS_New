import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image, StatusBar, Text, TextInput, TouchableNativeFeedback, TouchableOpacity, View, Alert
} from 'react-native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { employeesForgotPasswordPageStyles, loginPageStyles } from '../utils/styles';
import { BASE_URL } from '../utils/consts';
import NetInfo from "@react-native-community/netinfo";

const EmployeesForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isConnected, setConnected] = useState();

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

    // This function is to call API for forgot password 
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
                    navigation.navigate('EmployeesVerifyOTP', {
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
            .finally((error) => {
                console.log('==ERROR== 1 : ' + error)
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
                                    Forgot your password?
                                </Text>
                                <View style={employeesForgotPasswordPageStyles.edit_bg}>
                                    <Image
                                        style={loginPageStyles.svg_icons}
                                        source={require('../assets/images/ic_user.png')}
                                    />
                                    <TextInput
                                        style={loginPageStyles.input}
                                        keyboardType="email-address"
                                        placeholder="Email"
                                        placeholderTextColor="#e0e0e0"
                                        onChangeText={(value) => setEmail(value)}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log(email);
                                        let reg_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
                                        if (email.length !== 0) {
                                            if (reg_email.test(email) === false) {
                                                Alert.alert(
                                                    "Alert!",
                                                    "Please enter valid email address.",
                                                )
                                            } else {
                                                checkInternet();
                                            }
                                        } else {
                                            Alert.alert(
                                                "Alert!",
                                                "Email should not be empty.",
                                            )
                                        }
                                    }}
                                    style={employeesForgotPasswordPageStyles.btn}>
                                    {loading ? <View style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                        {
                                            loading &&
                                            <ActivityIndicator color={'#fff'} />
                                        }
                                    </View> : <Text style={loginPageStyles.btn_text}>
                                        Reset your password
                                    </Text>}
                                </TouchableOpacity>
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
            </View>
        </SafeAreaView>
    );
};

export default EmployeesForgotPassword;