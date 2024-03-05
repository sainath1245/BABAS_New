import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image, StatusBar, Text, TextInput, TouchableNativeFeedback, TouchableOpacity, View
} from 'react-native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { employeesForgotPasswordPageStyles, employeesResetPageStyles, loginPageStyles } from '../utils/styles';
import { BASE_URL } from '../utils/consts';
import NetInfo from "@react-native-community/netinfo";

const EmployeesResetPassword = ({ route, navigation }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { email } = route.params;
    const [loading, setLoading] = useState(false);
    const [isConnected, setConnected] = useState();

    console.log('======email=====:: ' + email)

     // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
   const checkInternet = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                setLoading(true)
                callResetPasswordAPI();
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

    // This function is to reset password 
    callResetPasswordAPI = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: confirmPassword })
        };
        console.log('=========requestOptions.body ===========' + requestOptions.body)
        await fetch(BASE_URL + 'User/ResetPassword',
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
                    Alert.alert(
                        "Alert!",
                        "Password reset completed.",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
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
                                    Reset password
                                </Text>
                                <View style={loginPageStyles.edit_bg}>
                                    <Image
                                        style={loginPageStyles.svg_icons}
                                        source={require('../assets/images/ic_password.png')}
                                    />
                                    <TextInput
                                        style={loginPageStyles.input}
                                        keyboardType="default"
                                        placeholder="Password"
                                        placeholderTextColor="#e0e0e0"
                                        secureTextEntry={false}
                                        onChangeText={(value) => setPassword(value)}
                                    />
                                </View>
                                <View style={loginPageStyles.edit_bg}>
                                    <Image
                                        style={loginPageStyles.svg_icons}
                                        source={require('../assets/images/ic_password.png')}
                                    />
                                    <TextInput
                                        style={loginPageStyles.input}
                                        keyboardType="default"
                                        placeholder="Confirm Password"
                                        placeholderTextColor="#e0e0e0"
                                        secureTextEntry={false}
                                        onChangeText={(value) => setConfirmPassword(value)}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log(password);
                                        console.log(confirmPassword);
                                        let reg_password = /^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
                                        if (password.length !== 0 && confirmPassword.length !== 0) {
                                            if (password.length > 20 || confirmPassword.length > 20 || reg_password.test(password) === false || reg_password.test(confirmPassword) === false) {
                                                Alert.alert(
                                                    "Alert!",
                                                    "Password must be min: 8, max: 20 Characters, 1 Caps (A-Z) & 1 Numeric (0-9) to strengthen your password.",
                                                )
                                            } else {
                                                if (password !== confirmPassword) {
                                                    Alert.alert(
                                                        "Alert!",
                                                        "Confirm password must be same as password.",
                                                    )
                                                } else {
                                                    checkInternet()
                                                }
                                            }
                                        } else {
                                            Alert.alert(
                                                "Alert!",
                                                "Passowrd & Confirm Password should not be empty.",
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
                                        Save
                                    </Text>}
                                </TouchableOpacity>
                                <Text style={employeesResetPageStyles.text}>
                                    Password must be min: 8, max: 20 Characters, 1 Caps (A-Z) & 1 Numeric (0-9) to strengthen your password.
                                </Text>
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

export default EmployeesResetPassword;