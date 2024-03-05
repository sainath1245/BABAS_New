import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import React, {
    useEffect,
    useState
} from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StatusBar,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from 'react-native';
import Modal from "react-native-modal";
import { openDatabase } from 'react-native-sqlite-storage';
import { SafeAreaView } from 'react-navigation';
import notificationStore from '../../notification_redux/notificationStore';
import { BASE_URL } from '../utils/consts';
import {
    EmployeesUploadDocumentsPageStyles,
    adminSuperVisorMapping,
    clockInPageStyles,
    employeesForgotPasswordPageStyles,
    historyPageStyles,
    loginPageStyles
} from '../utils/styles';

var db = openDatabase({ name: 'BABAS_DB.db' });

const Notifications = ({ navigation }) => {
    const [userData, setUserData] = useState([]);
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataArray, setDataArray] = useState([])
    const [isConnected, setConnected] = useState();

    useEffect(() => {
        setLoading(true);
        // This method to get the userId & user datafrom local DB
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

        // This method to get user login token, this will require to call the APIs
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
                callNotificationAPI();
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

    // This function is to get notifications from server 
    callNotificationAPI = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID: userId })
        };
        console.log('=======requestOptions====== ' + requestOptions.body)
        console.log('=======token====== ' + token)
        await fetch(BASE_URL + 'User/GetUserNotification',
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
                    console.log('==== resp  onseCode==== ' + JSON.stringify(json));
                    notificationStore.dispatch({
                        type: "COUNT_CHANGE",
                        payload: { count: '0' }
                    });
                    setDataArray(json.data);
                } else {
                    Alert.alert(
                        "Alert!",
                        dataArray.responseMessage,
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

    // This function is to set FlatList UI 
    const renderItem = ({ item }) => (
        <View style={{ flex: 1 }}>
            <View style={historyPageStyles.list_main_container}>
                <View style={adminSuperVisorMapping.list_second_container_red}>
                    {
                        item.notificationType === 'Attendance Request' ?
                            <TouchableOpacity
                                onPress={() => {
                                    if (userData[0].userRole == 3) {
                                        navigation.navigate('EmployeesHistoryDetail', {
                                            requestID: item.entityID,
                                        })
                                    } else if (userData[0].userRole == 2) {
                                        navigation.navigate('SuperVisorHistoryDetail', {
                                            requestID: item.entityID,
                                        })
                                    }
                                }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ padding: 10, backgroundColor: '#F9E9E8', width: '100%' }}>
                                        <Text style={historyPageStyles.noti_text}>
                                            Rejected
                                        </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text style={historyPageStyles.employee_name_text}>
                                                    Request ID - {item.entityID}
                                                </Text>
                                                <Text style={historyPageStyles.employee_name_text}>
                                                    has been rejected
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text style={historyPageStyles.employee_name_text}>
                                                    {(item.createdTime)}
                                                </Text>
                                                <Text style={historyPageStyles.employee_name_text}>
                                                    {item.createdDate}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={adminSuperVisorMapping.supervisor_comment_text}>
                                            Kindly refer to the approval{'\n'}details in History section.
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            :
                            item.notificationType === 'Clock-In/Clock-Out' ?
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log(userData[0].userRole)
                                        if (userData[0].userRole == 2) {
                                            navigation.navigate("SuperVisorHomeDrawer", {
                                                screen: "Attendance Approval",
                                                params: {
                                                    startDate: "",
                                                    endDate: "",
                                                    type: "",
                                                    email: ""
                                                }
                                            });
                                        }
                                    }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ padding: 10, backgroundColor: '#F9E9E8', width: '100%' }}>
                                            <Text style={historyPageStyles.noti_text}>
                                                Attendance Approval
                                            </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'column', width: '70%' }}>
                                                    <Text style={historyPageStyles.employee_name_text}>
                                                        {item.notificationDetails}
                                                        {'\n'}
                                                        {'\n'}
                                                        Kindly review & approve in the Attendance Approval section.
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text style={historyPageStyles.employee_name_text}>
                                                        {(item.createdTime)}
                                                    </Text>
                                                    <Text style={historyPageStyles.employee_name_text}>
                                                        {item.createdDate}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity> :
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log(userData[0].userRole)
                                        if (userData[0].userRole == 2) {
                                            navigation.navigate("SuperVisorHomeDrawer", {
                                                screen: "Attendance Approval",
                                                params: {
                                                    startDate: "",
                                                    endDate: "",
                                                    type: "",
                                                    email: ""
                                                }
                                            });
                                        }
                                    }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ padding: 10, backgroundColor: '#F9E9E8', width: '100%' }}>
                                            <Text style={historyPageStyles.noti_text}>
                                                Delegation
                                            </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'column', width: '70%' }}>
                                                    <Text style={historyPageStyles.employee_name_text}>
                                                        {item.notificationDetails}
                                                        {'\n'}
                                                        {'\n'}
                                                        Kindly review & approve as necessary in Attendance Approval section.
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text style={historyPageStyles.employee_name_text}>
                                                        {(item.createdTime)}
                                                    </Text>
                                                    <Text style={historyPageStyles.employee_name_text}>
                                                        {item.createdDate}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                    }
                </View>
            </View>
        </View >
    );

    // This function is to set the UI 
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={loginPageStyles.container}>
                <StatusBar barStyle="default"
                    backgroundColor="#FA0F0A" />
                <View style={{ flexDirection: 'column', flex: 1, marginTop: 15 }}>
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
                                Notification
                            </Text>
                        </View>
                    </TouchableNativeFeedback >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                        {
                            dataArray.length > 0 ?
                                <FlatList
                                    style={{ marginTop: 10, marginBottom: 30 }}
                                    showsVerticalScrollIndicator={false}
                                    data={dataArray}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderItem}
                                />
                                :
                                <Text style={{ fontFamily: 'OpenSans-Regular', alignSelf: 'center', fontSize: 12, color: '#000' }}>
                                    Notifications will appear here.
                                </Text>
                        }
                    </View>
                </View>
                <Modal isVisible={loading} style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <ActivityIndicator color={'#fff'} />
                </Modal>
            </View >
        </SafeAreaView>
    );
};

export default Notifications;