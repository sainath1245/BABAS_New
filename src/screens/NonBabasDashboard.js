import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Linking,
    Platform,
    StatusBar,
    View
} from 'react-native';
import Modal from "react-native-modal";
import { openDatabase } from 'react-native-sqlite-storage';
import { WebView } from 'react-native-webview';
import {
    EmployeesUploadDocumentsPageStyles,
    clockInPageStyles,
    loginPageStyles
} from '../utils/styles';

var db = openDatabase({ name: 'BABAS_DB.db' });
var width = Dimensions.get('window').width;

const NonBabasDashboard = ({ navigation }) => {
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        // AsyncStorage.getItem('loginUserEmail', (err, item) => {
        //     console.log('--notificationCount-- loginUserEmail: ' + item)
        //     // setEmail(item)
        // })
    }, [])

    // This function is to set the UI 
    return (
        <View style={loginPageStyles.container_1}>
            <StatusBar barStyle="default"
                backgroundColor="#FA0F0A" />
            <View style={{ flexDirection: 'column', flex: 1 }}>
                <Image
                    style={EmployeesUploadDocumentsPageStyles.top_image_nonbabas}
                    source={require('../assets/images/top_image_1.png')}
                />
                <View style={clockInPageStyles.top_image_layer} />
                <View style={{ flex: 1 }}>
                    {/* <WebView
                        onLoad={() => { setLoading(false) }}
                        source={{
                            uri: 'https://www.babas.com.my',
                        }}
                        javaScriptEnabled={true}
                        automaticallyAdjustContentInsets={true}
                        style={{ flex: 1, width: width * 1 }}
                    /> */}
                    {
                        Platform.OS == 'ios' ?
                            <WebView
                                onLoad={() => { setLoading(false) }}
                                source={{
                                    uri: 'https://docs.google.com/document/d/1cWwsLoSUDtJbPncW3tLInMfq5cg6HsCqVP8T71d0Zeo/edit?usp=sharing',
                                }}
                                onShouldStartLoadWithRequest={event => {
                                    if (event.navigationType == 'click') {
                                        Linking.openURL('https://www.babas.com.my');
                                        return false
                                    }
                                    return true
                                }}
                                javaScriptEnabled={false}
                                style={{ flex: 1, width: width * 1, marginTop: -90 }}
                            />
                            :
                            <WebView
                                onLoad={() => { setLoading(false) }}
                                source={{
                                    uri: 'https://docs.google.com/document/d/1cWwsLoSUDtJbPncW3tLInMfq5cg6HsCqVP8T71d0Zeo/edit?usp=sharing',
                                }}
                                javaScriptEnabled={true}
                                style={{ flex: 1, width: width * 1, marginTop: -90 }}
                            />
                    }

                    <Modal isVisible={loading} style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <ActivityIndicator color={'#fff'} />
                    </Modal>
                </View>
            </View>
        </View >
    );
};

export default NonBabasDashboard;