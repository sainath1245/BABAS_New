import AsyncStorage from '@react-native-async-storage/async-storage';
// import DateTimePicker from '@react-native-community/datetimepicker';
import NetInfo from "@react-native-community/netinfo";
import { format } from "date-fns";
import moment from 'moment';
import React, {
    useEffect,
    useState
} from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    Platform,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Modal from "react-native-modal";
import ModalDropdown from 'react-native-modal-dropdown';
import { openDatabase } from 'react-native-sqlite-storage';
import { BASE_URL } from '../utils/consts';
import {
    EmployeesUploadDocumentsPageStyles,
    adminSuperVisorMapping,
    historyPageStyles,
    loginPageStyles
} from '../utils/styles';
import { Button } from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

var width = Dimensions.get('window').width;
var db = openDatabase({ name: 'BABAS_DB.db' });

const AdminActivityLog = ({ navigation }) => {
    const dataAttendanceType = ['All', 'Reset Password', 'Delegation', 'Attendance Type'];
    const [date, setDate] = useState(new Date());
    const [dateToShow, setDateToShow] = useState('Select Date');
    const [dateToSend, setDateToSend] = useState('');
    const [dropDown, setDropDown] = useState(false);
    const [selectedValue, setSelectedValue] = useState('Activity');
    const [selectedValueToSend, setSelectedValueTosend] = useState('All');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [isConnected, setConnected] = useState();
    const [dataArray, setDataArray] = useState([]);
    const [userId, setUserId] = useState('');
    const [maxDate, setMaxDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const minDate = moment().subtract(90, 'days').toDate();
    const [originalArray, setOriginalArray] = useState([]);

    useEffect(() => {
        // This method to get the userId from local DB
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

        // This method to get user login token, this will require to call the APIs
        AsyncStorage.getItem('token', (err, item) => {
            setToken(item);
        })
        setLoading(true)
        setTimeout(() => {
            checkInternet();
        }, 1000);
    }, []);

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternet = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                getActivityLog(dateToSend, selectedValueToSend);
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

    // This function is to get all atendace type from server
    getActivityLog = async (date, selectedValueToSend) => {
        // console.log('dateToSend ==================== : ' + selectedValueToSend, date)
        var number = parseInt(userId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminID: number, activityDate: date, activityType: 0 })
        };
        console.log('=======requestOptions====== ' + requestOptions.body)
        console.log('=======token====== ' + token)
        await fetch(BASE_URL + 'Admin/GetActivityLog',
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
    }

  const hideCancelPicker = () => {
    setShow(false);
  };
  const handleConfirmPicker = date => {
    const currentDate = date;
    setShow(false);
    setDate(currentDate);
    setDateToShow(moment(currentDate).format('DD/MM/YYYY'));

    const formattedDate = moment(currentDate).format('DD/MM/YYYY');
    setDateToSend(formattedDate);
    filterActivityLogArray(formattedDate, selectedValueToSend);
  };
  const filterActivityLogArray = (filteredDate, filteredValue) => {
    console.log('date in filter--', filteredDate);
    console.log('selectedVal in filter--', filteredValue);
    let filterdArrayList = [];
    if (
      filteredDate != '' &&
      filteredValue != 'Activity' &&
      filteredValue != 'All'
    ) {
      console.log('Filtering two conditions');
      filterdArrayList = originalArray.filter(
        each => each.date == filteredDate && each.logType == filteredValue,
      );
    } else if (filteredDate != 'Select Date' && filteredDate != '') {
      console.log('filtering date');
      filterdArrayList = originalArray.filter(
        each => each.date == filteredDate,
      );
    } else if (filteredValue != 'Activity' && filteredValue != 'All') {
      console.log('Filtering selectedValue');
      filterdArrayList = originalArray.filter(
        each => each.logType == filteredValue,
      );
    } else if (filteredValue == 'All' && filteredDate == '') {
      console.log('Filtering selectedValue with date null');
      filterdArrayList = originalArray;
    }
    setDataArray(filterdArrayList);
  };

    // This function is to set FlatList UI
    const renderItem = ({ item }) => (
        <View>
            <View style={historyPageStyles.list_main_container}>
                <View style={adminSuperVisorMapping.list_second_container_2}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignItems: 'center', marginTop: 8 }}>
                        <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 12, color: 'black' }}>
                            {(item.date)} | {item.time}
                        </Text>
                        <View
                            style={EmployeesUploadDocumentsPageStyles.btn_activity_log}>
                            {
                                item.logType === 'Reset Password' ?
                                    <Text
                                        numberOfLines={1}
                                        style={loginPageStyles.btn_activity_log}>
                                        Reset Password
                                    </Text>
                                    : item.logType === 'Attendance Type' ?
                                        <Text
                                            numberOfLines={1}
                                            style={loginPageStyles.btn_activity_log}>
                                            Attendance Type
                                        </Text>
                                        :
                                        <Text
                                            numberOfLines={1}
                                            style={loginPageStyles.btn_activity_log}>
                                            Delegation
                                        </Text>
                            }
                        </View>
                    </View>
                    {
                        item === 'Reset Password' ?
                            <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 14, color: '#000000', margin: 10, alignSelf: 'flex-start' }}>
                                {item.messgge}
                            </Text> : item === 'Delegation' ?
                                <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 14, color: '#000000', margin: 10, alignSelf: 'flex-start' }}>
                                    {item.messgge}
                                </Text>
                                :
                                <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 14, color: '#000000', margin: 10, alignSelf: 'flex-start' }}>
                                    {item.messgge}
                                </Text>
                    }
                </View>
            </View>
        </View>
    );

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
                <View style={adminSuperVisorMapping.top_image_layer}>
                    <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 24, fontWeight: '400' }}>
                        Activity Log
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: width * .9 }}>
                    <TouchableOpacity style={adminSuperVisorMapping.activity_log_edit_bg}
                        onPress={() => { dropDown && dropDown.show(); }}>
                        <View style={EmployeesUploadDocumentsPageStyles.drop_container_1}>
                            <ModalDropdown ref={(el) => { setDropDown(el) }}
                                options={dataAttendanceType}
                                defaultValue={selectedValue}
                                textStyle={EmployeesUploadDocumentsPageStyles.drop_text}
                                dropdownStyle={EmployeesUploadDocumentsPageStyles.drop_1}
                                saveScrollPosition={false}
                                onSelect={
                                    (e) => {
                                        // console.log(e)
                                        // setSelectedValue(e)
                                        if (e === 0) {
                                            setSelectedValue('All');
                                            setSelectedValueTosend('All');
                                            // getActivityLog(dateToSend, 0);
                                            filterActivityLogArray(dateToSend, 'All');
                                        } else if (e === 1) {
                                            setSelectedValue('Reset Password');
                                            setSelectedValueTosend('Reset Password');
                                            // getActivityLog(dateToSend, 2);
                                            filterActivityLogArray(dateToSend, 'Reset Password');
                                        } else if (e === 2) {
                                            setSelectedValue('Delegation');
                                            setSelectedValueTosend('Supervisor Mapping');
                                            // getActivityLog(dateToSend, 3);
                                            filterActivityLogArray(dateToSend, 'Supervisor Mapping');
                                        } else if (e === 3) {
                                            setSelectedValue('Attendance Type');
                                            setSelectedValueTosend('Attendance Type');
                                            // getActivityLog(dateToSend, 1);
                                            filterActivityLogArray(dateToSend, 'Attendance Type');
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
                            {/* {
                                Platform.OS === 'android' ?
                                    <Button backgroundColor={'white'} style={{}} onPress={() => {
                                        setShow(true);
                                    }}>
                                        <Text style={{ color: 'black', }}>
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
                            } */}
              <Button
                backgroundColor={'white'}
                onPress={() => {
                  setShow(true);
                }}>
                <Text style={{color: 'black'}}>{dateToShow}</Text>
              </Button>
              {/* {show && (
                                <DateTimePicker
                                    style={{ position: 'absolute' }}
                                    testID="dateTimePicker"
                                    value={date}
                                    mode='date'
                                    maximumDate={maxDate}
                                    onChange={(event, date) => {
                                        const currentDate = date;
                                        // setDateToUI(currentDate);
                                        setShow(false);
                                        setDate(currentDate);
                                        setDateToShow(moment(currentDate).format("DD/MM/YYYY"))
                                        if (Platform.OS === 'ios') {
                                            const formattedDate = moment(date, "YYYY-MM-DD").format("yyyy-MM-DD");
                                            setDateToSend(formattedDate);
                                            getActivityLog(formattedDate, selectedValueToSend)
                                        } else {
                                            var formattedDate_1 = format(currentDate, "yyyy-MM-dd");
                                            setDateToSend(formattedDate_1);
                                            getActivityLog(formattedDate_1, selectedValueToSend)
                                        }
                                    }}
                                />
                            )} */}
              <DateTimePickerModal
                isVisible={show}
                mode="date"
                date={date}
                minimumDate={minDate}
                maximumDate={maxDate}
                onConfirm={handleConfirmPicker}
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
                                Admin activity logs will appear here.
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

export default AdminActivityLog;