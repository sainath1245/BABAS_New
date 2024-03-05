import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import NetInfo from "@react-native-community/netinfo";
import { useIsFocused } from '@react-navigation/core';
import { format } from "date-fns";
import React, {
    useEffect,
    useState
} from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Platform,
    StatusBar,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-datepicker';
import { TextInput } from 'react-native-gesture-handler';
import Modal from "react-native-modal";
import ModalDropdown from 'react-native-modal-dropdown';
import { openDatabase } from 'react-native-sqlite-storage';
import notificationStore from '../../notification_redux/notificationStore';
import { BASE_URL } from '../utils/consts';
import {
    adminDelegateDetails,
    adminSuperVisorMapping,
    alertStyles,
    clockInPageStyles,
    employeesForgotPasswordPageStyles,
    EmployeesUploadDocumentsPageStyles,
    historyDetailPageStyles,
    historyPageStyles,
    loginPageStyles,
    superVisorEmployeeRequestStyles
} from '../utils/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from "native-base";
import moment from 'moment';

var db = openDatabase({ name: 'BABAS_DB.db' });
const SuperVisorEmpRequestes = ({ navigation }) => {
    const [item_height, setItemHeight] = useState(0);
    const [isRejectPopupVisible, setRejectedPopupVisible] = useState(false)
    const [requestId, setRequestId] = useState('')
    const [comment, setComment] = useState('')
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [isConnected, setConnected] = useState();
    const [dataArray, setDataArray] = useState([])
    const [userId, setUserId] = useState('');
    const isFocused = useIsFocused();
    const [selectedValue, setSelectedValue] = useState('Attendance Type');
    const [selectedValueToSend, setSelectedValueTosend] = useState(0);
    const [attendanceType, setAttendanceType] = useState([]);
    const [dropDown, setDropDown] = useState(false);
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [empID, setEmpID] = useState('');
    const [name, setName] = useState('');
    const [noDataMessage, setNoDataMessage] = useState('User requests will appear here.');
    var notificationCount = notificationStore.getState().count;

    const [maxDate, setMaxDate] = useState(new Date());
    const [minDate, setMinDate] = useState(new Date());
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startDate_1, setStartDate_1] = useState(new Date());
    const [endDate_1, setEndDate_1] = useState(new Date());
    const [dateToShow, setDateToShow] = useState('Select Date');
    const [dateToShow_1, setDateToShow_1] = useState('Select Date');
    const [show, setShow] = useState(Platform.OS === 'ios' ? true : false);
    const [show_1, setShow_1] = useState(Platform.OS === 'ios' ? true : false);

    // This function is to get dynamic height of the UI comment
    const onLayout = (event) => {
        const { x, y, height, width } = event.nativeEvent.layout;
        setItemHeight(height);
    }

    useEffect(() => {
        setNoDataMessage('User requests will appear here.')
        setLoading(true)
        console.log('Working....')

        // This functio to get userId from local DB
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

        // This functio to get attendace type from local DB
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM attendance_type',
                [],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    console.log(' TEMP :: ::' + temp[0].typeId)
                    setAttendanceType(temp);
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

        // This piece of code is to set Date * Time on UI
        var today = new Date();
        // var formattedDate = format(today, "dd/MM/yyyy");
        // setMaxDate(formattedDate);

        today.setMonth(today.getMonth() - 2);
        var formattedDate = format(today, "dd/MM/yyyy");
        setMinDate(new Date(formattedDate));

    }, [isFocused])

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternet = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                getRequestForApproval();
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

    // This function is to Accept & Reject the clock in/out request 
    callApiForAccptReject = async (status, comment, requestId) => {
        console.log('------======-----==== requestId =====------- :: ' + requestId)
        console.log('------======-----==== status =====------- :: ' + status)
        console.log('------======-----==== comment =====------- :: ' + comment)
        var number = parseInt(userId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                supervisorID: number, requestID: requestId, status: status,
                comment: comment
            })
        };
        console.log("JSON request body ::: ::: :   :   :   +++ :: " + requestOptions.body)
        await fetch(BASE_URL + 'Attendance/RequestApproval',
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
                    setLoading(false);
                    setComment('')
                    if (status === 1) {
                        Alert.alert(
                            "Accepted!",
                            "Request ID - " + requestId + " has been approved.",
                            [
                                {
                                    text: "Ok",
                                    onPress: () => {
                                        setDataArray([]);
                                        setLoading(true);
                                        getRequestForApproval();
                                    }
                                }
                            ]
                        )
                    } else {
                        Alert.alert(
                            "Rejected!",
                            "Request ID - " + requestId + " has been rejected.",
                            [
                                {
                                    text: "Ok",
                                    onPress: () => {
                                        setDataArray([]); 89
                                        setLoading(true);
                                        getRequestForApproval();
                                    }
                                }
                            ]
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
                setComment('')
                setLoading(false);
            });
    }

    // This function is to set dropDown list 
    const renderDropDownList = (rowData) => {
        if (rowData.typeValue == undefined) {
            return <Text style={{ fontFamily: 'OpenSans-Regular', color: '#000', fontSize: 11, fontWeight: "300", padding: 6 }}>{rowData.workName}</Text>
        } else {
            return <Text style={{ fontFamily: 'OpenSans-Regular', color: '#000', fontSize: 11, fontWeight: "300", padding: 6 }}>{rowData.typeValue}</Text>
        }
    }

    // This function is to get all the clock in/out requestes
    getRequestForApproval = async () => {
        console.log('startDate ::: ::: ' + startDate);
        console.log('endDate ::: ::: ' + endDate);
        console.log('name ::: ::: ' + name);
        console.log('empID ::: ::: ' + empID);
        console.log('selectedValueToSend ::: ::: ' + selectedValueToSend);
        console.log('selectedValue ::: ::: ' + selectedValue);

        var newStartDate = '';
        var newEndDate = '';
        if (startDate !== '') {
            var formattedDate = new Date(startDate);
            var newStartDate = formattedDate.getUTCFullYear().toString() + "-" + (formattedDate.getMonth() + 1).toString() + "-" + formattedDate.getDate().toString();

            var formattedDate_1 = new Date(endDate);
            var newEndDate = formattedDate_1.getUTCFullYear().toString() + "-" + (formattedDate_1.getMonth() + 1).toString() + "-" + formattedDate_1.getDate().toString();

            console.log('newDate ::: ::: ' + newStartDate);
            console.log('newDate ::: ::: ' + newEndDate);
        }

        var number = parseInt(userId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                supervisorUserID: number, startDate: newStartDate, endDate: newEndDate,
                empName: name, empID: empID, workType: selectedValueToSend
            })
        };
        console.log('=======requestOptions====== ' + requestOptions.body)
        console.log('=======token====== ' + token)
        await fetch(BASE_URL + 'Attendance/GetRequestsForApproval',
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
                    console.log('json.data :: ' + JSON.stringify(json.data))
                    setDataArray(json.data);
                    if (JSON.stringify(json.data) === '[]') {
                        if (startDate === '' && endDate === '' && name === '' && empID === '' && selectedValueToSend === 0) {
                            setNoDataMessage('User requests will appear here.')
                        } else {
                            setNoDataMessage('The require field selection have no result, kindly return to filter screen for new selection.')
                        }
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
                setStartDate(new Date());
                setEndDate(new Date());
                setName('');
                setEmpID('');
                setSelectedValueTosend(0);
                setSelectedValue('Attendance Type');
                setLoading(false);
            });
    }

    // This function is to set FlatList UI 
    const renderItem = ({ item }) => (
        <View style={{ alignItems: 'center' }}>
            <View style={superVisorEmployeeRequestStyles.list_contain}>
                <View style={superVisorEmployeeRequestStyles.top_view}>
                    <View onLayout={onLayout} style={{ flex: 4 }}>
                        <Text style={historyPageStyles.title_text}>
                            {item.requestId}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={historyPageStyles.employee_name_text_1}>
                            {item.userName}
                        </Text>
                        <Text style={historyPageStyles.employee_name_text}>
                            {item.userID}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={historyPageStyles.employee_name_text_temp_1}>
                            {item.designation}
                        </Text>
                    </View>
                    <View style={{ backgroundColor: 'red', height: item_height - 20, width: 1, alignSelf: 'center' }} />
                    <View style={{ flex: 4, textAlign: 'right', alignItems: 'center', height: item_height, justifyContent: 'center' }}>
                        <Text style={superVisorEmployeeRequestStyles.clock_text}>
                            {item.requestType}
                        </Text>
                        <Text style={superVisorEmployeeRequestStyles.text_datetime}>
                            {item.startDate}, {item.startTime}
                        </Text>
                    </View>
                </View>
                <Image
                    style={superVisorEmployeeRequestStyles.image}
                    source={{ uri: item.imagePath }}
                />
                <View style={superVisorEmployeeRequestStyles.item_views_top}>
                    <View style={superVisorEmployeeRequestStyles.image_bg}>
                        <Image
                            style={historyPageStyles.item_icons_site_visit}
                            source={require('../assets/images/bag.png')}
                        />
                        <View style={superVisorEmployeeRequestStyles.right_line} />
                    </View>
                    <Text style={superVisorEmployeeRequestStyles.employee_name_text_3}>
                        {item.workType}
                    </Text>
                </View>
                <View style={superVisorEmployeeRequestStyles.item_views}>
                    <View style={superVisorEmployeeRequestStyles.image_bg}>
                        <Image
                            style={historyPageStyles.item_icons_site_visit}
                            source={require('../assets/images/ic_shop.png')}
                        />
                        <View style={superVisorEmployeeRequestStyles.right_line} />
                    </View>
                    <Text style={superVisorEmployeeRequestStyles.employee_name_text_3}>
                        {item.shopName}
                    </Text>
                </View>
                <View style={superVisorEmployeeRequestStyles.item_views_bottom}>
                    <View style={superVisorEmployeeRequestStyles.image_bg}>
                        <Image
                            style={historyPageStyles.item_icons_site_visit}
                            source={require('../assets/images/pin.png')}
                        />
                        <View style={superVisorEmployeeRequestStyles.right_line} />
                    </View>
                    <Text style={superVisorEmployeeRequestStyles.employee_name_text_3}>
                        {item.location}
                    </Text>
                </View>
                <Text style={superVisorEmployeeRequestStyles.remarks_heading}>
                    Remarks
                </Text>
                <Text style={superVisorEmployeeRequestStyles.remarks_text}>
                    {item.remark}
                </Text>
            </View>
            <View style={superVisorEmployeeRequestStyles.button_content}>
                <TouchableOpacity
                    onPress={() => {
                        // navigation.navigate('SuperVisorRejectedRequest')
                        setRequestId(item.requestId);
                        setRejectedPopupVisible(true)
                    }
                    }
                    style={superVisorEmployeeRequestStyles.button_reject}>
                    <Text style={superVisorEmployeeRequestStyles.text_reject}>
                        Reject
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setLoading(true)
                        setRequestId(item.requestId)
                        callApiForAccptReject(1, "", item.requestId)
                    }}
                    style={superVisorEmployeeRequestStyles.button_accept}>
                    <Text style={superVisorEmployeeRequestStyles.text_accept}>
                        Approve
                    </Text>
                </TouchableOpacity>
            </View>
        </View >
    );

    // This function is to set the UI 
    return (
        <View style={loginPageStyles.container_1}>
            <StatusBar barStyle="default"
                backgroundColor="#FA0F0A" />
            <View style={{ flexDirection: 'column', flex: 1, }}>
                <Image
                    style={EmployeesUploadDocumentsPageStyles.top_image}
                    source={require('../assets/images/top_image_1.png')}
                />
                {/* <View style={adminSuperVisorMapping.top_image_layer_1}>
                    <Text style={{ fontFamily: 'OpenSans-Semibold', color: 'white', fontSize: 18 }}>
                        Total Requestes: {dataArray.length}
                    </Text>
                </View> */}
                <View style={clockInPageStyles.top_image_layer} />
                <TouchableOpacity
                    style={{ marginTop: 40, paddingTop: 30, position: 'absolute', alignSelf: 'flex-end', paddingRight: 0 }}
                    onPress={() => { setFilterVisible(true) }}>
                    <Image
                        style={loginPageStyles.svg_bell_icons}
                        source={require('../assets/images/filter.png')}
                    />
                </TouchableOpacity>
                <View style={{ alignItems: 'center', alignItems: 'center', backgroundColor: '#fb0f0c', width: '100%' }}>
                    <Text style={{ fontSize: 14, color: 'white', marginTop: 4, marginBottom: 4, fontFamily: 'OpenSans-Bold' }}>
                        Total Pending Request: {dataArray.length}
                    </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                    {
                        dataArray.length > 0 ? <FlatList
                            style={{ marginTop: 10, marginBottom: 30, backgroundColor: 'white', width: '100%' }}
                            showsVerticalScrollIndicator={false}
                            data={dataArray}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                        /> : <Text style={{ fontFamily: 'OpenSans-Regular', alignSelf: 'center', fontSize: 12, color: '#000', textAlign: 'center', marginLeft: 20, marginRight: 20 }}>
                            {noDataMessage}
                        </Text>
                    }
                </View>
            </View>
            <Modal isVisible={isRejectPopupVisible}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                useNativeDriver={true}>
                <View style={alertStyles.alertBg}>
                    <TextInput
                        multiline
                        style={EmployeesUploadDocumentsPageStyles.input}
                        keyboardType="default"
                        placeholder="Please add you comment here."
                        placeholderTextColor="#e0e0e0"
                        maxLength={50}
                        numberOfLines={2}
                        onChangeText={(value) => setComment(value)}
                    />
                    <View style={alertStyles.alertButtonsLayout}>
                        <TouchableOpacity
                            onPress={() =>
                                setRejectedPopupVisible(false)
                            }
                            style={superVisorEmployeeRequestStyles.button_cancel}>
                            <Text style={superVisorEmployeeRequestStyles.text_reject}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                console.log('Request ID: ' + requestId);
                                console.log('comment: ' + comment);
                                if (comment != '') {
                                    setLoading(true);
                                    setRejectedPopupVisible(false);
                                    callApiForAccptReject(2, comment, requestId);
                                } else {
                                    Alert.alert(
                                        "Alert!",
                                        "Comment should not be empty.",
                                    )
                                }
                            }}
                            style={superVisorEmployeeRequestStyles.button_reject}>
                            <Text style={superVisorEmployeeRequestStyles.text_reject}>
                                Reject
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal isVisible={loading} style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <ActivityIndicator color={'#fff'} />
            </Modal>
            <Modal isVisible={isFilterVisible} style={{ marginLeft: 0, marginRight: 0, marginBottom: 0 }}>
                <View style={loginPageStyles.container}>
                    <View style={{ flexDirection: 'column' }}>
                        <Image
                            style={EmployeesUploadDocumentsPageStyles.top_image}
                            source={require('../assets/images/top_image_1.png')}
                        />
                        <View style={clockInPageStyles.top_image_layer} />
                        <TouchableNativeFeedback
                            onPress={() => {
                                setFilterVisible(false)
                            }}
                            style={employeesForgotPasswordPageStyles.back_btn_layout}>
                            <View style={clockInPageStyles.back_view}>
                                <Image
                                    style={clockInPageStyles.back_btn}
                                    source={require('../assets/images/ic_back.png')}
                                />
                                <Text style={clockInPageStyles.back_text}>
                                    Filter
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
                                    <Text style={adminDelegateDetails.delegate_text}>
                                        Start Date**
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
                                            maxDate={maxDate}
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            showIcon={false}
                                            onDateChange={(dateStr, date) => {
                                                setStartDate(date)
                                                setEndDate(date)
                                            }}
                                        /> */}
                                        <View style={{}}>
                                            {
                                                Platform.OS === 'android' ?
                                                    <Button backgroundColor={'white'} style={{}} onPress={() => {
                                                        setShow(true);
                                                    }}>
                                                        <Text style={{ color: 'black', alignSelf: 'flex-start' }}>
                                                            {dateToShow}
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
                                                    style={{ position: 'absolute', width: 200, alignSelf: 'flex-start' }}
                                                    testID="dateTimePicker"
                                                    value={startDate_1}
                                                    // minimumDate={minDate}
                                                    maximumDate={maxDate}
                                                    mode='date'
                                                    onChange={(event, date) => {
                                                        const currentDate = date;
                                                        console.log("Start Date ::: ::: " + (moment(currentDate).format("DD/MM/YYYY")))
                                                        setShow(false);
                                                        setDateToShow(moment(currentDate).format("DD/MM/YYYY"))

                                                        setStartDate_1(currentDate)
                                                        setEndDate_1(currentDate)

                                                        setStartDate(currentDate)
                                                        setEndDate(currentDate)
                                                    }}
                                                />
                                            )}
                                        </View>
                                    </View>
                                    <Text style={adminDelegateDetails.delegate_text}>
                                        End Date**
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
                                            maxDate={maxDate}
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            showIcon={false}
                                            onDateChange={(dateStr, date) => {
                                                setEndDate(date)
                                            }}
                                        /> */}
                                        <View style={{}}>
                                            {
                                                Platform.OS === 'android' ?
                                                    <Button backgroundColor={'white'} style={{}} onPress={() => {
                                                        setShow_1(true);
                                                    }}>
                                                        <Text style={{ color: 'black', alignSelf: 'flex-start' }}>
                                                            {dateToShow_1}
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
                                                    style={{ position: 'absolute', width: 200, alignSelf: 'flex-start' }}
                                                    testID="dateTimePicker"
                                                    value={endDate_1}
                                                    minimumDate={startDate_1}
                                                    maximumDate={maxDate}
                                                    mode='date'
                                                    onChange={(event, date) => {
                                                        const currentDate = date;
                                                        console.log("End Date ::: ::: " + (moment(currentDate).format("DD/MM/YYYY")))
                                                        setShow_1(false);
                                                        setDateToShow_1(moment(currentDate).format("DD/MM/YYYY"))

                                                        setEndDate_1(currentDate)
                                                        setEndDate(currentDate)
                                                    }}
                                                />
                                            )}
                                        </View>
                                    </View>
                                    <Text style={adminDelegateDetails.delegate_text}>
                                        User Name
                                    </Text>
                                    <View style={adminDelegateDetails.edit_bg}>
                                        <Image
                                            style={loginPageStyles.svg_icons}
                                            source={require('../assets/images/ic_user.png')}
                                        />
                                        <TextInput
                                            style={loginPageStyles.input}
                                            keyboardType="default"
                                            placeholder="Name"
                                            placeholderTextColor="#e0e0e0"
                                            onChangeText={(value) => setName(value)}
                                        />
                                    </View>
                                    <Text style={adminDelegateDetails.delegate_text}>
                                        User ID
                                    </Text>
                                    <View style={adminDelegateDetails.edit_bg}>
                                        <Image
                                            style={loginPageStyles.svg_icons}
                                            source={require('../assets/images/ic_user.png')}
                                        />
                                        <TextInput
                                            style={loginPageStyles.input}
                                            keyboardType="default"
                                            placeholder="User ID"
                                            placeholderTextColor="#e0e0e0"
                                            onChangeText={(value) => setEmpID(value)}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={EmployeesUploadDocumentsPageStyles.dropdown_filter}
                                        onPress={() => { dropDown && dropDown.show(); }}>
                                        <View style={EmployeesUploadDocumentsPageStyles.drop_container}>
                                            <ModalDropdown ref={(el) => { setDropDown(el) }}
                                                options={attendanceType}
                                                renderRow={(rowData) => renderDropDownList(rowData)}
                                                textStyle={EmployeesUploadDocumentsPageStyles.drop_text}
                                                dropdownStyle={EmployeesUploadDocumentsPageStyles.drop_1}
                                                saveScrollPosition={false}
                                                onSelect={
                                                    (e) => {
                                                        console.log('--- ' + attendanceType[e].typeValue)
                                                        var temp = attendanceType[e].typeValue;
                                                        setSelectedValue(temp)
                                                        setSelectedValueTosend(attendanceType[e].typeId)
                                                    }}
                                            />
                                            <View style={{ position: 'absolute', backgroundColor: '#fff', width: 200 }}>
                                                <Text style={{ fontFamily: 'OpenSans-Regular', marginLeft: 10 }}>
                                                    {selectedValue}
                                                </Text>
                                            </View>
                                            <View style={EmployeesUploadDocumentsPageStyles.drop_icon}>
                                                <Text>▼</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            console.log('startDate ::: ::: ' + startDate);
                                            console.log('endDate ::: ::: ' + endDate);
                                            console.log('name ::: ::: ' + name);
                                            console.log('empID ::: ::: ' + empID);
                                            console.log('selectedValueToSend ::: ::: ' + selectedValueToSend);
                                            console.log('selectedValue ::: ::: ' + selectedValue);

                                            if (startDate === '' && endDate === '' && name === '' && empID === '' && selectedValueToSend === 0) {
                                                Alert.alert(
                                                    "Alert!",
                                                    "Select/fill at least one field to filter.",
                                                )
                                            } else {
                                                setFilterVisible(false);
                                                setLoading(true)
                                                getRequestForApproval();
                                            }
                                        }}
                                        style={EmployeesUploadDocumentsPageStyles.btn_upload_filter}>
                                        <Text style={loginPageStyles.btn_text}>
                                            Apply
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SuperVisorEmpRequestes;