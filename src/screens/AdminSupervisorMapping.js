import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList, Image, StatusBar, Text, TouchableOpacity, View, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { adminSuperVisorMapping, EmployeesUploadDocumentsPageStyles, historyPageStyles, loginPageStyles } from '../utils/styles';
import NetInfo from "@react-native-community/netinfo";
import { BASE_URL } from '../utils/consts';
import Modal from "react-native-modal";

const AdminSupervisorMapping = ({ navigation }) => {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [isConnected, setConnected] = useState();
    const [dataArray, setDataArray] = useState([])
    const [dataArray_1, setDataArray_1] = useState([])

    useEffect(() => {
        // This function is to get token to call the APIs
        AsyncStorage.getItem('token', (err, item) => {
            setToken(item);
        })
        setLoading(true)
        setTimeout(() => {
            checkInternet();
        }, 1000);
    }, [])

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternet = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                getSuperVisors();
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

    // This function is to get All supervisors from server
    getSuperVisors = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ empID: 0, empName: "" })
        };
        console.log('=======requestOptions====== ' + requestOptions.body)
        console.log('=======token====== ' + token)
        await fetch(BASE_URL + 'Admin/GetSupervisorList',
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
                    console.log('==== resp ====' + json.data)
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
        <View>
            <View style={historyPageStyles.list_main_container}>
                <View style={adminSuperVisorMapping.list_second_container}>
                    <View style={{ padding: 5 }}>
                        <Text
                            numberOfLines={1}
                            style={adminSuperVisorMapping.title_text}>
                            {item.supervisorName}
                        </Text>
                        <Text style={historyPageStyles.employee_name_text}>
                            {item.supervisorID}
                        </Text>
                        <Text style={historyPageStyles.employee_name_text}>
                            {item.email}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={adminSuperVisorMapping.employee_name_temp}>
                            {item.designation}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ backgroundColor: 'white', width: 2, height: 120, }} />
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('AdminSelectNewApprover', {
                                    supervisorID: item.supervisorID,
                                    dataArray: dataArray
                                })
                            }}>
                            <View style={{ flexDirection: 'column', alignItems: 'center', width: 80, justifyContent: 'center', backgroundColor: '#E63627', height: 120 }}>
                                <Text style={adminSuperVisorMapping.assign_to_text}>
                                    Assign To
                                </Text>
                                <View
                                    style={historyPageStyles.circle_1}>
                                    <Image
                                        style={adminSuperVisorMapping.bottom_btns}
                                        source={require('../assets/images/back.png')}
                                    />
                                </View>
                            </View>
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
                    <Text style={{ fontFamily: 'OpenSans-Semibold', color: 'white', fontSize: 24, }}>
                        Supervisor Name
                    </Text>
                </View>
                <View style={adminSuperVisorMapping.edit_bg}>
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/search.png')}
                    />
                    <TextInput
                        style={loginPageStyles.input}
                        keyboardType="default"
                        placeholder="Search By Name or User ID"
                        placeholderTextColor="#e0e0e0"
                        onChangeText={(value) => {
                            setDataArray_1(dataArray.filter(function (el) {
                                if (isNaN(value)) {
                                    console.log('==is value number== ' + value)
                                    return el.supervisorName.toLowerCase().includes(value.toLowerCase());
                                } else {
                                    console.log('==is value string== ' + value)
                                    return el.supervisorID == value;
                                }
                            }))
                        }}
                    />
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                    {
                        dataArray_1.length > 0 ?
                            <FlatList
                                style={{ marginTop: 10, marginBottom: 30, width: '100%' }}
                                showsVerticalScrollIndicator={false}
                                data={dataArray_1}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderItem} />
                            :
                            dataArray.length > 0 ?
                                <FlatList
                                    style={{ marginTop: 10, marginBottom: 30, width: '100%' }}
                                    showsVerticalScrollIndicator={false}
                                    data={dataArray}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderItem} />
                                :
                                <Text style={{ fontFamily: 'OpenSans-Regular', alignSelf: 'center', fontSize: 12, color: '#000' }}>
                                    Supervisors will appear here.
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

export default AdminSupervisorMapping;