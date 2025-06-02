import NetInfo from "@react-native-community/netinfo";
import { format } from "date-fns";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, Dimensions, FlatList, Image, Platform, StatusBar, Text, TouchableOpacity, View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-datepicker';
import Modal from "react-native-modal";
import ModalDropdown from 'react-native-modal-dropdown';
import { openDatabase } from 'react-native-sqlite-storage';
import { BASE_URL } from '../utils/consts';
import { adminSuperVisorMapping, clockInPageStyles, EmployeesUploadDocumentsPageStyles, historyPageStyles, loginPageStyles } from '../utils/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
// import { Button } from "native-base";
import { Button } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";

var db = openDatabase({ name: 'BABAS_DB.db' });
var width = Dimensions.get('window').width;

const SuperVisorApprovalHistory = ({ navigation }) => {
    const dataAttendanceType = ['All', 'Approved', 'Rejected'];
    const [selectedValue, setSelectedValue] = useState('Type');
    const [selectedValueToSend, setSelectedValueTosend] = useState('All');
    const [item_height, setItemHeight] = useState(0);
    const [dataArray, setDataArray] = useState([])
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [isConnected, setConnected] = useState();
    const [dropDown, setDropDown] = useState(false);

    const [date, setDate] = useState(new Date());
    const [dateToSend, setDateToSend] = useState(null);
    const [maxDate, setMaxDate] = useState(new Date());
    const [dateToShow, setDateToShow] = useState('Select Date');
    // const [show, setShow] = useState(Platform.OS === 'ios' ? true : false);
    const [show, setShow] = useState(false);
  const minDate = moment().subtract(90, 'days').toDate();
  const [originalArray, setOriginalArray] = useState([]);
    // This function is to get dynamic height of the UI component 
    const onLayout = (event) => {
        const { x, y, height, width } = event.nativeEvent.layout;
        if (item_height === 0) {
            setItemHeight(height);
        }
    }

    useEffect(() => {
        setLoading(true)

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

        // This function is to get token to call the APIs
        AsyncStorage.getItem('token', (err, item) => {
            setToken(item);
        })
        setTimeout(() => {
            checkInternet();
        }, 2000);

    }, [])
    
      const hideCancelPicker = () => {
        setShow(false);
      };
    
      const handleConfirm = (date) => {
    // console.warn('A date has been picked: ', date);
    const currentDate = date;
    // console.log('currentData-', currentDate);
    // setDateToUI(currentDate);
    setShow(false);
    setDate(currentDate);
    setDateToShow(moment(currentDate).format('DD/MM/YYYY'));
    const formattedDate = format(currentDate, 'dd/MM/yyyy');
    // console.log('formateed in iOS--', formattedDate);
    setDateToSend(formattedDate);
    // callHistoryAPI(formattedDate, selectedValueToSend);
    filterArrayList(formattedDate, selectedValueToSend);
  };
    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternet = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                callHistoryAPI(dateToSend, selectedValueToSend);
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

    // This function is to get Clock in/out Hisotry data from server
    callHistoryAPI = async (date, selectedValueToSend) => {
        var number = parseInt(userId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                supervisorID: number,
                // , pageNumber: 1, pageSize: 100, 
                status: 0, date: null,
            })
        };
        console.log('GetSupervisorApprovalHistory--request' + requestOptions.body)
        console.log('=======token====== ' + token)
        await fetch(BASE_URL + 'Attendance/GetSupervisorApprovalHistory',
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
                // console.log('==== resp  onseCode==== ' + data.responseCode);
                let json = data;
                if (json.responseCode == 200) {
                    // console.log('==History Data== ' + JSON.stringify(json.data))
                    setDataArray(json.data);
                    setOriginalArray(json.data);
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
  };

  const filterArrayList = (filteredDate, filteredValue) => {
    console.log('date in filter--', filteredDate);
    console.log('selectedVal in filter--', filteredValue);
    let filterdArrayList = [];
    if (
      filteredDate != null &&
      filteredValue != 'Type'&&
      filteredValue != 'All') {
      console.log('Filtering two conditions');
      filterdArrayList = originalArray.filter(
        each => each.requestedDate == filteredDate && each.status == filteredValue,
      );
    } else if (filteredDate != 'Select Date' && filteredDate != null) {
      console.log('filtering date');
      filterdArrayList = originalArray.filter(
        each => each.requestedDate == filteredDate,
      );
    } else if (filteredValue != 'Type' && filteredValue != 'All') {
      console.log('Filtering selectedValue');
      filterdArrayList = originalArray.filter(
        each => each.status == filteredValue,
      );
    } else if (filteredValue == 'All' && filteredDate == null) {
      console.log('Filtering selectedValue with date null');
      filterdArrayList = originalArray;
    }
    setDataArray(filterdArrayList);
    // console.log('final filtered Array', filterdArrayList);
  };

    // This function is to set FlatList UI
    const renderItem = ({ item }) => (
        <View>
            <TouchableOpacity style={historyPageStyles.list_main_container}
                onPress={() =>
                    navigation.navigate('SuperVisorHistoryDetail', {
                        requestID: item.requestId,
                    })} >
                {
                    item.status === 'Rejected' ?
                        <View style={{ width: width * .9, backgroundColor: '#ffebeb', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View onLayout={onLayout}>
                                <Text style={historyPageStyles.title_text}>
                                    {item.requestId}
                                </Text>
                                <Text style={historyPageStyles.employee_name_text}>
                                    {item.userName}
                                </Text>
                                <Text numberOfLines={1} style={historyPageStyles.employee_name_text_temp}>
                                    {item.designation}
                                </Text>
                                <View style={historyPageStyles.item_views}>
                                    <Image
                                        style={historyPageStyles.item_icons}
                                        source={require('../assets/images/bag.png')}
                                    />
                                    <Text style={historyPageStyles.employee_name_text}>
                                        {item.workType}
                                    </Text>
                                </View>
                                <View style={historyPageStyles.item_views}>
                                    <Image
                                        style={historyPageStyles.item_icons}
                                        source={require('../assets/images/ic_shop.png')}
                                    />
                                    <Text numberOfLines={1} style={historyPageStyles.employee_name_text_2}>
                                        {item.shopName}
                                    </Text>
                                </View>
                                <View style={historyPageStyles.item_views}>
                                    <Image
                                        style={historyPageStyles.item_icons}
                                        source={require('../assets/images/pin.png')}
                                    />
                                    <Text numberOfLines={1} style={historyPageStyles.employee_name_text_2}>
                                        {item.location}
                                    </Text>
                                </View>
                                <Text style={historyPageStyles.clock_text}>
                                    {item.requestType}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ backgroundColor: 'white', width: 2, height: item_height, }} />
                                <View style={{ flexDirection: 'column', alignItems: 'center', padding: 5, justifyContent: 'center', backgroundColor: '#fbdbdb', height: item_height }}>
                                    <Text style={historyPageStyles.date_text}>
                                        {item.requestedDate}{'\n'}{item.requestedTime}
                                    </Text>
                                    <View
                                        style={historyPageStyles.circle_1}>
                                        <Image
                                            style={historyPageStyles.bottom_btns}
                                            source={require('../assets/images/cross.png')}
                                        />
                                    </View>
                                    <Text style={{ fontFamily: 'OpenSans-Semibold', marginTop: 10, fontSize: 12 }}>
                                        Rejected
                                    </Text>
                                </View>
                            </View>
                        </View>
                        : item.status === 'Approved' ?
                            <View style={{ width: width * .9, backgroundColor: '#ECF5EC', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View onLayout={onLayout}>
                                    <Text style={historyPageStyles.title_text}>
                                        {item.requestId}
                                    </Text>
                                    <Text style={historyPageStyles.employee_name_text}>
                                        {item.userName}
                                    </Text>
                                    <Text numberOfLines={1} style={historyPageStyles.employee_name_text_temp}>
                                        {item.designation}
                                    </Text>
                                    <View style={historyPageStyles.item_views}>
                                        <Image
                                            style={historyPageStyles.item_icons}
                                            source={require('../assets/images/bag.png')}
                                        />
                                        <Text style={historyPageStyles.employee_name_text}>
                                            {item.workType}
                                        </Text>
                                    </View>
                                    <View style={historyPageStyles.item_views}>
                                        <Image
                                            style={historyPageStyles.item_icons}
                                            source={require('../assets/images/ic_shop.png')}
                                        />
                                        <Text numberOfLines={1} style={historyPageStyles.employee_name_text_2}>
                                            {item.shopName}
                                        </Text>
                                    </View>
                                    <View style={historyPageStyles.item_views}>
                                        <Image
                                            style={historyPageStyles.item_icons}
                                            source={require('../assets/images/pin.png')}
                                        />
                                        <Text numberOfLines={1} style={historyPageStyles.employee_name_text_2}>
                                            {item.location}
                                        </Text>
                                    </View>
                                    <Text style={historyPageStyles.clock_text}>
                                        {item.requestType}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ backgroundColor: 'white', width: 2, height: item_height, }} />
                                    <View style={{ flexDirection: 'column', alignItems: 'center', padding: 5, justifyContent: 'center', backgroundColor: '#E0F2E0', height: item_height }}>
                                        <Text style={historyPageStyles.date_text}>
                                            {item.requestedDate}{'\n'}{item.requestedTime}
                                        </Text>
                                        <View
                                            style={historyPageStyles.circle_1}>
                                            <Image
                                                style={historyPageStyles.bottom_btns_approved}
                                                source={require('../assets/images/approved.png')}
                                            />
                                        </View>
                                        <Text style={{ fontFamily: 'OpenSans-Semibold', marginTop: 10, fontSize: 12 }}>
                                            Approved
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            :
                            <View style={{ width: width * .9, backgroundColor: '#FDF5EC', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View onLayout={onLayout}>
                                    <Text style={historyPageStyles.title_text}>
                                        {item.requestId}
                                    </Text>
                                    <Text style={historyPageStyles.employee_name_text}>
                                        {item.userName}
                                    </Text>
                                    <Text style={historyPageStyles.employee_name_text}>
                                        {item.userID}
                                    </Text>
                                    <Text numberOfLines={1} style={historyPageStyles.employee_name_text_temp}>
                                        {item.designation}
                                    </Text>
                                    <View style={historyPageStyles.item_views}>
                                        <Image
                                            style={historyPageStyles.item_icons}
                                            source={require('../assets/images/bag.png')}
                                        />
                                        <Text style={historyPageStyles.employee_name_text}>
                                            {item.workType}
                                        </Text>
                                    </View>
                                    <View style={historyPageStyles.item_views}>
                                        <Image
                                            style={historyPageStyles.item_icons}
                                            source={require('../assets/images/ic_shop.png')}
                                        />
                                        <Text numberOfLines={1} style={historyPageStyles.employee_name_text_2}>
                                            {item.shopName}
                                        </Text>
                                    </View>
                                    <View style={historyPageStyles.item_views}>
                                        <Image
                                            style={historyPageStyles.item_icons}
                                            source={require('../assets/images/pin.png')}
                                        />
                                        <Text numberOfLines={1} style={historyPageStyles.employee_name_text_2}>
                                            {item.location}
                                        </Text>
                                    </View>
                                    <Text style={historyPageStyles.clock_text}>
                                        {item.requestType}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ backgroundColor: 'white', width: 2, height: item_height, }} />
                                    <View style={{ flexDirection: 'column', alignItems: 'center', padding: 5, justifyContent: 'center', backgroundColor: '#FAECDE', height: item_height }}>
                                        <Text style={historyPageStyles.date_text}>
                                            {item.requestedDate}{'\n'}{item.requestedTime}
                                        </Text>
                                        <View
                                            style={historyPageStyles.circle_1}>
                                            <Image
                                                style={historyPageStyles.bottom_btns}
                                                source={require('../assets/images/timer.png')}
                                            />
                                        </View>
                                        <Text style={{ fontFamily: 'OpenSans-Semibold', marginTop: 10, fontSize: 12 }}>
                                            Not Review
                                        </Text>
                                    </View>
                                </View>
                            </View>}
            </TouchableOpacity>
        </View>
    );

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
                <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: width * .9 }}>
                    <TouchableOpacity style={adminSuperVisorMapping.activity_log_edit_bg}
                        onPress={() => { dropDown && dropDown.show(); }}>
                        <View style={EmployeesUploadDocumentsPageStyles.drop_container_1}>
                            <ModalDropdown ref={(el) => { setDropDown(el) }}
                                options={dataAttendanceType}
                                defaultValue={selectedValue}
                                textStyle={EmployeesUploadDocumentsPageStyles.drop_text}
                                dropdownStyle={[EmployeesUploadDocumentsPageStyles.drop_1, {height: 115}]}
                                saveScrollPosition={false}
                                onSelect={
                                    (e) => {
                                        // console.log('selected dropdown val--', e);
                                        // setSelectedValue(e)
                                        if (e === 0) {
                                            setSelectedValue('All');
                                            setSelectedValueTosend('All');
                                            // callHistoryAPI(dateToSend, 0);
                                            filterArrayList(dateToSend, 'All');
                                        } else if (e === 1) {
                                            setSelectedValue('Approved');
                                            setSelectedValueTosend('Approved');
                                            // callHistoryAPI(dateToSend, 1);
                                            filterArrayList(dateToSend, 'Approved');
                                        } else if (e === 2) {
                                            setSelectedValue('Rejected');
                                            setSelectedValueTosend('Rejected');
                                            // callHistoryAPI(dateToSend, 2);
                                            filterArrayList(dateToSend, 'Rejected');
                                        }
                                    }}
                            />
                            <View style={{ position: 'absolute', backgroundColor: '#fff', width: 165 }}>
                                <Text style={{ fontFamily: 'OpenSans-Regular', marginLeft: 10 }}>
                                    {selectedValue}
                                </Text>
                            </View>
                            <View style={EmployeesUploadDocumentsPageStyles.drop_icon}>
                                <Text>▼</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={adminSuperVisorMapping.activity_log_edit_bg}>
                        <Image
                            style={loginPageStyles.svg_icons}
                            source={require('../assets/images/calendar.png')}
                        />
                        <View style={{flex: 1}}>
                            <Button backgroundColor={'white'} style={{}} onPress={() => {
                                        setShow(true);
                                    }}>
                                        <Text style={{ color: 'black' }}>
                                            {dateToShow}
                                        </Text>
                                    </Button>
              <DateTimePickerModal
                isVisible={show}
                mode="date"
                date={date}
                minimumDate={minDate}
                maximumDate={maxDate}
                onConfirm={handleConfirm}
                onCancel={hideCancelPicker}
              />
            </View>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                    {
                        dataArray.length > 0 ? <FlatList
                            style={{ marginTop: 10, marginBottom: 30, width: '100%' }}
                            showsVerticalScrollIndicator={false}
                            data={dataArray}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem} />
                            :
                            <Text style={{ fontFamily: 'OpenSans-Regular', alignSelf: 'center', fontSize: 12, color: '#000' }}>
                                Approval History data will appear here.
                            </Text>
                    }
                </View>
            </View>
            <Modal isVisible={loading} style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <ActivityIndicator color={'#fff'} />
            </Modal>
        </View >
    );
};

export default SuperVisorApprovalHistory;
