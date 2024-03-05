import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image, StatusBar, Text, TouchableNativeFeedback, TouchableOpacity, View, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    clockInPageStyles,
    employeesForgotPasswordPageStyles,
    employeesSuccessMessagePageStyles,
    EmployeesUploadDocumentsPageStyles,
    historyDetailPageStyles,
    loginPageStyles
} from '../utils/styles';
import NetInfo from "@react-native-community/netinfo";
import { BASE_URL } from '../utils/consts';
import Modal from "react-native-modal";
import notificationStore from '../../notification_redux/notificationStore';

const EmployeesHistoryDetail = ({ route, navigation }) => {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [isConnected, setConnected] = useState();
    const [remark, setRemark] = useState('');
    const [supervisorComment, setSupervisorComment] = useState('');
    const [imageURL, setImageURL] = useState('');
    var notificationCount = notificationStore.getState().count;
    const { requestID } = route.params;

    useEffect(() => {
        setLoading(true);
        // This function is to get token to call the APIs
        AsyncStorage.getItem('token', (err, item) => {
            setToken(item);
        })
        setTimeout(() => {
            checkInternet();
        }, 2000);

    }, [])

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternet = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                callHistoryDetailsAPI();
            } else {
                setLoading(false);
                console.log('-=-=-=-=-=-=-=-=-')
                Alert.alert(
                    "Alert!",
                    "(Offline) No internet connection. Please try again later.",
                )
            }
            setConnected(state.isConnected);
        });
        return (isConnected);
    }

    // This function is to get History details via request ID 
    callHistoryDetailsAPI = async () => {
        var number = parseInt(requestID);
        console.log('requestId ::::: ::::: ::::: ::::' + number)
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId: number })
        };
        console.log('=======requestOptions====== ' + requestOptions.body)
        console.log('=======token====== ' + token)
        await fetch(BASE_URL + 'Attendance/GetRequestDetails',
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
                let json = data;
                if (json.responseCode == 200) {
                    console.log(json.data)
                    setRemark(json.data.remark);
                    setSupervisorComment(json.data.supervisorComments);
                    setImageURL(json.data.imagePath);
                    console.log('json.data.imagePath ::: ' + json.data.imagePath)
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
                                History
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
                    <KeyboardAwareScrollView style={{ marginBottom: 150 }} enableOnAndroid={true}>
                        <View style={loginPageStyles.content_container}>
                            <View style={historyDetailPageStyles.btn_container}>
                                <Image
                                    style={historyDetailPageStyles.top_image}
                                    source={{ uri: imageURL }}
                                />
                                <Text style={historyDetailPageStyles.remark_text_hint}>
                                    Remarks
                                </Text>
                                <Text style={historyDetailPageStyles.remark_text_hint_1}>
                                    {remark}
                                </Text>
                                <Text style={historyDetailPageStyles.comment_text_hint}>
                                    Supervisor comment
                                </Text>
                                <Text style={historyDetailPageStyles.remark_text_hint_1}>
                                    {supervisorComment}
                                </Text>
                                <View style={employeesSuccessMessagePageStyles.bottom_view}>
                                </View>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
                <Modal isVisible={loading} style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <ActivityIndicator color={'#fff'} />
                </Modal>
            </View>
        </SafeAreaView>
    );
};

export default EmployeesHistoryDetail;