import React, { useState } from 'react';
import {
    FlatList, Image, StatusBar, Text, TouchableNativeFeedback, TouchableOpacity, View
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import { EmployeesUploadDocumentsPageStyles, adminSuperVisorMapping, clockInPageStyles, employeesForgotPasswordPageStyles, historyPageStyles, loginPageStyles } from '../utils/styles';

const AdminSelectNewApprover = ({ route, navigation }) => {
    const [dataArray_1, setDataArray_1] = useState([])
    const { supervisorID, dataArray } = route.params;

    // This function is to set the UI for FlatList
    const renderItem = ({ item }) => (
        <View style={{ flex: 1 }}>
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
                                navigation.navigate('AdminDelegateDetails', {
                                    supervisorID: supervisorID,
                                    newApproverId: item.supervisorID
                                })
                            }}>
                            <View style={{ flexDirection: 'column', alignItems: 'center', width: 80, justifyContent: 'center', backgroundColor: '#E63627', height: 120 }}>
                                <Text style={adminSuperVisorMapping.assign_to_text}>
                                    Select
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
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
                    <View style={adminSuperVisorMapping.top_image_layer}>
                        <Text style={{ fontFamily: 'OpenSans-Semibold', color: 'white', fontSize: 24 }}>
                            New Approver Name
                        </Text>
                    </View>
                    <TouchableNativeFeedback
                        onPress={() => { navigation.goBack(null) }}
                        style={employeesForgotPasswordPageStyles.back_btn_layout}>
                        <View style={clockInPageStyles.back_view}>
                            <Image
                                style={clockInPageStyles.back_btn}
                                source={require('../assets/images/ic_back.png')}
                            />
                            <Text style={clockInPageStyles.back_text}>
                                Select New Approver Name
                            </Text>
                        </View>
                    </TouchableNativeFeedback >
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
                                : dataArray.length > 0 ?
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
            </View >
        </SafeAreaView>
    );
};

export default AdminSelectNewApprover;