import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image, StatusBar, Text, TouchableOpacity, View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { employeesForgotPasswordPageStyles, employeesResetPageStyles, loginPageStyles, EmployeesUploadDocumentsPageStyles, clockInPageStyles } from '../utils/styles';
import { openDatabase } from 'react-native-sqlite-storage';
import { BASE_URL } from '../utils/consts';
import NetInfo from "@react-native-community/netinfo";

var db = openDatabase({ name: 'BABAS_DB.db' });

const EmployeesChangePassword = ({ navigation }) => {
    const [oldPaddword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userData, setUserData] = useState([]);
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [isConnected, setConnected] = useState();
    const [hidePass_1, setHidePass_1] = useState(true);
    const [hidePass_2, setHidePass_2] = useState(true);
    const [hidePass_3, setHidePass_3] = useState(true);

    useEffect(() => {
        // This piece of code sets the input field to empty
        setOldPassword('')
        setPassword('')
        setConfirmPassword('')

        // This functio to get userId and userdata from local DB
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

        // This function is to get token to call the APIs
        AsyncStorage.getItem('token', (err, item) => {
            setToken(item);
        })
    }, [])

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternet = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                setLoading(true)
                callChangePasswordAPI();
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

    // This function is to change password
    callChangePasswordAPI = async () => {
        var number = parseInt(userId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ empID: number, currentPass: oldPaddword, newPass: confirmPassword })
        };
        console.log('ChangePassword ::: ::: :: '+requestOptions.body)
        await fetch(BASE_URL + 'User/ChangePassword',
            requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong :: ' + response.json());
                }
            })
            .then((data) => {
                console.log('==== responseCode==== ' + data.responseCode);
                let json = data;
                console.log('==== responseCode==== ' + JSON.stringify(json));
                if (json.responseCode == 200) {
                    setOldPassword('')
                    setPassword('')
                    setConfirmPassword('')
                    Alert.alert(
                        "Alert!",
                        "Password change completed.",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    if (userData[0].userRole == 3) {
                                        navigation.navigate("EmployeesHomeDrawer", {
                                            screen: "Home"
                                        });
                                    } else if (userData[0].userRole == 2) {
                                        navigation.navigate("SuperVisorHomeDrawer", {
                                            screen: "Home"
                                        });
                                    } else if (userData[0].userRole == 1) {
                                        navigation.navigate("AdminHomeDrawer", {
                                            screen: "AdminDashboard"
                                        });
                                    }
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
        <View style={loginPageStyles.container_1}>
            <StatusBar barStyle="default"
                backgroundColor="#FA0F0A" />
            <View style={{ flexDirection: 'column', flex: 1 }}>
                <Image
                    style={EmployeesUploadDocumentsPageStyles.top_image}
                    source={require('../assets/images/top_image_1.png')}
                />
                <View style={clockInPageStyles.top_image_layer} />
                <KeyboardAwareScrollView>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={loginPageStyles.content_container_1}>
                            <View style={employeesForgotPasswordPageStyles.btn_container}>
                                <View style={loginPageStyles.edit_bg}>
                                    <Image
                                        style={loginPageStyles.svg_icons}
                                        source={require('../assets/images/ic_password.png')}
                                    />
                                    <TextInput
                                        value={oldPaddword}
                                        style={loginPageStyles.input_password}
                                        keyboardType="default"
                                        placeholder="Old Password"
                                        placeholderTextColor="#e0e0e0"
                                        secureTextEntry={hidePass_1}
                                        onChangeText={(value) => setOldPassword(value)}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            console.log('==hidePass==: ' + hidePass_1)
                                            if (hidePass_1) {
                                                setHidePass_1(false)
                                            } else {
                                                setHidePass_1(true)
                                            }
                                        }}>
                                        {
                                            hidePass_1 ?
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
                                <View style={loginPageStyles.edit_bg}>
                                    <Image
                                        style={loginPageStyles.svg_icons}
                                        source={require('../assets/images/ic_password.png')}
                                    />
                                    <TextInput
                                        value={password}
                                        style={loginPageStyles.input_password}
                                        keyboardType="default"
                                        placeholder="New Password"
                                        placeholderTextColor="#e0e0e0"
                                        secureTextEntry={hidePass_2}
                                        onChangeText={(value) => setPassword(value)}
                                    />
                                    <TouchableOpacity
                                        style={{}}
                                        onPress={() => {
                                            console.log('==hidePass==: ' + hidePass_2)
                                            if (hidePass_2) {
                                                setHidePass_2(false)
                                            } else {
                                                setHidePass_2(true)
                                            }
                                        }}>
                                        {
                                            hidePass_2 ?
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
                                <View style={loginPageStyles.edit_bg}>
                                    <Image
                                        style={loginPageStyles.svg_icons}
                                        source={require('../assets/images/ic_password.png')}
                                    />
                                    <TextInput
                                        value={confirmPassword}
                                        style={loginPageStyles.input_password}
                                        keyboardType="default"
                                        placeholder="Confirm Password"
                                        placeholderTextColor="#e0e0e0"
                                        secureTextEntry={hidePass_3}
                                        onChangeText={(value) => setConfirmPassword(value)}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            console.log('==hidePass==: ' + hidePass_3)
                                            if (hidePass_3) {
                                                setHidePass_3(false)
                                            } else {
                                                setHidePass_3(true)
                                            }
                                        }}>
                                        {
                                            hidePass_3 ?
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
                                        console.log(password);
                                        console.log(confirmPassword);
                                        let reg_password = /^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
                                        if (oldPaddword.length !== 0 && password.length !== 0 && confirmPassword.length !== 0) {
                                            if (oldPaddword.length > 20 || password.length > 20 || confirmPassword.length > 20 || reg_password.test(oldPaddword) === false || reg_password.test(password) === false || reg_password.test(confirmPassword) === false) {
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
                                                    checkInternet();
                                                }
                                            }
                                        } else {
                                            Alert.alert(
                                                "Alert!",
                                                "Fields should not be empty.",
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
                                    Password must be min 8 & max 20 Char, one Caps(A-Z) & one Numeric (0-9) as to make password stronger
                                </Text>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </View >
    );
};

export default EmployeesChangePassword;