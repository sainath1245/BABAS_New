import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import NetInfo from "@react-native-community/netinfo";
import messaging from '@react-native-firebase/messaging';
import React, {
    useEffect,
    useState
} from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Linking,
    Platform,
    StatusBar,
    Text,
    TextInput,
    TouchableNativeFeedback,
    View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openDatabase } from 'react-native-sqlite-storage';
import { deleteTableAllRows, insertUser_1 } from '../../database/local_database';
import { BASE_URL } from '../utils/consts';
import { clockInPageStyles, employeesForgotPasswordPageStyles, loginPageStyles } from '../utils/styles';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var db = openDatabase({ name: 'BABAS_DB.db' });

const NonBabasLogin = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isConnected, setConnected] = useState();
    const [isButtonSelected, setButtonSelected] = useState('Registration');
    const [hidePass, setHidePass] = useState(true);

    useEffect(() => {
        // This function is to get token to call the APIs
        AsyncStorage.getItem('email', (err, item) => {
            console.log('--notificationCount-- nav: ' + item)
            // setEmail(item)
        })
    }, [])

    // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
    const checkInternet = () => {
        NetInfo.fetch().then(state => {
            console.log('no internet === ' + state.isConnected)
            if (state.isConnected) {
                setLoading(true)
                callLoginAPI();
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

    // Thia function is to call Login API
    callLoginAPI = async () => {
        var requestOptions = '';
        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email: email, Password: password, Type: isButtonSelected })
        };
        console.log('=========requestOptions.body ===========' + requestOptions.body)
        await fetch(BASE_URL + 'Login/NonBabaUserLogin',
            requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then((data) => {
                console.log('==== EMAIL==== ' + JSON.stringify(data));
                let json = data;

                if (json.responseCode == 200) {
                    deleteTableAllRows(db);
                    if (isButtonSelected == 'Login') {
                        AsyncStorage.setItem('loginUserEmail', email);
                        navigation.reset({
                            index: 0,
                            routes: [{
                                name: 'NonBabasHomeDrawer',
                                screen: "NonBabasDashboard",
                            }],
                        });
                    } else {
                        Alert.alert(
                            "Alert!",
                            json.data.status,
                            [
                                {
                                    text: "Ok",
                                    onPress: () => {
                                        navigation.reset({
                                            index: 0,
                                            routes: [{
                                                name: 'Login',
                                            }],
                                        });
                                    }
                                }
                            ]
                        )
                    }
                } else {
                    Alert.alert(
                        "Alert!",
                        json.data.status,
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

    // This function is to set the UI
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={loginPageStyles.container}>
                <StatusBar barStyle="default"
                    backgroundColor="#FA0F0A" />
                <KeyboardAwareScrollView >
                    <View style={{ flexDirection: 'column' }}>
                        <Image
                            style={loginPageStyles.top_image}
                            source={require('../assets/images/top_image.png')}
                        />
                        <View style={clockInPageStyles.top_image_layer_login_nonbabs} />
                        <View style={loginPageStyles.content_container}>
                            <Image
                                style={loginPageStyles.logo_image}
                                source={require('../assets/images/logo.png')}
                            />
                            <Text style={{
                                fontSize: 16,
                                color: '#fb0f0c',
                                fontWeight: '400',
                                marginTop: 20,
                                fontFamily: 'OpenSans-Semibold',
                            }}>
                                Welcome to Baba's
                            </Text>
                            {/* <View style={{ flexDirection: 'row', marginBottom: -20 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setButtonSelected('Login')
                                        // setEmail('')
                                        // setPassword('')
                                    }}>
                                    {
                                        isButtonSelected == 'Login' ?
                                            <View style={loginPageStyles.btn_login}>
                                                <Text style={{ fontSize: 16, color: '#ffffff', fontFamily: 'OpenSans-Regular' }}>
                                                    Login
                                                </Text>
                                            </View>
                                            :
                                            <View style={loginPageStyles.btn_login_1}>
                                                <Text style={{ fontSize: 16, color: '#fb0f0c', fontFamily: 'OpenSans-Regular' }}>
                                                    Login
                                                </Text>
                                            </View>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setButtonSelected('Registration')
                                        // setEmail('')
                                        // setPassword('')
                                    }}>
                                    {
                                        isButtonSelected == 'Registration' ?
                                            <View style={loginPageStyles.btn_login}>
                                                <Text style={{ fontSize: 16, color: '#ffffff', fontFamily: 'OpenSans-Regular' }}>
                                                    Registration
                                                </Text>
                                            </View>
                                            :
                                            <View style={loginPageStyles.btn_login_1}>
                                                <Text style={{ fontSize: 16, color: '#fb0f0c', fontFamily: 'OpenSans-Regular' }}>
                                                    Registration
                                                </Text>
                                            </View>
                                    }
                                </TouchableOpacity>
                            </View> */}
                            <View style={loginPageStyles.edit_bg}>
                                <Image
                                    style={loginPageStyles.svg_icons}
                                    source={require('../assets/images/ic_user.png')}
                                />
                                <TextInput
                                    value={email}
                                    style={loginPageStyles.input}
                                    keyboardType="email-address"
                                    placeholder="Email"
                                    placeholderTextColor="#e0e0e0"
                                    onChangeText={(value) => setEmail(value)}
                                />
                            </View>
                            <View style={loginPageStyles.edit_bg}>
                                <Image
                                    style={loginPageStyles.svg_icons}
                                    source={require('../assets/images/ic_password.png')}
                                />
                                <TextInput
                                    style={loginPageStyles.input_password}
                                    keyboardType="default"
                                    placeholder="Password"
                                    placeholderTextColor="#e0e0e0"
                                    onChangeText={(value) => setPassword(value)}
                                    secureTextEntry={hidePass}
                                    value={password}
                                />
                                <TouchableOpacity
                                    style={{}}
                                    onPress={() => {
                                        console.log('==hidePass==: ' + hidePass)
                                        if (hidePass) {
                                            setHidePass(false)
                                        } else {
                                            setHidePass(true)
                                        }
                                    }}>
                                    {
                                        hidePass ?
                                            <Image
                                                style={loginPageStyles.svg_icons_1}
                                                source={require('../assets/images/view.png')}
                                            />
                                            :
                                            <Image
                                                style={loginPageStyles.svg_icons_1}
                                                source={require('../assets/images/hide.png')}
                                            />}
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    let reg_password = /^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
                                    if (email !== '' && password !== '') {
                                        if (password.length > 20 || reg_password.test(password) === false) {
                                            Alert.alert(
                                                "Alert!",
                                                "Password must be min: 8, max: 20 Characters, 1 Caps (A-Z) & 1 Numeric (0-9) to strengthen your password.",
                                            )
                                        } else {
                                            checkInternet();
                                        }
                                        // }
                                    } else {
                                        Alert.alert(
                                            "Alert!",
                                            "Email & Password should not be empty.",
                                        )
                                    }
                                    // navigation.reset({
                                    //     index: 0,
                                    //     routes: [{
                                    //         name: 'NonBabasHomeDrawer',
                                    //         screen: "NonBabasDashboard"
                                    //     }],
                                    // });
                                }}
                                style={loginPageStyles.btn}>
                                {loading ? <View style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                    {
                                        loading &&
                                        <ActivityIndicator color={'#fff'} />
                                    }
                                </View> : <Text style={loginPageStyles.btn_text}>
                                    {isButtonSelected}
                                </Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {/* <TouchableNativeFeedback
                    onPress={() => { navigation.goBack(null) }}
                    style={employeesForgotPasswordPageStyles.back_btn_layout}>
                    <Image
                        style={employeesForgotPasswordPageStyles.back_btn}
                        source={require('../assets/images/ic_back.png')}
                    />
                </TouchableNativeFeedback > */}
                <TouchableNativeFeedback
                    onPress={() => { navigation.goBack(null) }}
                    style={employeesForgotPasswordPageStyles.back_btn_layout}>
                    <View style={clockInPageStyles.back_view}>
                        <Image
                            style={clockInPageStyles.back_btn}
                            source={require('../assets/images/ic_back.png')}
                        />
                        <Text style={clockInPageStyles.back_text}>
                            Registration
                        </Text>
                    </View>
                </TouchableNativeFeedback >
            </View>
        </SafeAreaView>
    );
};
export default NonBabasLogin;