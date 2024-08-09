import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  EmployeesUploadDocumentsPageStyles,
  alertStyles,
  clockInPageStyles,
  employeesForgotPasswordPageStyles,
  historyPageStyles,
  loginPageStyles,
  superVisorEmployeeRequestStyles,
} from '../utils/styles';
import NetInfo from "@react-native-community/netinfo";
import Modal from 'react-native-modal';
import {TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../utils/consts';
import { TouchableNativeFeedback } from 'react-native';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';

const SuperVisorNotificationDetail = ({route, navigation, onDataReceived}) => {
  const [item_height, setItemHeight] = useState(0);
  const [isRejectPopupVisible, setRejectedPopupVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  // const [token, setToken] = useState('');
  console.log('####details screen props --', route);
  var props = route.params.entity;
  var superVisorID = route.params.supervisorID;
  var token = route.params.token;
  console.log('%%%%%%-----superVisorId', superVisorID);
  const notiID = {notificationID: route.params.notificationID};
  console.log('Not-iD in detail', notiID);
  const onLayout = event => {
    const {height} = event.nativeEvent.layout;
    // console.log('height in detail--', height);
    setItemHeight(height);
  };
  const updateUserReadNotificationStatus = async (
    status,
    comment,
    requestID,
  ) => {
    // console.log('entity requestID', requestID);
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entityID: requestID,
        userID: parseInt(superVisorID),
        isDelete: true,
      }),
    };
    console.log(
      'requestOptions for UpdateNotificationStatusByEntityID in detail screen' +
        requestOptions.body,
    );
    console.log('=======token====== ' + token);
    await fetch(
      BASE_URL + 'User/UpdateNotificationStatusByEntityID',
      requestOptions,
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong :: ' + response.status);
        }
      })
      .then(data => {
        let json = data;
        console.log('json response for update read in detail--', json);
        if (json.responseCode == 200) {
          if (json.data.isSuccess) {
            // console.log(
            //   `status-${status}, comment-${comment},requestId-${requestID}`,
            // );
            callApiForAccptReject(status, comment, requestID);
          } else {
            Alert.alert('Alert!', 'Unable to update status. Please try later.');
          }
          console.log('noti json stringfy ' + JSON.stringify(json));
        } else {
          Alert.alert('Alert!', json.responseMessage);
        }
      })
      .catch(error => {
        console.log('niotifi ERROR: ' + error);
      })
      .finally(() => {
        // setLoading(false);
      });
  };
  const callApiForAccptReject = async (status, comment, requestId) => {
    console.log(
      `requestId -${requestId}, status - ${status}, comment - ${comment} superVisorID -${superVisorID}`,
    );
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        supervisorID: parseInt(superVisorID),
        requestID: requestId,
        status: status,
        comment: comment,
      }),
    };
    console.log('JSON request body for accept or recject', requestOptions.body);
    await fetch(BASE_URL + 'Attendance/RequestApproval', requestOptions)
      .then(response => {
        console.log('res-' + response.ok);
        if (response.ok) {
          // console.log('passing response.json() after accep/Reject');
          return response.json();
        } else {
          throw new Error('Something went wrong :: ' + response.status);
        }
      })
      .then(data => {
        console.log('responseCode' + data.responseCode);
        let json = data;
        if (json.responseCode == 200) {
          console.log('json.data ---', json.data);
          setLoading(false);
          console.log('updating from child', notiID);
          // onDataReceived(notiID);
          route.params.onDataReceived(notiID);
          if (status === 1) {
            Alert.alert(
              'Accepted!',
              // "Request ID - " + requestId + " has been approved.",
              `Request ID - ${requestId} has been approved`,
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    //navigate user to notification list and update array
                    // onDataReceived(notiID);
                    navigation.goBack(null);
                  },
                },
              ],
            );
          } else {
            Alert.alert(
              'Rejected!',
              // "Request ID - " + requestId + " has been rejected.",
              `Request ID - ${requestId} has been rejected`,
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    //navigate user to back screen and update array status
                    // onDataReceived(notiID);
                    navigation.goBack(null);
                  },
                },
              ],
            );
          }
        } else {
          Alert.alert('Alert!', json.responseMessage);
        }
      })
      .catch(error => {
        console.log('==ERROR== : ' + error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
            <View style={loginPageStyles.container}>
                <StatusBar barStyle="default"
                    backgroundColor="#FA0F0A" />
                <View style={{ flexDirection: 'column', flex: 1, marginTop: -15 }}>
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
                                Approval
                            </Text>
                        </View>
                    </TouchableNativeFeedback >
          <KeyboardAwareScrollView
            style={{marginBottom:10}}
            enableOnAndroid={true}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <View style={{alignItems: 'center'}}>
                <View style={superVisorEmployeeRequestStyles.list_contain}>
                  <View style={superVisorEmployeeRequestStyles.top_view}>
                    <View onLayout={onLayout} style={{flex: 4}}>
                      <Text style={historyPageStyles.title_text}>
                        {props.requestId}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={historyPageStyles.employee_name_text_1}>
                        {props.userName}
                      </Text>
                      <Text style={historyPageStyles.employee_name_text}>
                        {props.userID}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={historyPageStyles.employee_name_text_temp_1}>
                        {props.designation}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: 'red',
                        height: item_height - 20,
                        width: 1,
                        alignSelf: 'center',
                      }}
                    />
                    <View
                  style={{
                    flex: 4,
                    textAlign: 'right',
                    alignItems: 'center',
                    height: item_height,
                    justifyContent: 'center',
                  }}>
                  <Text style={superVisorEmployeeRequestStyles.clock_text}>
                    {props.requestType}
                  </Text>
                  <Text style={superVisorEmployeeRequestStyles.text_datetime}>
                    {props.startDate}, {props.startTime}
                  </Text>
                </View>
              </View>
              <Image
                style={superVisorEmployeeRequestStyles.image}
                source={{uri: props.imagePath}}
              />
              <View style={superVisorEmployeeRequestStyles.item_views_top}>
                <View style={superVisorEmployeeRequestStyles.image_bg}>
                  <Image
                    style={historyPageStyles.item_icons_site_visit}
                    source={require('../assets/images/bag.png')}
                  />
                  <View style={superVisorEmployeeRequestStyles.right_line} />
                </View>
                <Text
                  style={superVisorEmployeeRequestStyles.employee_name_text_3}>
                  {props.workType}
                </Text>
              </View>
              <View style={superVisorEmployeeRequestStyles.item_views}>
                <View style={superVisorEmployeeRequestStyles.image_bg}>
                  <Image
                    style={historyPageStyles.item_icons_site_visit}
                    source={require('../assets/images/ic_shop.png')}
                  />
                  <View style={superVisorEmployeeRequestStyles.right_line} />
                </View>
                <Text
                  style={superVisorEmployeeRequestStyles.employee_name_text_3}>
                  {props.shopName}
                </Text>
              </View>
              <View style={superVisorEmployeeRequestStyles.item_views_bottom}>
                <View style={superVisorEmployeeRequestStyles.image_bg}>
                  <Image
                    style={historyPageStyles.item_icons_site_visit}
                    source={require('../assets/images/pin.png')}
                  />
                  <View style={superVisorEmployeeRequestStyles.right_line} />
                </View>
                <Text
                  style={superVisorEmployeeRequestStyles.employee_name_text_3}>
                  {props.location}
                </Text>
              </View>
              <Text style={superVisorEmployeeRequestStyles.remarks_heading}>
                Remarks
              </Text>
              <Text style={superVisorEmployeeRequestStyles.remarks_text}>
                {props.remark}
              </Text>
            </View>
            <View style={superVisorEmployeeRequestStyles.button_content}>
              <TouchableOpacity
                onPress={() => {
                  // navigation.navigate('SuperVisorRejectedRequest')
                  // setRequestId(item.requestId);
                  setRejectedPopupVisible(true);
                }}
                style={superVisorEmployeeRequestStyles.button_reject}>
                <Text style={superVisorEmployeeRequestStyles.text_reject}>
                  Reject
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // setLoading(true);
                  // setRequestId(item.requestId);
                  // console.log('props.reqID', props.requestId);
                      // callApiForAccptReject(1, '', props.requestId);
                      Alert.alert('Alert!',
                        'Are you sure, you want to approve the request.',
                    [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            {
                                text: "Approve",
                                onPress: () => {
                                    NetInfo.fetch().then(state => {
                                        if (state.isConnected) {
                                          setLoading(true);
                                          // callApiForAccptReject(1, '', props.requestId);
                                          updateUserReadNotificationStatus(1, '', props.requestId);
                                        } else {
                                            Alert.alert(
                                                'Alert!',
                                                '(Offline) No internet connection. Please try again later.',
                                              );
                                        }
                                    })
                                }
                            }
                        ]
                    )
                }}
                style={superVisorEmployeeRequestStyles.button_accept}>
                <Text style={superVisorEmployeeRequestStyles.text_accept}>
                  Approve
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </KeyboardAwareScrollView>
      </View>
      <Modal
        isVisible={isRejectPopupVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        useNativeDriver={true}>
        <View style={alertStyles.alertBg}>
          <TextInput
            multiline
            style={EmployeesUploadDocumentsPageStyles.input}
            keyboardType="default"
            placeholder="Please add you comment here."
            placeholderTextColor="#e0e0e0"
            maxLength={50}
            numberOfLines={2}
            onChangeText={value => setComment(value)}
          />
          <View style={alertStyles.alertButtonsLayout}>
            <TouchableOpacity
              onPress={() => setRejectedPopupVisible(false)}
              style={superVisorEmployeeRequestStyles.button_cancel}>
              <Text style={superVisorEmployeeRequestStyles.text_reject}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log('Request ID: ' + props.requestId);
                console.log('comment: ' + comment);
                if (comment != '') {
                    setLoading(true);
                    setRejectedPopupVisible(false);
                    // callApiForAccptReject(2, comment, props.requestId);
                    updateUserReadNotificationStatus(
                      2,
                      comment,
                      props.requestId,
                    );
                } else {
                  Alert.alert('Alert!', 'Comment should not be empty.');
                }
              }}
              style={superVisorEmployeeRequestStyles.button_reject}>
              <Text style={superVisorEmployeeRequestStyles.text_reject}>
                Reject
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={loading}
        style={{
          position: 'relative',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color={'#fff'} />
      </Modal>
      </View>
    </SafeAreaView>
  );
};

export default SuperVisorNotificationDetail;
