import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import React, {
    useEffect,
    useState
} from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StatusBar,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from 'react-native';
import Modal from "react-native-modal";
import { openDatabase } from 'react-native-sqlite-storage';
import { SafeAreaView } from 'react-navigation';
import notificationStore from '../../notification_redux/notificationStore';
import { BASE_URL } from '../utils/consts';
import {
    EmployeesUploadDocumentsPageStyles,
    adminSuperVisorMapping,
    clockInPageStyles,
    employeesForgotPasswordPageStyles,
    historyPageStyles,
    loginPageStyles
} from '../utils/styles';

var db = openDatabase({ name: 'BABAS_DB.db' });

const Notifications = ({ navigation }) => {
    const [userData, setUserData] = useState([]);
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
  const [dataArray, setDataArray] = useState([]);
    const [isConnected, setConnected] = useState();
  let pendingListArray = [];
  const approvedOrRejectedMsg = 'You have already either approved or rejected the request.';
  var deleteAlertMsg = 'Are you sure, you want to Delete All ?';
  const [deleteBtnVisible, setDeleteBtnVisible] = useState(false);

  const handleDataFromDetailed = data => {
    console.log('****---handleDataFromDetailed -- data--', data);
    if (data != undefined) {
      const updatedNotificationData = dataArray.filter(
        item => item.notificationID != data.notificationID,
      );
      setDataArray(updatedNotificationData);
      let notif = updatedNotificationData.find(
        each => each.entityStatus == 1 || each.entityStatus == 2,
      );
      console.log(
        'found one approved/Rejected entity from detail screen -',
        notif,
      );
    //   if (notif != undefined) {
    //     setDeleteBtnVisible(true);
    //   }
    } else {
      console.log('empty from detail screen');
    }
  };
  

    useEffect(() => {
        setLoading(true);
        // This method to get the userId & user datafrom local DB
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user',
                [],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    setUserId(temp[0].userId);
                    setUserData(temp);
                }
            );
        });

        // This method to get user login token, this will require to call the APIs
        AsyncStorage.getItem('token', (err, item) => {
            setToken(item);
        })
        setTimeout(() => {
            checkInternet();
        }, 2000);

    }, [])

  // This function is to check the internet connection, if connection availave it will call API otherwise it will show error message 
  const checkInternet = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        callNotificationAPI();
      } else {
        setLoading(false);
        Alert.alert(
          'Alert!',
          '(Offline) No internet connection. Please try again later.',
        );
      }
      setConnected(state.isConnected);
    });
    return isConnected;
  };

  // This function is to get notifications from server
  callNotificationAPI = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userID: userId}),
    };
    console.log('=======requestOptions====== ' + requestOptions.body);
    console.log('=======token====== ' + token);
    await fetch(BASE_URL + 'User/GetUserNotification', requestOptions)
      .then(response => {
        console.log('====response.ok=====' + response.ok);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('STWR in GetUserNotification' + response.status);
        }
      })
      .then(data => {
        // console.log('==== resp  onseCode==== ' + data.responseCode);
        let json = data;
        if (json.responseCode == 200) {
          // console.log('json data response of notifications length',json.data.length);
          //   console.log('==== resp  onseCode==== ' + JSON.stringify(json));
          var notifiCount = json.data.filter(
            each => each.notificationStatus == 2,
          );
          console.log('all unread notifi count --', notifiCount.length);
          notificationStore.dispatch({
            type: 'COUNT_CHANGE',
            payload: {count: notifiCount.length},
          });
          setDataArray(json.data);
          let tempAllNotifArrayList = json.data;
          console.log('all noti', tempAllNotifArrayList);
          if (tempAllNotifArrayList.length > 0) {
            if (userData[0].userRole == 2) {
              let notif = tempAllNotifArrayList.find(
                each =>
                  each.entityStatus == 1 ||
                  each.entityStatus == 2 ||
                  each.notificationTypeID == 2,
              );
              console.log('found one approved/rejected entity -', notif);
              if (notif != undefined) {
                setDeleteBtnVisible(true);
              }
            } else if (userData[0].userRole == 3) {
              setDeleteBtnVisible(true);
            }
          } else {
            setDeleteBtnVisible(false);
          }
        } else {
          Alert.alert('Alert!', dataArray.responseMessage);
        }
      })
      .catch(error => {
        console.log('err in GetUserNotification : ' + error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateUserReadNotificationStatus = async notification => {
    console.log('notification item', notification);
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notificationID: notification.notificationID,
        userID: parseInt(userId),
      }),
    };
    console.log('requestOptions for noti status' + requestOptions.body);
    console.log('=======token====== ' + token);
    await fetch(BASE_URL + 'User/UpdateNotificationStatus', requestOptions)
      .then(response => {
        // console.log('Noti response' + response.ok);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong :: ' + response.status);
        }
      })
      .then(data => {
        // console.log('Noti success data res ' + data.responseCode);
        let json = data;
        if (json.responseCode == 200) {
          console.log('noti json stringfy ' + JSON.stringify(json));
          const updatedData = dataArray.map(item => {
            if (item.notificationID == notification.notificationID) {
              return {
                ...item,
                notificationStatus: 1,
              }; // Create a new object with updated userName
            }
            return item; // Return the original object if not the target
          });
          setDataArray(updatedData);
          console.log('updated Array--', updatedData);
          //noti json stringfy {"responseCode":200,"responseMessage":"Success","data":{"status":"Success","notificationCount":233,"isSuccess":true}}
          var notificationCount = json.data.notificationCount;
          notificationStore.dispatch({
            type: 'COUNT_CHANGE',
            payload: {count: notificationCount},
          });
          if (notification.notificationTypeID == 3) {
            if (pendingListArray.length > 0) {
              // console.log('entityId -', notification.entityID);
              filterArrayList(notification);
            } else {
              fetchPendingEntityDetails(notification);
            }
          } else if (notification.notificationTypeID == 1) {
            if (userData[0].userRole == 3 || userData[0].userRole == 2) {
              navigation.navigate('EmployeesHistoryDetail', {
                requestID: notification.entityID,
              });
            }
          } else if (notification.notificationTypeID == 2) {
            if (userData[0].userRole == 2) {
              navigation.navigate('SuperVisorHomeDrawer', {
                screen: 'Attendance Approval',
                params: {
                  startDate: '',
                  endDate: '',
                  type: '',
                  email: '',
                },
              });
            }
          }
        } else {
          Alert.alert('Alert!', json.responseMessage);
        }
      })
      .catch(error => {
        console.log('==notif ERROR== : ' + error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const filterArrayList = entity => {
    console.log('filtering Pending list with --');
    // console.log('pendingList in filterArrayList--', pendingListArray);
    var individualEntity = pendingListArray.find(
      eachItem => eachItem.requestId == entity.entityID,
    );
    console.log('individualEntity--', individualEntity);
    if (individualEntity == undefined) {
      Alert.alert('Alert!', approvedOrRejectedMsg);
    } else {
      console.log('notificationID for detail-', entity.notificationID);
      navigation.navigate('SuperVisorNotificationDetail', {
        entity: individualEntity,
        supervisorID: userId,
        token: token,
        onDataReceived: handleDataFromDetailed,
        notificationID: entity.notificationID,
      });
    }
  };
  // This function is to get all the pending clock in/out requestes
  const fetchPendingEntityDetails = async notificationItem => {
    console.log('notificationItem.entity', notificationItem.entityID);
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        supervisorUserID: parseInt(userId),
        startDate: '',
        endDate: '',
        empName: '',
        empID: '',
        workType: 0,
      }),
    };
    console.log('=======requestOptions====== ' + requestOptions.body);
    await fetch(BASE_URL + 'Attendance/GetRequestsForApproval', requestOptions)
      .then(response => {
        // console.log('GetRequestsForApproval ===' + response.ok);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('wrong for GetRequestsForApproval' + response.status);
        }
      })
      .then(data => {
        // console.log('==== resp  onseCode==== ' + data.responseCode);
        let json = data;
        if (json.responseCode == 200) {
          //   console.log('GetRequestsForApproval res' + JSON.stringify(json.data));
          //   pendingListArray(JSON.stringify(json.data));
          let tempData = json.data;
          //   console.log('tempdata--', tempData);
          pendingListArray = tempData;
          console.log('pendingList --', pendingListArray);
          if (JSON.stringify(json.data) === '[]') {
            Alert.alert('Alert!', approvedOrRejectedMsg);
            return;
          }
          //   console.log('entityID --', notificationItem);
          filterArrayList(notificationItem);
        } else {
          Alert.alert('Alert!', json.responseMessage);
        }
      })
      .catch(error => {
        console.log('err GetRequestsForApproval' + error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const deleteAllInternetChecking = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        deleteAllNotifications();
      } else {
        Alert.alert(
          'Alert!',
          '(Offline) No internet connection. Please try again later.',
        );
      }
      setConnected(state.isConnected);
    });
    return isConnected;
  };

  const deleteAllNotifications = async () => {
    setLoading(true);
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: parseInt(userId),
      }),
    };
    console.log('requestOptions for delete all notif' + requestOptions.body);
    console.log('=======token====== ' + token);
    await fetch(
      BASE_URL + 'User/DeleteAllApprovedOrRejectedUserNotification',
      requestOptions,
    )
      .then(response => {
        // console.log('Noti response' + response.ok);
        if (response.ok) {
          return response.json();
        } else {
          setLoading(false);
          throw new Error('STWR in delete all notif:: ' + response.status);
        }
      })
      .then(data => {
        console.log('Noti detete all data res ' + data.responseCode);
        let json = data;
        if (json.responseCode == 200) {
          if (json.data.isDelete) {
            setDeleteBtnVisible(false);
            callNotificationAPI();
          } else {
            Alert.alert(
              'Alert!',
              'Unable to delete records. Please try again later.',
            );
            setLoading(false);
          }
        } else {
          Alert.alert('Alert!', dataArray.responseMessage);
          setLoading(false);
        }
      })
      .catch(error => {
        console.log('==delete all noti ERROR== : ' + error);
        setLoading(false);
      })
      .finally(() => {});
  };
//   const deleteNotification = async notification => {
//     setLoading(true);
//     console.log('delete notification item', notification);
//     const requestOptions = {
//       method: 'POST',
//       headers: {
//         Authorization: 'Bearer ' + token,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         notificationID: notification.notificationID,
//         userID: parseInt(userId),
//       }),
//     };
//     console.log('requestOptions for noti status' + requestOptions.body);
//     console.log('=======token====== ' + token);
//     await fetch(BASE_URL + 'User/DeleteUserNotification', requestOptions)
//       .then(response => {
//         // console.log('Noti response' + response.ok);
//         if (response.ok) {
//           return response.json();
//         } else {
//           throw new Error('Something went wrong :: ' + response.status);
//         }
//       })
//       .then(data => {
//         console.log('Noti detete data res ' + data.responseCode);
//         let json = data;
//         if (json.responseCode == 200) {
//           if (json.data.isDelete) {
//             console.log('delete json stringfy ' + JSON.stringify(json));
//             //{"responseCode":200,"responseMessage":"Success","data":{"status":"Success","isDelete":true,"notificationCount":225}}
//             var notificationCount = json.data.notificationCount;
//             notificationStore.dispatch({
//               type: 'COUNT_CHANGE',
//               payload: {count: notificationCount},
//             });
//             const tempData = dataArray.filter(
//               item => item.notificationID !== notification.notificationID,
//             );
//             setDataArray(tempData);
//           } else {
//             Alert.alert(
//               'Alert!',
//               'Unable to delete record. Please try again later.',
//             );
//           }
//         } else {
//           Alert.alert('Alert!', dataArray.responseMessage);
//         }
//       })
//       .catch(error => {
//         console.log('==delete noti ERROR== : ' + error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

    // This function is to set FlatList UI 
    const renderItem = ({ item }) => (
        <View style={{ flex: 1 }}>
            <View style={historyPageStyles.list_main_container}>
                <View style={adminSuperVisorMapping.list_second_container_red}>
                    {
                        item.notificationType === 'Attendance Request' ?
                            <TouchableOpacity
                                onPress={() => {
                                  // if (userData[0].userRole == 3) {
                                  //   navigation.navigate('EmployeesHistoryDetail', {
                                  //       requestID: item.entityID,
                                  //       })
                                  //   } else if (userData[0].userRole == 2) {
                                  //       navigation.navigate('SuperVisorHistoryDetail', {
                                  //           requestID: item.entityID,
                                  //       })
                                  //   }
                                    if (userData[0].userRole == 3 || userData[0].userRole == 2) {
                                      if (item.notificationStatus == 2) {
                                        updateUserReadNotificationStatus(item);
                                      } else if (item.notificationStatus == 1) {
                                          navigation.navigate('EmployeesHistoryDetail', {
                                          requestID: item.entityID,
                                        })
                                      }
                                     }
                                    //   else if (userData[0].userRole == 2) {
                                    //   if (item.notificationStatus == 2) {
                                    //     updateUserReadNotificationStatus(item);
                                    //   } else if (item.notificationStatus == 1) {
                                    //       navigation.navigate('EmployeesHistoryDetail', {
                                    //       requestID: item.entityID,
                                    //     })
                                    //   }
                                    //  }
                                        // console.log(
                                        //     'Navigation failed due to user role ',
                                        //     userData[0].userRole
                                        // );
                                }}>
                                <View style={{ flexDirection: 'row', }}>
                                    {/* <View style={{ padding: 10, backgroundColor: '#F9E9E8', width: '100%' }}> */}
                                    <View style={{ padding: 10, backgroundColor: (item.notificationStatus == 2 ? '#E0F2E0' : '#F9E9E8'), width: '100%' }}>
                                        <Text style={historyPageStyles.noti_text}>
                                            Rejected
                                        </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text style={historyPageStyles.employee_name_text}>
                                                    Request ID - {item.entityID}
                                                </Text>
                                                <Text style={historyPageStyles.employee_name_text}>
                                                    has been rejected
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text style={historyPageStyles.employee_name_text}>
                                                    {(item.createdTime)}
                                                </Text>
                                                <Text style={historyPageStyles.employee_name_text}>
                                                    {item.createdDate}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={adminSuperVisorMapping.supervisor_comment_text}>
                                            Kindly refer to the approval{'\n'}details in History section.
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            :
                            item.notificationType === 'Clock-In/Clock-Out' ?
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log('userRole - ', userData[0].userRole);
                                        if (userData[0].userRole == 2) {
                                            if (item.notificationStatus == 2) {
                                                updateUserReadNotificationStatus(item);
                                            } else {
                                                console.log('else EntityID - ', item.entityID);
                                                if (pendingListArray.length > 0) {
                                                    console.log('item.entity with existing array-', item.entityID);
                                                    filterArrayList(item);
                                                  } else {
                                                    setLoading(true);
                                                    console.log('fetching pending list');
                                                    fetchPendingEntityDetails(item);
                                                  }
                                            }
                                            //new
                                        //     navigation.navigate('SuperVisorHistoryDetail', {
                                        //     requestID: item.entityID,
                                        // })
                                        //new
                                        // navigation.navigate('EmployeesHistoryDetail', {
                                        //     requestID: item.entityID,
                                        // })
                                        //old
                                            // navigation.navigate("SuperVisorHomeDrawer", {
                                            //     screen: "Attendance Approval",
                                            //     params: {
                                            //         startDate: "",
                                            //         endDate: "",
                                            //         type: "",
                                            //         email: ""
                                            //     }
                                            // });
                                        }
                                    }}>
                                    <View style={{ flexDirection: 'row' }}>
                                    <View style={{ padding: 10, backgroundColor: (item.notificationStatus == 2 ? '#E0F2E0' : '#F9E9E8'), width: '100%' }}>
                                        {/* <View style={{ padding: 10, backgroundColor: '#F9E9E8', width: '100%' }}> */}
                                            <Text style={historyPageStyles.noti_text}>
                                                Attendance Approval
                                            </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'column', width: '70%' }}>
                                                    <Text style={historyPageStyles.employee_name_text}>
                                                        {item.notificationDetails}
                                                        {'\n'}
                                                        {'\n'}
                                                        Kindly review & approve in the Attendance Approval section.
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text style={historyPageStyles.employee_name_text}>
                                                        {(item.createdTime)}
                                                    </Text>
                                                    <Text style={historyPageStyles.employee_name_text}>
                                                        {item.createdDate}
                                                    </Text>
                                                     {/* <TouchableOpacity style={{alignItems: 'flex-end', flex: 1}}
                            onPress={() => {
                                if (item.notificationStatus == 2) {
                                    Alert.alert(
                                        "Alert!",
                                        'Are you sure you want to delete notification?',
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                            },
                                            {
                                                text: "Delete",
                                                onPress: () => {
                                                    NetInfo.fetch().then(state => {
                                                        if (state.isConnected) {
                                                          setLoading(true);
                                                          deleteNotification(item);
                                                        } else {
                                                          Alert.alert(
                                                            'Alert!',
                                                            'Please check the internet connection to delete notification.',
                                                          );
                                                        }
                                                      });
                                                }
                                            }
                                        ]
                                    )
                                } else {
                                    NetInfo.fetch().then(state => {
                                        if (state.isConnected) {
                                          setLoading(true);
                                          deleteNotification(item);
                                        } else {
                                          Alert.alert(
                                            'Alert!',
                                            'Please check the internet connection to delete notification.',
                                          );
                                        }
                                      });
                                }
                            }}>
                            <Image
                                style={historyPageStyles.noti_delete}
                                source={require('../assets/images/bin.png')} />
                        </TouchableOpacity> */}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity> :
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log('userRole for delegation', userData[0].userRole)
                                        console.log('delegation response --', item);
                                        if (userData[0].userRole == 2) {
                                            // navigation.navigate("SuperVisorHomeDrawer", {
                                            //     screen: "Attendance Approval",
                                            //     params: {
                                            //         startDate: "",
                                            //         endDate: "",
                                            //         type: "",
                                            //         email: ""
                                            //     }
                                            // });
                                            if (item.notificationStatus == 1) {
                                                navigation.navigate("SuperVisorHomeDrawer", {
                                                  screen: "Attendance Approval",
                                                  params: {
                                                    startDate: "",
                                                    endDate: "",
                                                    type: "",
                                                    email: ""
                                                  }
                                                });
                                            } else if (item.notificationStatus == 2) {
                                                updateUserReadNotificationStatus(item);
                                            }
                                            // updateUserReadNotificationStatus(item);
                                        }
                                    }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ padding: 10, backgroundColor: (item.notificationStatus == 2 ? '#E0F2E0' : '#F9E9E8'), width: '100%' }}>
                                            <Text style={historyPageStyles.noti_text}>
                                                Delegation
                                            </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'column', width: '70%' }}>
                                                    <Text style={historyPageStyles.employee_name_text}>
                                                        {item.notificationDetails}
                                                        {'\n'}
                                                        {'\n'}
                                                        Kindly review & approve as necessary in Attendance Approval section.
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text style={historyPageStyles.employee_name_text}>
                                                        {(item.createdTime)}
                                                    </Text>
                                                    <Text style={historyPageStyles.employee_name_text}>
                                                        {item.createdDate}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                    }
                </View>
            </View>
        </View >
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
                    <View style={clockInPageStyles.top_image_layer} />
                    <TouchableNativeFeedback
                        onPress={() => { navigation.goBack(null) }}
                        style={employeesForgotPasswordPageStyles.back_btn_layout}>
                        <View style={clockInPageStyles.back_view}>
                            <Image
                                style={clockInPageStyles.back_btn}
                                source={require('../assets/images/ic_back.png')}
                            />
                            <Text style={clockInPageStyles.back_text}>
                                Notification
                            </Text>
                        </View>
                    </TouchableNativeFeedback >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',}}>
                        {
                            dataArray.length > 0 ?
                                <FlatList
                                    style={{ marginTop: 10, marginBottom: 30 }}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    data={dataArray}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderItem}
                                />
                                :
                                <Text style={{ fontFamily: 'OpenSans-Regular', alignSelf: 'center', fontSize: 12, color: '#000' }}>
                                    Notifications will appear here.
                                </Text>
                        }
                    </View>
                    { deleteBtnVisible  &&
                    <View style={{ flexDirection: 'row', alignSelf: 'center'}}>
                    <TouchableOpacity
                        onPress={() => {
                            if (userData[0].userRole == 2) {
                                deleteAlertMsg = 'Are you sure, you want to delete all Approved or Rejected requests ?';
                            }
                            Alert.alert(
                                "Alert!",
                                deleteAlertMsg,
                                [
                                    {
                                        text: "Cancel",
                                        onPress: () => console.log("Cancel Pressed"),
                                    },
                                    {
                                        text: "Delete",
                                        onPress: () => {
                                            deleteAllInternetChecking();
                                        }
                                    }
                                ]
                            )
                        }}
                        style={historyPageStyles.delete_all_btn}
                        >
                        <Text style={loginPageStyles.btn_text}>
                            Delete All
                        </Text>
                    </TouchableOpacity>
                </View>
                }
                </View>
                <Modal isVisible={loading} style={{ position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <ActivityIndicator color={'#fff'} />
                </Modal>
            </View >
        </SafeAreaView>
    );
};

export default Notifications;