import NetInfo from "@react-native-community/netinfo";
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
    createDrawerNavigator
} from '@react-navigation/drawer';
import {
    NavigationContainer,
    useNavigation
} from '@react-navigation/native';
import {
    createStackNavigator
} from '@react-navigation/stack';
import {
    View
} from 'native-base';
import * as React from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Text
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { openDatabase } from 'react-native-sqlite-storage';
import { useDispatch } from 'react-redux';
import { clearLogin } from '../../actions/login_action';
import {
    deleteTableAllClockRequest,
    deleteTableAllRows
} from '../../database/local_database';
import notificationStore from '../../notification_redux/notificationStore';
import AdminActivityLog from '../screens/AdminActivityLog';
import AdminDashboard from '../screens/AdminDashboard';
import AdminDelegateDetails from '../screens/AdminDelegateDetails';
import AdminLogin from '../screens/AdminLogin';
import AdminManageType from '../screens/AdminManageType';
import AdminResetPasswordByEmpID from '../screens/AdminResetPasswordByEmpID';
import AdminSelectNewApprover from '../screens/AdminSelectNewApprover';
import AdminSupervisorMapping from '../screens/AdminSupervisorMapping';
import EmployeesChangePassword from '../screens/EmployeesChangePassword';
import EmployeesClockIn from '../screens/EmployeesClockIn';
import EmployeesClockOut from '../screens/EmployeesClockOut';
import EmployeesForgotPassword from '../screens/EmployeesForgotPassword';
import EmployeesHistory from '../screens/EmployeesHistory';
import EmployeesHistoryDetail from '../screens/EmployeesHistoryDetail';
import EmployeesHome from '../screens/EmployeesHome';
import EmployeesResetPassword from '../screens/EmployeesResetPassword';
import EmployeesSuccessMessage from '../screens/EmployeesSuccessMessage';
import EmployeesUploadDocuments from '../screens/EmployeesUploadDocuments';
import EmployeesVerifyOTP from '../screens/EmployeesVerifyOTP';
import Help from '../screens/Help';
import Login from '../screens/Login';
import Notifications from '../screens/Notifications';
import Splash from '../screens/Splash';
import SuperVisorApprovalHistory from '../screens/SuperVisorApprovalHistory';
import SuperVisorEmpRequestes from '../screens/SuperVisorEmpRequestes';
import SuperVisorHistory from '../screens/SuperVisorHistory';
import SuperVisorHistoryDetail from '../screens/SuperVisorHistoryDetail';
import SuperVisorHome from '../screens/SuperVisorHome';
import { BASE_URL } from './consts';
import {
    EmployeesUploadDocumentsPageStyles,
    loginPageStyles
} from './styles';
import DeviceInfo from 'react-native-device-info';
import NonBabasLogin from "../screens/NonBabasLogin";
import NonBabasDashboard from "../screens/NonBabasDashboard";
import Privacy from "../screens/Privacy";

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var db = openDatabase({ name: 'BABAS_DB.db' });

const CustomDrawerContent = (props) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [name, setName] = React.useState('');
    const [userId, setUserId] = React.useState('');
    const [isConnected, setConnected] = React.useState();
    const [email, setEmail] = React.useState('');

    AsyncStorage.getItem('loginUserEmail', (err, item) => {
        console.log('--notificationCount-- loginUserEmail: ' + item)
        setEmail(item)
        // setEmail(item)
    })

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternet = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                if (userId == '') {
                    AsyncStorage.setItem('loginUserEmail', '');
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                } else {
                    // This function is to get token to call the APIs
                    AsyncStorage.getItem('token', (err, item) => {
                        callLogoutAPI(item);
                    })
                }
            } else {
                // setLoading(false);
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

    // This function is to call logout API 
    callLogoutAPI = async (token) => {
        var number = parseInt(userId);
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID: number })
        };
        console.log('=======requestOptions====== ' + requestOptions.body)
        console.log('=======token====== ' + token)
        await fetch(BASE_URL + 'User/UserLogout',
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
                console.log('==== resp  onseCode==== ' + JSON.stringify(data));
                let json = data;
                if (json.responseCode == 200) {
                    console.log('--json.data.attendaceHistories--' + json.data.attendaceHistories)
                    AsyncStorage.setItem('lastAction', '');
                    AsyncStorage.setItem('token', '');
                    notificationStore.dispatch({
                        type: "COUNT_CHANGE",
                        payload: { count: '0' }
                    });
                    dispatch(clearLogin());
                    deleteTableAllRows(db);
                    deleteTableAllClockRequest(db);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                } else {
                    Alert.alert(
                        "Alert!",
                        data.data.status,
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

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternetForDeactivateAccount = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                // This function is to get token to call the APIs
                AsyncStorage.getItem('token', (err, item) => {
                    callDeactivateAccountAPI(item);
                })
            } else {
                // setLoading(false);
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

    // This function is to call Account deactivation API 
    callDeactivateAccountAPI = async (token) => {
        var userType = ''
        var number = 0
        if (email == '' || email == null) {
            setEmail('')
            number = parseInt(userId);
            userType = 'BabasUser'
        } else {
            userType = 'Non-BabasUser'
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserId: number, Email: email, UserType: userType })
        };
        console.log('=======requestOptions====== ' + requestOptions.body)
        console.log('=======token====== ' + token)
        await fetch(BASE_URL + 'User/UserDeactivate',
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
                console.log('==== resp  onseCode==== ' + JSON.stringify(data));
                let json = data;
                if (json.responseCode == 200) {
                    var message = ''
                    if (userType == 'BabasUser') {
                        message = 'The account has been deleted.'
                    } else {
                        AsyncStorage.setItem('loginUserEmail', '');
                        message = 'The account has been deleted.'
                    }
                    Alert.alert(
                        "Alert!",
                        message,
                        [
                            {
                                text: "Ok",
                                onPress: () => {
                                    console.log('--json.data.attendaceHistories--' + json.data.attendaceHistories)
                                    AsyncStorage.setItem('lastAction', '');
                                    AsyncStorage.setItem('token', '');
                                    notificationStore.dispatch({
                                        type: "COUNT_CHANGE",
                                        payload: { count: '0' }
                                    });
                                    dispatch(clearLogin());
                                    deleteTableAllRows(db);
                                    deleteTableAllClockRequest(db);
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                    });
                                }
                            }
                        ]
                    )
                } else {
                    Alert.alert(
                        "Alert!",
                        data.data.status,
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

    React.useEffect(() => {
        // This function to get userId and userName from local DB
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user',
                [],
                (tx, results) => {
                    console.log('ssssss' + results.rows.item(0).email);
                    setName(results.rows.item(0).firstName);
                    setUserId(results.rows.item(0).userId);
                }
            );
        });
    }, [])

    // This function is to set Drawer UI 
    return (
        <DrawerContentScrollView {...props}
            contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ justifyContent: 'flex-start' }}>
                <DrawerItemList {...props} />
                <DrawerItem
                    label={() =>
                        <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 16, marginLeft: -16 }}>
                            Sign Out
                        </Text>
                    }
                    icon={() =>
                        <Image
                            style={loginPageStyles.svg_icons}
                            source={require('../assets/images/signout.png')}
                        />
                    }
                    onPress={() => {
                        db.transaction((tx) => {
                            tx.executeSql(
                                'SELECT * FROM CLOCK_DATA',
                                [],
                                (tx, results) => {
                                    var temp = [];
                                    for (let i = 0; i < results.rows.length; ++i) {
                                        temp.push(results.rows.item(i));
                                        console.log('======results.rows.item(i).id====' + results.rows.item(i).id)
                                    }
                                    console.log('======temp' + temp.length)

                                    var message = '';
                                    if (temp.length > 0) {
                                        message = 'Please do not Sign Out when found any offline request pending for submission. Your request details will disappear after Sign Out.'
                                    } else {
                                        message = 'Are you sure you want to Sign Out?'
                                    }

                                    Alert.alert(
                                        "Alert!",
                                        message,
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            {
                                                text: "Sign Out",
                                                onPress: () => {
                                                    checkInternet();
                                                }
                                            }
                                        ]
                                    )
                                });
                        });
                    }}
                />
                {/* <View style={{ marginLeft: 20, marginRight: 30 }}>
                    <Text style={{ color: '#ffffff' }} ellipsizeMode="clip" numberOfLines={1}>
                        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                        - - - - - - - - - - - - - - - - -
                    </Text>
                </View> */}
                <DrawerItem
                    label={() =>
                        <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 16, marginLeft: -16 }}>
                            Delete Account
                        </Text>
                    }
                    icon={() =>
                        <Image
                            style={loginPageStyles.svg_icons}
                            source={require('../assets/images/bin.png')}
                        />
                    }
                    onPress={() => {
                        Alert.alert(
                            "Alert!",
                            'Are you sure you want to delete your account?',
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                {
                                    text: "Delete",
                                    onPress: () => {
                                        checkInternetForDeactivateAccount();
                                    }
                                }
                            ]
                        )
                    }}
                />
            </View>
            <View style={{ marginBottom: 40, marginLeft: 20, flexDirection: 'column' }}>
                {
                    email == '' || email == null ? <Text style={{ fontFamily: 'OpenSans-Semibold', bottom: 0, width: '100%', color: 'white', fontSize: 18, }}>
                        {userId}
                    </Text> :
                        <Text style={{ fontFamily: 'OpenSans-Semibold', bottom: 0, width: '100%', color: 'white', fontSize: 18, }}>
                            {email}
                        </Text>
                }
                <Text style={{ fontFamily: 'OpenSans-Semibold', bottom: 0, width: '100%', color: 'white', fontSize: 18, marginTop: 4 }}>
                    {name}
                </Text>
                <Text style={{ fontFamily: 'OpenSans-Regular', bottom: 0, width: '100%', color: '#f0f0f0', fontSize: 14, marginTop: 6 }}>
                    App version: {DeviceInfo.getVersion()}
                </Text>
            </View>
        </DrawerContentScrollView>
    );
}

// This function is to manage Employee Drawer 
const EmployeesHomeDrawer = () => {
    const Drawer = createDrawerNavigator();
    const navigation = useNavigation();
    const [notificationCount, setNotificationCount] = React.useState();

    notificationStore.subscribe(() => {
        setNotificationCount(notificationStore.getState().count);
        console.log('--store.getState()-- ' + notificationStore.getState().count)
    })

    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} initialRouteName="EmployeesHome" screenOptions={{
            drawerType: 'front',
            drawerStyle: {
                backgroundColor: '#FA0F0A99',
                width: width * .8,
                height: height
            },
            drawerLabelStyle: {
                color: 'white',
                fontSize: 16,
                marginLeft: -18
            },
            drawerContentStyle: {
                marginTop: 56
            },
            drawerIcon: () => (
                <Image
                    style={[loginPageStyles.svg_icons, { tintColor: 'white' }]}
                />
            ),
            headerTitleAlign: 'left',
        }}>
            <Drawer.Screen name="Home" component={EmployeesHome} options={{
                unmountOnBlur: true,
                title: 'Home', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16,
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/ic_home.png')}
                    />
                ),
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Notifications') }}
                        style={{ flexDirection: 'row', marginRight: 10, paddingTop: 10 }}>
                        <Image
                            style={loginPageStyles.svg_bell_icons}
                            source={require('../assets/images/notification.png')}
                        />
                        <View style={EmployeesUploadDocumentsPageStyles.circle_badge}>
                            <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 10 }}>
                                {notificationCount}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ),
            }} />
            <Drawer.Screen name="History" component={EmployeesHistory} options={{
                unmountOnBlur: true,
                title: 'History', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/ic_document.png')}
                    />
                ),
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Notifications') }}
                        style={{ flexDirection: 'row', marginRight: 10, paddingTop: 10 }}>
                        <Image
                            style={loginPageStyles.svg_bell_icons}
                            source={require('../assets/images/notification.png')}
                        />
                        <View style={EmployeesUploadDocumentsPageStyles.circle_badge}>
                            <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 10 }}>
                                {notificationCount}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ),
            }} />
            <Drawer.Screen name="Change Password" component={EmployeesChangePassword} options={{
                unmountOnBlur: true,
                title: 'Change Password', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/ic_password.png')}
                    />
                ),
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Notifications') }}
                        style={{ flexDirection: 'row', marginRight: 10, paddingTop: 10 }}>
                        <Image
                            style={loginPageStyles.svg_bell_icons}
                            source={require('../assets/images/notification.png')}
                        />
                        <View style={EmployeesUploadDocumentsPageStyles.circle_badge}>
                            <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 10 }}>
                                {notificationCount}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ),
            }} />
            <Drawer.Screen name="Help" component={Help} options={{
                unmountOnBlur: true,
                title: 'Help', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/help.png')}
                    />
                ),
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Notifications') }}
                        style={{ flexDirection: 'row', marginRight: 10, paddingTop: 10 }}>
                        <Image
                            style={loginPageStyles.svg_bell_icons}
                            source={require('../assets/images/notification.png')}
                        />
                        <View style={EmployeesUploadDocumentsPageStyles.circle_badge}>
                            <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 10 }}>
                                {notificationCount}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ),
            }} />
        </Drawer.Navigator>
    );
};

// This function is to manage Supervisor Drawer 
const SuperVisorHomeDrawer = () => {
    const Drawer = createDrawerNavigator();
    const navigation = useNavigation();
    const [notificationCount, setNotificationCount] = React.useState();

    notificationStore.subscribe(() => {
        setNotificationCount(notificationStore.getState().count);
        console.log('--store.getState()-- ' + notificationStore.getState().count)
    })

    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} initialRouteName="SuperVisorHome" screenOptions={{
            drawerType: 'front',
            drawerStyle: {
                backgroundColor: '#FA0F0A99',
                width: width * .8,
                height: height
            },
            drawerLabelStyle: {
                color: 'white',
                fontSize: 16,
                marginLeft: -18
            },
            drawerContentStyle: {
                marginTop: 56
            },
            drawerIcon: () => (
                <Image
                    style={[loginPageStyles.svg_icons, { tintColor: 'white' }]}
                />
            ),
            headerTitleAlign: 'left'
        }}>
            <Drawer.Screen name="Home" component={SuperVisorHome} options={{
                unmountOnBlur: true,
                title: 'Home', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/ic_home.png')}
                    />
                ),
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Notifications') }}
                        style={{ flexDirection: 'row', marginRight: 10, paddingTop: 10 }}>
                        <Image
                            style={loginPageStyles.svg_bell_icons}
                            source={require('../assets/images/notification.png')}
                        />
                        <View style={EmployeesUploadDocumentsPageStyles.circle_badge}>
                            <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 10 }}>
                                {notificationCount}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ),
            }} />
            <Drawer.Screen name="History" component={SuperVisorHistory} options={{
                unmountOnBlur: true,
                title: 'History', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/ic_document.png')}
                    />
                ),
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Notifications') }}
                        style={{ flexDirection: 'row', marginRight: 10, paddingTop: 10 }}>
                        <Image
                            style={loginPageStyles.svg_bell_icons}
                            source={require('../assets/images/notification.png')}
                        />
                        <View style={EmployeesUploadDocumentsPageStyles.circle_badge}>
                            <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 10 }}>
                                {notificationCount}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ),
            }} />
            <Drawer.Screen name="Approval History" component={SuperVisorApprovalHistory} options={{
                unmountOnBlur: true,
                title: 'Approval History', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/ic_document.png')}
                    />
                ),
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Notifications') }}
                        style={{ flexDirection: 'row', marginRight: 10, paddingTop: 10 }}>
                        <Image
                            style={loginPageStyles.svg_bell_icons}
                            source={require('../assets/images/notification.png')}
                        />
                        <View style={EmployeesUploadDocumentsPageStyles.circle_badge}>
                            <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 10 }}>
                                {notificationCount}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ),
            }} />
            <Drawer.Screen name="Attendance Approval" initialParams={{
                startDate: "",
                endDate: "",
                type: "",
                empID: "",
                name: ""
            }} component={SuperVisorEmpRequestes} options={{
                unmountOnBlur: true,
                title: 'Attendance Approval',
                headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16,
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/ic_document.png')}
                    />
                ),
                headerRight: () =>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => { navigation.navigate('Notifications') }}
                            style={{ flexDirection: 'row', marginRight: 10, paddingTop: 10 }}>
                            <Image
                                style={loginPageStyles.svg_bell_icons}
                                source={require('../assets/images/notification.png')}
                            />
                            <View style={EmployeesUploadDocumentsPageStyles.circle_badge}>
                                <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 10 }}>
                                    {notificationCount}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
            }} />
            <Drawer.Screen name="Change Password" component={EmployeesChangePassword} options={{
                unmountOnBlur: true,
                title: 'Change Password', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/ic_password.png')}
                    />
                ),
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Notifications') }}
                        style={{ flexDirection: 'row', marginRight: 10, paddingTop: 10 }}>
                        <Image
                            style={loginPageStyles.svg_bell_icons}
                            source={require('../assets/images/notification.png')}
                        />
                        <View style={EmployeesUploadDocumentsPageStyles.circle_badge}>
                            <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 10 }}>
                                {notificationCount}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ),
            }} />
            <Drawer.Screen name="Help" component={Help} options={{
                unmountOnBlur: true,
                title: 'Help', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/help.png')}
                    />
                ),
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Notifications') }}
                        style={{ flexDirection: 'row', marginRight: 10, paddingTop: 10 }}>
                        <Image
                            style={loginPageStyles.svg_bell_icons}
                            source={require('../assets/images/notification.png')}
                        />
                        <View style={EmployeesUploadDocumentsPageStyles.circle_badge}>
                            <Text style={{ fontFamily: 'OpenSans-Regular', color: 'white', fontSize: 10 }}>
                                {notificationCount}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ),
            }} />
        </Drawer.Navigator>
    );
};

// This function is to manage Admin Drawer 
const AdminHomeDrawer = () => {
    const Drawer = createDrawerNavigator();

    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} initialRouteName="AdminDashboard" screenOptions={{
            drawerType: 'front',
            drawerStyle: {
                backgroundColor: '#FA0F0A99',
                width: width * .8,
            },
            drawerLabelStyle: {
                color: 'white',
                fontSize: 16,
                marginLeft: -18
            },
            drawerContentStyle: {
                marginTop: 56
            },
            drawerIcon: () => (
                <Image
                    style={[loginPageStyles.svg_icons, { tintColor: 'white' }]}
                />
            ),
            headerTitleAlign: 'left'
        }}>
            <Drawer.Screen name="AdminDashboard" component={AdminDashboard} options={{
                unmountOnBlur: true,
                title: 'Home', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/ic_home.png')}
                    />
                ),
            }} />
            <Drawer.Screen name="AdminResetPasswordByEmpID" component={AdminResetPasswordByEmpID} options={{
                unmountOnBlur: true,
                title: 'Reset Password', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/ic_password.png')}
                    />
                ),
            }} />
            <Drawer.Screen name="AdminSupervisorMapping" component={AdminSupervisorMapping} options={{
                unmountOnBlur: true,
                title: 'Supervisor Delegation', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/ic_document.png')}
                    />
                ),
            }} />
            <Drawer.Screen name="AdminManageType" component={AdminManageType} options={{
                unmountOnBlur: true,
                title: 'Attendance Type', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/type.png')}
                    />
                ),
            }} />
            <Drawer.Screen name="Change Password" component={EmployeesChangePassword} options={{
                unmountOnBlur: true,
                title: 'Change Password', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/ic_password.png')}
                    />
                ),
            }} />
            <Drawer.Screen name="AdminActivityLog" component={AdminActivityLog} options={{
                unmountOnBlur: true,
                title: 'Activity Log', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/ic_document.png')}
                    />
                ),
            }} />
            <Drawer.Screen name="Help" component={Help} options={{
                unmountOnBlur: true,
                title: 'Help', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/help.png')}
                    />
                ),
            }} />
        </Drawer.Navigator>
    );
};

// This function is to manage NonBabas Drawer 
const NonBabasHomeDrawer = () => {
    const Drawer = createDrawerNavigator();

    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} initialRouteName="AdminDashboard" screenOptions={{
            drawerType: 'front',
            drawerStyle: {
                backgroundColor: '#FA0F0A99',
                width: width * .8,
            },
            drawerLabelStyle: {
                color: 'white',
                fontSize: 16,
                marginLeft: -18
            },
            drawerContentStyle: {
                marginTop: 56
            },
            drawerIcon: () => (
                <Image
                    style={[loginPageStyles.svg_icons, { tintColor: 'white' }]}
                />
            ),
            headerTitleAlign: 'left'
        }}>
            <Drawer.Screen name="NonBabasDashboard" component={NonBabasDashboard} options={{
                unmountOnBlur: true,
                title: 'Home', headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                }, headerTitleStyle: {
                    color: 'white',
                    fontSize: 16
                }, headerTintColor: 'white',
                drawerIcon: ({ focused, size }) => (
                    <Image
                        style={loginPageStyles.svg_icons}
                        source={require('../assets/images/ic_home.png')}
                    />
                ),
            }} />
        </Drawer.Navigator>
    );
};

// This function is to manage screen redirection stack 
const MyStack = () => {
    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName={"Splash"}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="AdminLogin" component={AdminLogin} />
                <Stack.Screen name="NonBabasLogin" component={NonBabasLogin} />
                <Stack.Screen name="Privacy" component={Privacy} />

                {/* Employees Screens */}
                <Stack.Screen name="EmployeesForgotPassword" component={EmployeesForgotPassword} />
                <Stack.Screen name="EmployeesVerifyOTP" component={EmployeesVerifyOTP} />
                <Stack.Screen name="EmployeesResetPassword" component={EmployeesResetPassword} />
                <Stack.Screen name="EmployeesClockIn" component={EmployeesClockIn} />
                <Stack.Screen name="EmployeesClockOut" component={EmployeesClockOut} />
                <Stack.Screen name="EmployeesUploadDocuments" component={EmployeesUploadDocuments} />
                <Stack.Screen name="EmployeesSuccessMessage" component={EmployeesSuccessMessage} />
                <Stack.Screen name="EmployeesHistoryDetail" component={EmployeesHistoryDetail} />
                <Stack.Screen name="Notifications" component={Notifications} />

                {/* Super Visor Screens */}
                <Stack.Screen name="SuperVisorHistory" component={SuperVisorHistory} />
                <Stack.Screen name="SuperVisorApprovalHistory" component={SuperVisorApprovalHistory} />
                <Stack.Screen name="SuperVisorHistoryDetail" component={SuperVisorHistoryDetail} />

                {/* Admin Screens */}
                <Stack.Screen name="AdminSelectNewApprover" component={AdminSelectNewApprover} />
                <Stack.Screen name="AdminDelegateDetails" component={AdminDelegateDetails} />

                {/* Navigation Drawer Screens*/}
                <Stack.Screen name="EmployeesHomeDrawer" component={EmployeesHomeDrawer} />
                <Stack.Screen name="SuperVisorHomeDrawer" component={SuperVisorHomeDrawer} />
                <Stack.Screen name="AdminHomeDrawer" component={AdminHomeDrawer} />
                <Stack.Screen name="NonBabasHomeDrawer" component={NonBabasHomeDrawer} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MyStack;