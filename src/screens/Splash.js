import React, { useEffect, useState } from 'react';
import {
    Image, StatusBar, View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import { splashPageStyels } from '../utils/styles';

var db = openDatabase({ name: 'BABAS_DB.db' });

const Splash = ({ navigation }) => {
    const [dataArray, setDataArray] = useState([]);
    const [isDataAvailable, setDataAvailable] = useState(false);
    const [count, setCount] = useState(1);

    useEffect(() => {
        console.log('useEffect Called.');
        console.log('AsyncStorage.getItem ; :: ' + AsyncStorage.getItem('screen', (err, item) => console.log('Sohel :' + item)));
        setCount(count + 1);

        // This method to get the user datafrom local DB
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user',
                [],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    console.log('first time')
                    setDataArray(temp);
                    setDataAvailable(true);
                }
            );
        });
    }, []);

    // This function is to set time out for splash screen 
    setTimeout(() => {
        AsyncStorage.getItem('screen', (err, item) => {
            if (item === null) {
                AsyncStorage.getItem('privacyAccepted', (err, item) => {
                    console.log("item ::: 111 === " + item);
                    if (item === '0' || item === null) {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Privacy' }],
                        });
                    } else {
                        AsyncStorage.setItem('screen', 'Login')
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                })
            } else {
                if (isDataAvailable && count === 2) {
                    if (dataArray.length <= 0) {
                        AsyncStorage.getItem('privacyAccepted', (err, item) => {
                            console.log("item ::: 222 === " + item);
                            if (item === '0' || item === null) {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Privacy' }],
                                });
                            } else {
                                AsyncStorage.setItem('screen', 'Login')
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Login' }],
                                });
                            }
                        })
                    } else if (dataArray[0].userRole == 3) {
                        AsyncStorage.setItem('screen', 'EmployeeHome')
                        navigation.reset({
                            index: 0,
                            routes: [{
                                name: 'EmployeesHomeDrawer',
                                screen: "EmployeesHome"
                            }],
                        });
                    } else if (dataArray[0].userRole == 2) {
                        AsyncStorage.setItem('screen', 'SupervisorHome')
                        navigation.reset({
                            index: 0,
                            routes: [{
                                name: 'SuperVisorHomeDrawer',
                                screen: "SuperVisorHome"
                            }],
                        });
                    } else if (dataArray[0].userRole == 1) {
                        AsyncStorage.setItem('screen', 'AdminDashboard')
                        navigation.reset({
                            index: 0,
                            routes: [{
                                name: 'AdminHomeDrawer',
                                screen: "AdminDashboard"
                            }],
                        });
                    }
                }
            }
        });
    }, 2000);

    // This function is to set the UI 
    return (
        <View style={splashPageStyels.container}>
            <StatusBar barStyle="light-content"
                backgroundColor="#FA0F0A" />
            <View>
                <Image
                    style={splashPageStyels.logo_image}
                    source={require('../assets/images/logo.png')}
                />
            </View>
        </View>
    );
};

export default Splash;