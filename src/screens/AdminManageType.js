import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList, Image, StatusBar, Text, TouchableOpacity, View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { adminSuperVisorMapping, alertStyles, clockInPageStyles, employeesForgotPasswordPageStyles, EmployeesUploadDocumentsPageStyles, historyPageStyles, loginPageStyles, superVisorEmployeeRequestStyles } from '../utils/styles';
import Modal from "react-native-modal";
import NetInfo from "@react-native-community/netinfo";
import { BASE_URL } from '../utils/consts';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'BABAS_DB.db' });

const AdminManageType = ({ navigation }) => {
    const [item_height, setItemHeight] = useState(0);
    const [isAddPopupVisible, setAddPopupVisible] = useState(false);
    const [type, setType] = useState('');
    const [token, setToken] = useState('');
    const [dataArray, setDataArray] = useState([]);
    const [isConnected, setConnected] = useState();
    const [loading, setLoading] = useState(true);

    const [newArray, setNewArray] = useState(dataArray);
    const [userId, setUserId] = useState('');

    useEffect(() => {
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
        setTimeout(() => {
            checkInternet();
        }, 1000);
    }, [])

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternet = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                setLoading(true);
                getWorkType();
            } else {
                console.log('no internet')
            }
            setConnected(state.isConnected);
        });
        return (isConnected);
    }

    // This function is to get attendance type from server
    getWorkType = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        };
        await fetch(BASE_URL + 'Admin/GetWorkType',
            requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong :: ' + response.status);
                }
            })
            .then((data) => {
                console.log('==== resp  onseCode==== ' + data.responseCode);
                let json = data;
                console.log('==== resp  onseCode==== ' + json.responseCode);
                if (json.responseCode == 200) {
                    console.log('resposne ========= ===== ==== ' + JSON.stringify(json.data))
                    setDataArray(json.data);
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

    // This function is to add new attendace type
    addWorkType = async (workName) => {
        var number = parseInt(userId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminID: number, workName: workName })
        };
        await fetch(BASE_URL + 'Admin/AddWorkType',
            requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong :: ' + response.status);
                }
            })
            .then((data) => {
                console.log('==== resp  onseCode==== ' + data.responseCode);
                let json = data;
                console.log('==== resp  onseCode==== ' + json.responseCode);
                if (json.responseCode == 200) {
                    getWorkType()
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
                // setLoading(false);
            });
    }

    // This function is to delete attendace type and also delete all attendace type
    deleteWorkType = async (workID) => {
        var number = parseInt(userId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ empID: number, workID: workID })
        };
        console.log("Deleete ::::: " + JSON.stringify(requestOptions.body))
        await fetch(BASE_URL + 'Attendance/DeleteAttendanceType',
            requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong :: ' + response.status);
                }
            })
            .then((data) => {
                console.log('==== resp  onseCode==== ' + data.responseCode);
                let json = data;
                console.log('==== resp  onseCode==== ' + JSON.stringify(json));
                if (json.responseCode == 200) {
                    getWorkType()
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
                // setLoading(false);
            });
    }

    // This function is to get dynamic height of UI component
    const onLayout = (event) => {
        const { x, y, height, width } = event.nativeEvent.layout;
        setItemHeight(height);
    }

    // This function is to set FlatList UI
    const renderItem = ({ item, index }) => (
        <View>
            <View style={historyPageStyles.list_main_container}>
                <View style={adminSuperVisorMapping.list_second_container}>
                    <View stye onLayout={onLayout} style={{ padding: 10, flexDirection: 'row' }}>
                        <Text style={adminSuperVisorMapping.type_text_1}>
                            {index+1}.  {item.workName}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                Alert.alert(
                                    "Alert!",
                                    'Are you sure you want to delete \n' + item.workName + '?',
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel Pressed"),
                                        },
                                        {
                                            text: "Delete",
                                            onPress: () => {
                                                deleteWorkType(item.workId)
                                            }
                                        }
                                    ]
                                )
                            }}>
                            <Image
                                style={loginPageStyles.svg_icon_delete}
                                source={require('../assets/images/bin.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
                <View style={adminSuperVisorMapping.top_image_layer}>
                    <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 24, fontWeight: '400' }}>
                        {/* Clock-In Type */}
                    </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                    {
                        dataArray.length > 0 ? <FlatList
                            style={{ marginTop: 10, marginBottom: 30, width: '100%' }}
                            showsVerticalScrollIndicator={false}
                            data={dataArray}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                        />
                            :
                            <Text style={{ fontFamily: 'OpenSans-Regular', alignSelf: 'center', fontSize: 12, color: '#000' }}>
                                Attendance type will appear here.
                            </Text>
                    }
                </View>
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                "Alert!",
                                'Are you sure you want to Delete All?',
                                [
                                    {
                                        text: "Cancel",
                                        onPress: () => console.log("Cancel Pressed"),
                                    },
                                    {
                                        text: "Delete All",
                                        onPress: () => {
                                            deleteWorkType(0)
                                        }
                                    }
                                ]
                            )
                        }}
                        style={employeesForgotPasswordPageStyles.add_more_btn}>
                        <Text style={loginPageStyles.btn_text}>
                            Delete All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setType('');
                            setAddPopupVisible(true);
                        }}
                        style={employeesForgotPasswordPageStyles.add_more_btn}>
                        <Text style={loginPageStyles.btn_text}>
                            Add More
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal isVisible={isAddPopupVisible}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                useNativeDriver={true}>
                <View style={alertStyles.alertBg}>
                    <Text style={{ fontFamily: 'OpenSans-Regular', width: '90%', marginTop: 10, fontSize: 14, color: 'black' }}>
                        Add new Attendance type
                    </Text>
                    <View style={loginPageStyles.edit_type_bg}>
                        <TextInput
                            style={loginPageStyles.input}
                            keyboardType="default"
                            placeholder="Type"
                            placeholderTextColor="#e0e0e0"
                            onChangeText={(value) => setType(value)}
                        />
                    </View>
                    <View style={alertStyles.alertButtonsLayout}>
                        <TouchableOpacity
                            onPress={() =>
                                setAddPopupVisible(false)
                            }
                            style={superVisorEmployeeRequestStyles.button_cancel}>
                            <Text style={superVisorEmployeeRequestStyles.text_reject}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                console.log('ype.length ::' + type.length);
                                if (type.length !== 0) {
                                    setAddPopupVisible(false);
                                    addWorkType(type);
                                    setType('');
                                } else {
                                    Alert.alert(
                                        "Alert!",
                                        "Attendance type should not be empty.",
                                    )
                                }
                            }}
                            style={superVisorEmployeeRequestStyles.button_submit}>
                            <Text style={superVisorEmployeeRequestStyles.text_reject}>
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal isVisible={loading} style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <ActivityIndicator color={'#fff'} />
            </Modal>
        </View >
    );
};

export default AdminManageType;