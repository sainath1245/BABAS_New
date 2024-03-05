import React, { useEffect, useState } from 'react';
import {
    Image, StatusBar, Text, TouchableNativeFeedback, TouchableOpacity, View, BackHandler
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clockInPageStyles, employeesForgotPasswordPageStyles, employeesSuccessMessagePageStyles, EmployeesUploadDocumentsPageStyles, loginPageStyles } from '../utils/styles';
import { openDatabase } from 'react-native-sqlite-storage';
import notificationStore from '../../notification_redux/notificationStore';

var db = openDatabase({ name: 'BABAS_DB.db' });

const EmployeesSuccessMessage = ({ route, navigation }) => {
    const [userData, setUserData] = useState([]);
    const { requestID } = route.params;
    console.log('requestID ::::: ::::: :::: :::: ::: : ' + requestID)
    var notificationCount = notificationStore.getState().count;
    useEffect(() => {
        // This functio to get userdata from local DB
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user',
                [],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    setUserData(temp);
                }
            );
        });

        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, []);

    // This function is to handel back press so user can not go back to previous screen 
    function handleBackButtonClick() {
        navigation.goBack();
        return true;
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
                        style={employeesForgotPasswordPageStyles.back_btn_layout}>
                        <View style={employeesSuccessMessagePageStyles.back_view}>
                            <Text style={clockInPageStyles.back_text}>
                                Submission
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
                            <View style={employeesSuccessMessagePageStyles.btn_container}>
                                <View style={employeesSuccessMessagePageStyles.container}>
                                    {
                                        requestID === 0 ?
                                            <Text></Text>
                                            :
                                            <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 20 }}>
                                                Success!
                                            </Text>
                                    }
                                    {
                                        requestID === 0 ?
                                            <Text style={{ fontSize: 18, color: 'black', marginTop: 10, fontFamily: 'OpenSans-SemiBold', }}>
                                                Not Submitted
                                            </Text> :
                                            <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 16, color: 'gray', marginTop: 10 }}>
                                                Request ID - {requestID}
                                            </Text>
                                    }
                                    {
                                        requestID === 0 ?
                                            <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 16, color: 'gray', alignContent: 'center', marginTop: 4, marginLeft: 10, marginRight: 10 }}>
                                                (Offline) Your request is currently saved in local device temporarily. Please do not Sign Out until you submit your request when internet connection is available.
                                            </Text> :
                                            <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 16, color: 'gray', alignContent: 'center' }}>
                                                has been submitted.
                                            </Text>
                                    }
                                </View>
                                <View
                                    style={employeesSuccessMessagePageStyles.circle}>
                                    <Image
                                        style={employeesSuccessMessagePageStyles.hand_btn}
                                        source={require('../assets/images/ic_hand.png')}
                                    />
                                </View>
                                <View style={employeesSuccessMessagePageStyles.bottom_view}>
                                    <View style={{ alignItems: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (userData[0].userRole == 3) {
                                                    navigation.reset({
                                                        index: 0,
                                                        routes: [{
                                                            name: 'EmployeesHomeDrawer',
                                                            screen: "Home"
                                                        }],
                                                    });
                                                } else if (userData[0].userRole == 2) {
                                                    navigation.reset({
                                                        index: 0,
                                                        routes: [{
                                                            name: 'SuperVisorHomeDrawer',
                                                            screen: "Home"
                                                        }],
                                                    });
                                                } else if (userData[0].userRole == 1) {
                                                    navigation.reset({
                                                        index: 0,
                                                        routes: [{
                                                            name: 'AdminHomeDrawer',
                                                            screen: "AdminDashboard"
                                                        }],
                                                    });
                                                }
                                            }}
                                            style={employeesSuccessMessagePageStyles.circle_1}>
                                            <Image
                                                style={employeesSuccessMessagePageStyles.bottom_btns}
                                                source={require('../assets/images/ic_home.png')}
                                            />
                                        </TouchableOpacity>
                                        <Text style={{ fontFamily: 'OpenSans-Regular', marginTop: 10, fontSize: 16, color: 'gray' }}>
                                            Home
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (userData[0].userRole == 3) {
                                                    navigation.navigate("EmployeesHomeDrawer", {
                                                        ndex: 0,
                                                        screen: "History"
                                                    });
                                                } else if (userData[0].userRole == 2) {
                                                    navigation.navigate("SuperVisorHomeDrawer", {
                                                        index: 0,
                                                        screen: "History"
                                                    });
                                                }
                                            }}
                                            style={employeesSuccessMessagePageStyles.circle_1}>
                                            <Image
                                                style={employeesSuccessMessagePageStyles.bottom_btns}
                                                source={require('../assets/images/ic_document.png')}
                                            />
                                        </TouchableOpacity>
                                        <Text style={{ fontFamily: 'OpenSans-Regular', marginTop: 10, fontSize: 16, color: 'gray' }}>
                                            History
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

export default EmployeesSuccessMessage;