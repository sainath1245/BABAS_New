import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import NetInfo from "@react-native-community/netinfo";
import { format } from "date-fns";
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image, StatusBar, Text, TouchableNativeFeedback, TouchableOpacity, View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-datepicker';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openDatabase } from 'react-native-sqlite-storage';
import { BASE_URL } from '../utils/consts';
import { adminDelegateDetails, clockInPageStyles, employeesForgotPasswordPageStyles, employeesSuccessMessagePageStyles, EmployeesUploadDocumentsPageStyles, historyDetailPageStyles, loginPageStyles } from '../utils/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'native-base';
import moment from 'moment';

var db = openDatabase({ name: 'BABAS_DB.db' });
const AdminDelegateDetails = ({ route, navigation }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [minDate, setMinDate] = useState(new Date());
    const [reason, setReason] = useState();

    const [show, setShow] = useState(Platform.OS === 'ios' ? true : false);
    const [dobToShow, setDOBToShow] = useState('Select Date');

    const [show_1, setShow_1] = useState(Platform.OS === 'ios' ? true : false);
    const [dobToShow_1, setDOBToShow_1] = useState('Select Date');

    const { supervisorID, newApproverId } = route.params;

    console.log(supervisorID, newApproverId)

    const [loading, setLoading] = useState(false);
    const [isConnected, setConnected] = useState();
    const [userId, setUserId] = useState('');

    const [token, setToken] = useState('');

    useEffect(() => {
        // This piece of code sets the Date for UI
        var today = new Date();
        // var formattedDate = format(today, "dd/MM/yyyy");
        // setMinDate(formattedDate);

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
                }
            );
        });
        // This function is to get token to call the APIs
        AsyncStorage.getItem('token', (err, item) => {
            setToken(item);
        })
    }, []);

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternet = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                setLoading(true)
                callSuperVisorDelegation();
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

    // This function is to send deligation data to server
    callSuperVisorDelegation = async () => {
        var startDateToSend_1 = format(startDate, "yyyy-MM-dd");
        var endDateToSend_1 = format(endDate, "yyyy-MM-dd");
        var number = parseInt(userId);
        var number_1 = parseInt(supervisorID);
        var number_2 = parseInt(newApproverId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminID: number, supervisorId: number_1, newApproverId: number_2,
                startDate: startDateToSend_1, endDate: endDateToSend_1, delegationReason: reason
            })
        };
        console.log('--requestOptions.body--:' + requestOptions.body)
        await fetch(BASE_URL + 'Admin/SupervisorDelegation',
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
                console.log(json.data)
                if (json.responseCode == 200) {
                    Alert.alert(
                        "Alert!",
                        "Delegation to New Approver completed.",
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

    // This functio is to set the UI
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
                                Delegate Details
                            </Text>
                        </View>
                    </TouchableNativeFeedback >
                    <KeyboardAwareScrollView>
                        <View style={loginPageStyles.content_container}>
                            <View style={historyDetailPageStyles.btn_container}>
                                <Text style={adminDelegateDetails.delegate_text}>
                                    Delegate Date From
                                </Text>
                                <View style={adminDelegateDetails.edit_bg}>
                                    <Image
                                        style={loginPageStyles.svg_icons}
                                        source={require('../assets/images/calendar.png')}
                                    />
                                    {/* <DatePicker
                                        customStyles={{ dateInput: { borderWidth: 0, marginLeft: -40 } }}
                                        date={startDate}
                                        mode="date"
                                        placeholder="Select date"
                                        format="DD/MM/YYYY"
                                        minDate={minDate}
                                        maxDate={endDate}
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        showIcon={false}
                                        onDateChange={onChange}
                                    /> */}
                                    <View style={{}}>
                                        {
                                            Platform.OS === 'android' ?
                                                <Button backgroundColor={'white'} style={{}} onPress={() => {
                                                    setShow(true);
                                                }}>
                                                    <Text style={{ color: 'black', alignSelf: 'flex-start' }}>
                                                        {dobToShow}
                                                    </Text>
                                                </Button>
                                                :
                                                <Button backgroundColor={'white'} style={{}} onPress={() => {
                                                    setShow(true);
                                                }}>
                                                    <Text style={{ color: 'black' }}>
                                                    </Text>
                                                </Button>
                                        }
                                        {show && (
                                            <DateTimePicker
                                                style={{ position: 'absolute' }}
                                                testID="dateTimePicker"
                                                value={startDate}
                                                mode='date'
                                                minimumDate={minDate}
                                                onChange={(event, date) => {
                                                    const currentDate = date;
                                                    console.log("Start Date ::: ::: " + (moment(currentDate).format("DD/MM/YYYY")))
                                                    console.log("Start Date ::: ::: " + currentDate)
                                                    setShow(false);
                                                    setDOBToShow(moment(currentDate).format("DD/MM/YYYY"))
                                                    setStartDate(currentDate);
                                                }}
                                            />
                                        )}
                                    </View>
                                </View>
                                <Text style={adminDelegateDetails.delegate_text}>
                                    Delegate Date To
                                </Text>
                                <View style={adminDelegateDetails.edit_bg}>
                                    <Image
                                        style={loginPageStyles.svg_icons}
                                        source={require('../assets/images/calendar.png')}
                                    />
                                    {/* <DatePicker
                                        customStyles={{ dateInput: { borderWidth: 0, marginLeft: -40 } }}
                                        date={endDate}
                                        mode="date"
                                        placeholder="Select date"
                                        format="DD/MM/YYYY"
                                        minDate={startDate}
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        showIcon={false}
                                        onDateChange={(dateStr, date) => { setEndDate(date) }}
                                    /> */}
                                    <View style={{}}>
                                        {
                                            Platform.OS === 'android' ?
                                                <Button backgroundColor={'white'} style={{}} onPress={() => {
                                                    setShow_1(true);
                                                }}>
                                                    <Text style={{ color: 'black', alignSelf: 'flex-start' }}>
                                                        {dobToShow_1}
                                                    </Text>
                                                </Button>
                                                :
                                                <Button backgroundColor={'white'} style={{}} onPress={() => {
                                                    setShow_1(true);
                                                }}>
                                                    <Text style={{ color: 'black' }}>
                                                    </Text>
                                                </Button>
                                        }
                                        {show_1 && (
                                            <DateTimePicker
                                                style={{ position: 'absolute' }}
                                                testID="dateTimePicker"
                                                value={endDate}
                                                minimumDate={startDate}
                                                mode='date'
                                                onChange={(event, date) => {
                                                    const currentDate = date;
                                                    console.log("End Date ::: ::: " + (moment(currentDate).format("DD/MM/YYYY")))
                                                    setShow_1(false);
                                                    setDOBToShow_1(moment(currentDate).format("DD/MM/YYYY"))
                                                    setEndDate(currentDate);
                                                }}
                                            />
                                        )}
                                    </View>
                                </View>
                                <Text style={adminDelegateDetails.delegate_text}>
                                    Delegate Reason
                                </Text>
                                <View style={adminDelegateDetails.edit_remark}>
                                    <TextInput
                                        multiline
                                        style={EmployeesUploadDocumentsPageStyles.input}
                                        keyboardType="default"
                                        placeholder="Delegate Reason(50 Chars)"
                                        placeholderTextColor="#e0e0e0"
                                        maxLength={50}
                                        numberOfLines={2}
                                        onChangeText={(value) => setReason(value)}
                                    />
                                </View>
                                <View style={adminDelegateDetails.checkbox}>
                                    <Text style={{ fontFamily: 'OpenSans-Regular', alignSelf: 'center', marginLeft: 10, fontSize: 12, marginTop: -6, marginBottom: -6 }}>
                                        Notes: All pending approval records will default transfer to new approver after delegation.
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (startDate !== undefined && endDate !== undefined && reason !== undefined) {
                                            checkInternet()
                                        } else {
                                            Alert.alert(
                                                "Alert!",
                                                "Start Date, End Date & Delegate Reason should not be empty.",
                                            )
                                        }
                                    }}
                                    style={EmployeesUploadDocumentsPageStyles.btn_upload_filter}>
                                    {loading ? <View style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                        {
                                            loading &&
                                            <ActivityIndicator color={'#fff'} />
                                        }
                                    </View> : <Text style={loginPageStyles.btn_text}>
                                        Apply
                                    </Text>}
                                </TouchableOpacity>
                                <View style={employeesSuccessMessagePageStyles.bottom_view_1}>
                                    <View style={{ alignItems: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                navigation.navigate("AdminHomeDrawer", {
                                                    screen: "AdminDashboard"
                                                });
                                            }}
                                            style={employeesSuccessMessagePageStyles.circle_1}>
                                            <Image
                                                style={employeesSuccessMessagePageStyles.bottom_btns}
                                                source={require('../assets/images/ic_home.png')}
                                            />
                                        </TouchableOpacity>
                                        <Text style={{ fontFamily: 'OpenSans-Regular', marginTop: 5, marginBottom: 10, fontSize: 16, color: 'gray' }}>
                                            Home
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AdminDelegateDetails;