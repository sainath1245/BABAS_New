import 'react-native-gesture-handler';
import * as React from 'react';
import {Provider} from 'react-redux';
import {
  createAttendanceTypeTabel,
  createUserTabel_1,
} from './database/local_database';
import {openDatabase} from 'react-native-sqlite-storage';
import {useEffect} from 'react';
import MainNavigation from './src/utils/navigation';
// import {NativeBaseProvider} from 'native-base';
import notificationStore from './notification_redux/notificationStore';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import {AppState} from 'react-native';
// import { GluestackUIProvider } from '@gluestack-ui/themed';
// import { config } from '@gluestack-ui/config';
import {Provider as PaperProvider} from 'react-native-paper';

var db = openDatabase({name: 'BABAS_DB.db'});

const App = () => {
  const appState = AppState.currentState;

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App has returned from the background
        notifee.setBadgeCount(0);
      } else if (
        appState === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        // App has entered the background
        notifee.setBadgeCount(0);
      }
    };
    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      // Unsubscribe from app state changes when component unmounts
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // createUserTabel(db)
    createUserTabel_1(db);
    // createClockTabel(db);
    createAttendanceTypeTabel(db);

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // var notificationCount = parseInt(notificationStore.getState().count) + 1;
      // notificationStore.dispatch({
      //   type: 'COUNT_CHANGE',
      //   payload: {count: notificationCount + ''},
      // });
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      // Display the notification
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'New Notification',
        body: remoteMessage.notification?.body || 'You have a new message',
        android: {
          channelId: 'default',
          pressAction: {id: 'default'}, // Tap opens the app
          smallIcon: 'ic_launcher', // default app icon
        },
      });
    });
    return unsubscribe;
  }, []);

  return (
    // <NativeBaseProvider>
    // <GluestackUIProvider config={config}>
    <PaperProvider>
      <Provider store={notificationStore}>
        <MainNavigation />
      </Provider>
      {/* </NativeBaseProvider> */}
      {/* </GluestackUIProvider> */}
    </PaperProvider>
  );
};

export default App;

// import { Text, View } from 'react-native';

// const App = () => {
//   // Remove any state that might conditionally render components
//   // const [isLoading, setIsLoading] = useState(true);
//   return (
// <View>
// <Text>Test Text Only</Text>
// </View>
//   );
// };

// export default App;
