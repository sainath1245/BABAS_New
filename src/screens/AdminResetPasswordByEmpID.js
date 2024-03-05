import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image, StatusBar, Text, TouchableOpacity, View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { employeesForgotPasswordPageStyles, loginPageStyles, EmployeesUploadDocumentsPageStyles, clockInPageStyles, alertStyles, superVisorEmployeeRequestStyles } from '../utils/styles';
import Modal from "react-native-modal";
import NetInfo from "@react-native-community/netinfo";
import { BASE_URL } from '../utils/consts';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'BABAS_DB.db' });

const AdminResetPasswordByEmpID = ({ navigation }) => {
    const [empId, setEmpID] = useState('');
    const [isPasswordPopup, setPasswordPopup] = useState(false);
    const [token, setToken] = useState('');
    const [dataArray, setDataArray] = useState('');
    const [loading, setLoading] = useState(false);
    const [isConnected, setConnected] = useState();

    const [email, setEmail] = useState('');
    const [empName, setEmpName] = useState('');
    const [tempPass, setTempPass] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        setEmpID('')

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

    // This function is to reset user's passowrd
    callChangePasswordAPI = async () => {
        var number = parseInt(empId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ empID: number })
        };
        console.log(JSON.stringify(requestOptions.body))
        await fetch(BASE_URL + 'User/AdminForgotPassword',
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
                setDataArray(json);
                if (json.responseCode == 200) {
                    setEmail(json.data.email)
                    setEmpName(json.data.empName)
                    setTempPass(json.data.tempPass)
                    setPasswordPopup(true);
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

    // This function is to confirm the temp password and API will send email notification to user
    callConfirmPasswordAPI = async () => {
        var number = parseInt(userId);
        var number_1 = parseInt(empId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminID: number, userID: number_1, email: email, password: tempPass })
        };
        await fetch(BASE_URL + 'User/AdminResetPassword',
            requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong :: ' + response.json());
                }
            })
            .then((data) => {
                console.log('==== responseCode==== ' + JSON.stringify(data));

                setEmpID('');
                Alert.alert(
                    "Alert!",
                    "Reset password completed & temporary password sent to user email address.",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                navigation.navigate("AdminHomeDrawer", {
                                    screen: "AdminDashboard"
                                });
                            }
                        }
                    ]
                )
            })
            .catch((error) => {
                console.log('==ERROR== : ' + error)
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // This function is to set UI
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
                                <View style={employeesForgotPasswordPageStyles.edit_bg}>
                                    <Image
                                        style={loginPageStyles.svg_icons}
                                        source={require('../assets/images/ic_user.png')}
                                    />
                                    <TextInput
                                        value={empId}
                                        style={loginPageStyles.input}
                                        keyboardType="numeric"
                                        placeholder="User ID"
                                        placeholderTextColor="#e0e0e0"
                                        onChangeText={(value) => setEmpID(value)}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (empId.length > 0) {
                                            checkInternet();
                                            // setPasswordPopup(true);
                                        } else {
                                            Alert.alert(
                                                "Alert!",
                                                "User ID should not be empty.",
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
                                        Reset password
                                    </Text>}
                                </TouchableOpacity>
                                {/* <Text style={employeesResetPageStyles.text}>
                                    User will receive OTP on their register Email.
                                </Text> */}
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
            <Modal isVisible={isPasswordPopup}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                useNativeDriver={true}>
                <View style={alertStyles.alertBg}>
                    <Text style={{ fontFamily: 'OpenSans-Regular', width: '90%', marginTop: 10, fontSize: 14, color: 'black', fontWeight: '600' }}>
                        {empId}
                    </Text>
                    <Text style={{ fontFamily: 'OpenSans-Regular', width: '90%', marginTop: 4, fontSize: 14, color: 'black' }}>
                        {empName}
                    </Text>
                    <Text style={{ fontFamily: 'OpenSans-Regular', width: '90%', marginTop: 4, fontSize: 14, color: 'black' }}>
                        {email}
                    </Text>
                    <Text style={{ fontFamily: 'OpenSans-Semibold', width: '90%', marginTop: 10, fontSize: 14, color: 'black', }}>
                        Temp Password: {tempPass}
                    </Text>
                    <View style={alertStyles.alertButtonsLayout}>
                        <TouchableOpacity
                            onPress={() =>
                                setPasswordPopup(false)
                            }
                            style={superVisorEmployeeRequestStyles.button_cancel}>
                            <Text style={superVisorEmployeeRequestStyles.text_reject}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setPasswordPopup(false);
                                setLoading(true)
                                callConfirmPasswordAPI();
                            }}
                            style={superVisorEmployeeRequestStyles.button_submit}>
                            <Text style={superVisorEmployeeRequestStyles.text_reject}>
                                Confirm
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View >
    );
};

export default AdminResetPasswordByEmpID;