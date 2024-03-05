import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MyStack from './src/utils/navigation';
import MyStack1 from './src/utils/navigation';
import { Provider } from "react-redux";
import { createAttendanceTypeTabel, createClockTabel, createUserTabel, createUserTabel_1 } from './database/local_database'
import { openDatabase } from 'react-native-sqlite-storage';
import { useEffect } from 'react'
import MainNavigation from './src/utils/navigation';
import { NativeBaseProvider } from 'native-base';
import notificationStore from './notification_redux/notificationStore';
import messaging from '@react-native-firebase/messaging';

var db = openDatabase({ name: 'BABAS_DB.db' });

const App = (() => {

  useEffect(() => {
    // createUserTabel(db)
    createUserTabel_1(db)
    createClockTabel(db)
    createAttendanceTypeTabel(db)

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      var notificationCount = parseInt(notificationStore.getState().count) + 1;
      notificationStore.dispatch({
        type: "COUNT_CHANGE",
        payload: { count: notificationCount + '' }
      });
    });
    return unsubscribe;
  }, [])

  return (
    <NativeBaseProvider>
      <Provider store={notificationStore}>
        <MainNavigation />
      </Provider>
    </NativeBaseProvider>
  );
})

export default App;