import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    StatusBar,
    View
} from 'react-native';
import Modal from "react-native-modal";
import { openDatabase } from 'react-native-sqlite-storage';
import { WebView } from 'react-native-webview';
import {
    clockInPageStyles,
    EmployeesUploadDocumentsPageStyles,
    loginPageStyles
} from '../utils/styles';

var db = openDatabase({ name: 'BABAS_DB.db' });
var width = Dimensions.get('window').width;

const Help = ({ navigation }) => {
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        // This function to get user role from local DB
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user',
                [],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    setUserRole(temp[0].userRole);
                }
            );
        });
    }, [])

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
                <View style={clockInPageStyles.top_image_layer} />
                <View style={{ flex: 1 }}>
                    {
                        userRole == 3 ?
                            <WebView
                                onLoad={() => { setLoading(false) }}
                                source={{
                                    uri: 'https://docs.google.com/document/d/1ET-ps0PTfkmCcoeMa6qOZNKDGdfNvqEfeDGN7D-vmhY/edit?usp=sharing',
                                }}
                                javaScriptEnabled={false}
                                style={{ flex: 1, width: width * 1, marginTop: -90 }}
                            /> : userRole == 2 ? <WebView
                                onLoad={() => { setLoading(false) }}
                                source={{
                                    uri: 'https://docs.google.com/document/d/17fUUDIQs9S_iT-jLxXTCIwXinwyt5RkeD9c51HKkUfc/edit?usp=sharing',
                                }}
                                javaScriptEnabled={false}
                                style={{ flex: 1, width: width * 1, marginTop: -90 }}
                            /> : <WebView
                                onLoad={() => { setLoading(false) }}
                                source={{
                                    uri: 'https://docs.google.com/document/d/1_Rpo1XM7itt81E6bkLeV0efURBzqIZAEDSdsrkAP2Lg/edit?usp=sharing',
                                }}
                                javaScriptEnabled={false}
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

export default Help;