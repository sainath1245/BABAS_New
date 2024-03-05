import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    StatusBar, Text, TouchableOpacity, View
} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import WebView from 'react-native-webview';
import { loginPageStyles, splashPageStyels } from '../utils/styles';

var db = openDatabase({ name: 'BABAS_DB.db' });
var width = Dimensions.get('window').width;

const Privacy = ({ navigation }) => {
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false);

    return (
        <View style={splashPageStyels.container}>
            <StatusBar barStyle="light-content"
                backgroundColor="#FA0F0A" />
            <View style={{}}>
                <WebView
                    onLoad={() => { setLoading(false) }}
                    source={{
                        uri: 'https://babas.com.my/index.php/babas_attendance_clocking_privacy_policy',
                    }}
                    javaScriptEnabled={false}
                    style={{ flex: 1, width: width * 1, marginTop: -100, marginBottom: 10 }}
                />
                <TouchableOpacity
                    onPress={() => {
                        AsyncStorage.setItem('privacyAccepted', '1');
                        AsyncStorage.setItem('screen', 'Login')
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }}
                    style={{
                        height: 45,
                        width: width * .9,
                        backgroundColor: '#fb0f0c',
                        marginBottom: 20,
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center'
                    }}>
                    {loading ? <View style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        {
                            loading &&
                            <ActivityIndicator color={'#fff'} />
                        }
                    </View> : <Text style={loginPageStyles.btn_text}>
                        Agree & Continue
                    </Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Privacy;