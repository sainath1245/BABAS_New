import React, {useEffect, useState} from 'react';
import {
  Image,
  StatusBar,
  View,
  ActivityIndicator,
  Alert,
  Platform,
  TouchableOpacity,
  Text,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDatabase} from 'react-native-sqlite-storage';
import {splashPageStyels} from '../utils/styles';
import Modal from 'react-native-modal';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import {BASE_URL} from '../utils/consts';
import notifee from '@notifee/react-native';

var db = openDatabase({name: 'BABAS_DB.db'});

const Splash = ({navigation}) => {
  const [dataArray, setDataArray] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noNetCancelSelected, setNoNetCancelSelected] = useState(false);
  const [navigateToStore, setNavigateToStore] = useState(false);
  const [serverLeastVersion, setServerLeastVersion] = useState('');

  const semver = require('semver');

  useEffect(() => {
    notifee.cancelAllNotifications();
    console.log(
      'AsyncStorage.getItem :: ' +
        AsyncStorage.getItem('screen', (_err, item) =>
          console.log('item data form  AsyncStorage:' + item),
        ),
    );
    setCount(count + 1);
    // setNoNetCancelSelected(true);
    // setNavigateToStore(true);
    getLocalUserData();
    // if (count === 2) {
    //   console.log('Checking internet in useeffect....');
    //   checkInternetConnection();
    // }
    // const timer = setTimeout(() => {
    //   // Call your method here after 3 seconds
    //   checkInternetConnection();
    // }, 2000);

    // return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // console.log(
    //   `local DB response-- ${isDataAvailable}, serverResponse val -${serverLeastVersion}`,
    // );
    // navigateUserToParticularScreen();
    if (isDataAvailable && serverLeastVersion !== '') {
      // navigateUserToParticularScreen();
      // compareAppVersionWithStoreVersion(JSON.stringify(apiResponse));
      // console.log(
      //   'serverLeastVersion verion from API response ---',
      //   serverLeastVersion,
      // );
      compareAppVersionWithStoreVersion();
      // navigateToPlayStore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataAvailable, serverLeastVersion]);

  // This method to get the user datafrom local DB
  const getLocalUserData = () => {
    console.log('fetching local DB data....');
    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM user',
          [],
          (_tx, results) => {
            console.log('results from DB', results);
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log('first timmme');
            setDataArray(temp);
            setIsDataAvailable(true);
            // checkInternetConnection();
            setTimeout(() => {
              checkInternetConnection();
              // console.log(
              //   `isDataAvailable updated to true, vaaal-- ${isDataAvailable}`,
              // );
            }, 1000);
          },
          // (_tx, error) => {
          //   console.log('error  in SQL---', error);
          // },
        );
      },
      error => {
        // console.log('error in transaction', error);
        setIsDataAvailable(true);
        setTimeout(() => {
          checkInternetConnection();
          // console.log(
          //   `isDataAvailable updated to true, vaaal-- ${isDataAvailable}`,
          // );
        }, 1000);
      },
    );
  };
  const checkInternetConnection = async () => {
    console.log('checking internet');
    // setTextOnUI('Checking internet connection.');
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        console.log('isDataAvailable ---', isDataAvailable);
        // setTextOnUI('Internet connection available. Fetching data.');
        setLoading(true);
        setNoNetCancelSelected(false);
        fetchAppVersionDetails();
      } else {
        if (!noNetCancelSelected) {
          Alert.alert(
            'Alert!',
            'Please check your internet connection to get data.',
            [
              {
                text: 'Ok',
                onPress: () => {
                  // console.log('Ok pressed for no internet.');
                  setNoNetCancelSelected(true);
                },
                //   style: 'cancel',
              },
            ],
          );
        } else {
          console.log('Not showing alert.');
          // setTextOnUI('No internet connection.');
        }
      }
    });
  };

  const fetchAppVersionDetails = async () => {
    // let tempBearer =
    // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJGdWxsTmFtZSI6Ik1PSEFNTUFEIFNPSEVMIEtIQU4iLCJFbWFpbCI6Im1vaGFtbWFkc29oZWwua2hhbkB1c3QuY29tIiwiVXNlclJvbGUiOiIzIiwiVXNlcklkIjoiNzAwMDA0IiwiRGVzaWduYXRpb24iOiJFbXBsb3llZV9UZXN0IiwiTG9jYXRpb24iOiJPRkZJQ0UiLCJleHAiOjE3NDUwNDUwMzAsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjQ0Mzg2LyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjQ0Mzg2LyJ9.FLQWYuLUs1hVosL2_ZqJRPJ55GuS85DBHcYNRPY8yqU';
    const requestOptions = {
      method: 'GET',
      // headers: {
      //   Authorization: 'Bearer ' + tempBearer,
      //   'Content-Type': 'application/json',
      // },
    };
    // var requestOptions = '';
    setNoNetCancelSelected(false);
    // const requestOptions = {
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({
    //     Email: 'sainath.gourishetty@yash.com',
    //     Password: 'Babas@1234',
    //     Type: 'Login',
    //   }),
    // };
    // console.log('===requestOptions.body ===========' + requestOptions.body);
    console.log('FetchMethod called');
    await fetch(BASE_URL + 'Version/GetVersion', requestOptions)
      //  await fetch(BASE_URL + 'Login/NonBabaUserLogin', requestOptions)
      .then(response => {
        // console.log('====API Response Code  ==== ' + response.ok);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            'Something went wrong, status is---' + response.status,
          );
        }
      })
      .then(data => {
        // console.log('==== API data response ==== ', data);
        // console.log(
        //   'API data.data response ==== ',
        //   data.data.ios.least_supported_app,
        // );
        console.log('data res of get version----' + JSON.stringify(data));
        if (data.responseCode === 200) {
          if (Platform.OS === 'ios') {
            // console.log('ioS log...', resultOfAPI.ios);
            // console.log('ioS log...', data.data.ios.least_supported_app);
            setServerLeastVersion(data.data.ios.least_supported_app);
          } else {
            // console.log(
            //   'ANdroid log....',
            //   data.data.android.least_supported_app,
            // );
            setServerLeastVersion(data.data.android.least_supported_app);
          }
        } else {
          Alert.alert('Alert!', 'Unable to fetcch data, Please try later.');
        }
        // setTextOnUI('API response success.');
        // compareAppVersionWithStoreVersion(JSON.stringify(apiResponse));
      })
      .catch(error => {
        // console.log('Error Alert!: ' + error);
        //Previous error --- Cannot read property 'least_supported_app' of undefined
        Alert.alert('Alert!', error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  function countSpecificCharacter(str, charToCount) {
    let countOfChar = 0;
    for (let char of str) {
      if (char === charToCount) {
        countOfChar++;
      }
    }
    return countOfChar;
  }
  function compareAppVersionWithStoreVersion() {
    console.log('compare started');
    const iOSLeastSupportedVersion = serverLeastVersion;
    const androidLeastSupportedVersion = serverLeastVersion;
    var localDeviceInfoForAndroid = DeviceInfo.getVersion();
    var localDeviceInfoForiOS = DeviceInfo.getVersion();
    // console.log('######### Comparision Started #########');
    if (Platform.OS === 'ios') {
      // console.log('iOSLeastSupportedVersion', iOSLeastSupportedVersion);
      // console.log(
      //   'localDeviceInfoForiOS before convert',
      //   localDeviceInfoForiOS,
      // );
      // if (localDeviceInfoForiOS.length < 6) {
      //   localDeviceInfoForiOS = localDeviceInfoForiOS + '.0';
      // }
      let val = countSpecificCharacter(localDeviceInfoForiOS, '.');
      if (val === 1) {
        localDeviceInfoForiOS = localDeviceInfoForiOS + '.0';
      }
      // console.log('localDeviceInfoForiOS after', localDeviceInfoForiOS);
      if (semver.lt(localDeviceInfoForiOS, iOSLeastSupportedVersion)) {
        // console.log('Least version is greater so navigate user to AppStore');
        Alert.alert(
          'Alert!',
          'To keep using the Babas app, please download the latest version.',
          [
            {
              text: 'Ok',
              onPress: () => {
                setNavigateToStore(true);
                // console.log('navigate user to App store.');
                navigateToAppStore();
              },
            },
          ],
        );
      } else {
        console.log('Navigate User to regular screen');
        navigateUserToParticularScreen();
      }
    } else {
      // console.log('androidLeastSupportedVersion', androidLeastSupportedVersion);
      // console.log('localDevInfoAndroid bef_convert', localDeviceInfoForAndroid);
      // if (localDeviceInfoForAndroid.length < 6) {
      //   localDeviceInfoForAndroid = localDeviceInfoForAndroid + '.0';
      // }
      let val = countSpecificCharacter(localDeviceInfoForAndroid, '.');
      if (val === 1) {
        localDeviceInfoForAndroid = localDeviceInfoForAndroid + '.0';
      }
      // console.log('localDeviceInfoAndroid after', localDeviceInfoForAndroid);
      if (semver.lt(localDeviceInfoForAndroid, androidLeastSupportedVersion)) {
        // console.log(
        //   'Least supported version is greater so navigate user to PlayStore',
        // );
        Alert.alert(
          'Alert!',
          'To keep using the Babas app, please download the latest version.',
          [
            {
              text: 'Ok',
              onPress: () => {
                setNavigateToStore(true);
                // console.log('navigate user to Play store.');
                navigateToPlayStore();
              },
            },
          ],
        );
      } else {
        // console.log('Navigate User to regular screen');
        navigateUserToParticularScreen();
      }
    }
  }
  function navigateToAppStore() {
    const appStoreUrl =
      'https://apps.apple.com/in/app/babas-attendance-clocking/id1638664823';
    Linking.openURL(appStoreUrl);
  }
  function navigateToPlayStore() {
    Linking.openURL('http://play.google.com/store/apps/details?id=com.babas');
  }
  // This function is to set time out for splash screen
  // setTimeout(() => {
  //   checkInternetConnection();
  // }, 2000);

  const navigateUserToParticularScreen = () => {
    console.log('navigation started here.....');
    // setTextOnUI('navigation started here....');
    setTimeout(() => {
      // console.log('timer stated after 2 secs');
      // setTextOnUI('timer stated after 2 secs');
      AsyncStorage.getItem('screen', (_err, item) => {
        console.log(
          'Item response from local storage and count ---',
          item,
          count,
        );
        if (item === null) {
          AsyncStorage.getItem('privacyAccepted', (_err, item) => {
            console.log('item ::: 111 === ' + item);
            if (item === '0' || item === null) {
              navigation.reset({
                index: 0,
                routes: [{name: 'Privacy'}],
              });
            } else {
              AsyncStorage.setItem('screen', 'Login');
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              });
            }
          });
        } else {
          // console.log(
          //   `isDataAvailable ${isDataAvailable} and 
          //   dataArray length-  ${dataArray.length} in navigation and 
          //   count val- ${count}`,
          // );
          if (isDataAvailable && count === 2) {
            // console.log(
            //   `isDataAvailable ${isDataAvailable} 
            //   and dataArray length ${dataArray.length} in navigation in if condition`,
            // );
            // if (isDataAvailable) {
            if (dataArray.length <= 0) {
              AsyncStorage.getItem('privacyAccepted', (_err, item) => {
                // console.log('item ::: 222 === ' + item);
                if (item === '0' || item === null) {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Privacy'}],
                  });
                } else {
                  AsyncStorage.setItem('screen', 'Login');
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Login'}],
                  });
                }
              });
            } else if (dataArray[0].userRole == 3) {
              AsyncStorage.setItem('screen', 'EmployeeHome');
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'EmployeesHomeDrawer',
                    screen: 'EmployeesHome',
                  },
                ],
              });
            } else if (dataArray[0].userRole == 2) {
              AsyncStorage.setItem('screen', 'SupervisorHome');
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'SuperVisorHomeDrawer',
                    screen: 'SuperVisorHome',
                  },
                ],
              });
            } else if (dataArray[0].userRole == 1) {
              AsyncStorage.setItem('screen', 'AdminDashboard');
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'AdminHomeDrawer',
                    screen: 'AdminDashboard',
                  },
                ],
              });
            }
          } else {
            console.log(
              `isData available -- ${isDataAvailable} and count val-- ${count} in else`,
            );
          }
        }
      });
    }, 1000);
  };

  // This function is to set the UI
  return (
    <View style={splashPageStyels.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FA0F0A" />
      <View>
        <Image
          style={splashPageStyels.logo_image}
          source={require('../assets/images/logo.png')}
        />
      </View>
      <View>
        {/* <Text>{textOnUI}</Text> */}
        {noNetCancelSelected && (
          <TouchableOpacity
            onPress={() => {
              NetInfo.fetch().then(state => {
                if (state.isConnected) {
                  fetchAppVersionDetails();
                }
                // else {
                //   console.log('No internet connection available');
                // }
              });
            }}
            style={splashPageStyels.btn_refresh}>
            <Text style={splashPageStyels.btn_text_refresh}>Refresh</Text>
          </TouchableOpacity>
        )}
        {navigateToStore && (
          <View style={splashPageStyels.update_view}>
            <Text style={splashPageStyels.update_text}>
              To Keep using Baba's app, please download the latest version.
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'android') {
                  navigateToPlayStore();
                } else {
                  navigateToAppStore();
                }
              }}
              style={splashPageStyels.btn_Update}>
              <Text style={splashPageStyels.btn_text}>Update Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Modal isVisible={loading} style={splashPageStyels.modal}>
        <ActivityIndicator color={'#fff'} />
      </Modal>
    </View>
  );
};

export default Splash;
