import 'react-native-gesture-handler';
import * as React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import MyStack from './src/utils/navigation';
// import MyStack1 from './src/utils/navigation';
import {Provider} from 'react-redux';
import {
  createAttendanceTypeTabel,
  createClockTabel,
  createUserTabel_1,
} from './database/local_database';
import {openDatabase} from 'react-native-sqlite-storage';
import {useEffect} from 'react';
import MainNavigation from './src/utils/navigation';
import {NativeBaseProvider} from 'native-base';
import notificationStore from './notification_redux/notificationStore';
import messaging from '@react-native-firebase/messaging';
// import {AppState} from 'react-native';

var db = openDatabase({name: 'BABAS_DB.db'});

const App = () => {
  // const [isBackground, setIsBackground] = useState(false);
  // const [appPreviousState, setAppPreviousState] = useState();
  // const [dataArray, setDataArray] = useState([]);
  // const navigation = useNavigation();

  // useEffect(() => {
  //   const handleAppStateChange = nextAppState => {
  //     setIsBackground(nextAppState === 'background');
  //     // console.log('prevState', prevState);
  //   };
  //   AppState.addEventListener('change', handleAppStateChange);

  //   const handlePrevAppStateChange = prevState => {
  //     setAppPreviousState(prevState === 'background');
  //   };
  //   AppState.addEventListener('change', handlePrevAppStateChange);

  //   return () => {
  //     AppState.addEventListener('change', handleAppStateChange);
  //     AppState.addEventListener('change', handlePrevAppStateChange);
  //   };
  // }, []);

  useEffect(() => {
    // createUserTabel(db)
    createUserTabel_1(db);
    createClockTabel(db);
    createAttendanceTypeTabel(db);

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      var notificationCount = parseInt(notificationStore.getState().count) + 1;
      notificationStore.dispatch({
        type: 'COUNT_CHANGE',
        payload: {count: notificationCount + ''},
      });
    });
    return unsubscribe;
  }, []);

  // setTimeout(() => {
  //   if (
  //     appPreviousState !== undefined &&
  //     appPreviousState === false &&
  //     isBackground
  //   ) {
  //     console.log('App eneterd foreground');
  //     getUserDataFromLocalDB();
  //   }
  // }, 2000);
  // function getUserDataFromLocalDB() {
  //   db.transaction(tx => {
  //     tx.executeSql('SELECT * FROM user', [], (tx, results) => {
  //       var temp = [];
  //       for (let i = 0; i < results.rows.length; ++i) {
  //         temp.push(results.rows.item(i));
  //       }
  //       console.log('user details from DB', temp);
  //       if (temp.length > 0) {
  //         // console.log('temp length', temp.length);
  //         setDataArray(temp);
  //         // setTimeout(() => {
  //         //   navigateUserToHomeScreen();
  //         // }, 2000);
  //         navigateUserToHomeScreen();
  //       } else {
  //         console.log(
  //           'No user logged In, so user will not navigate to any screen',
  //         );
  //       }
  //     });
  //   });
  // }
  // // console.log('props', props);
  // function navigateUserToHomeScreen() {
  //   console.log('App entered navigateUserToHomeScreen');
  //   // console.log('navigation in App screen', navigation);
  //   console.log('dataArray', dataArray[0]);
  //   // console.log('props.navigation', props.navigation);
  //   if (dataArray[0].userRole === 3) {
  //     navigation.reset({
  //       index: 0,
  //       routes: [
  //         {
  //           name: 'EmployeesHomeDrawer',
  //           screen: 'Home',
  //         },
  //       ],
  //     });
  //   } else if (dataArray[0].userRole === 2) {
  //     navigation.reset({
  //       index: 0,
  //       routes: [
  //         {
  //           name: 'SuperVisorHomeDrawer',
  //           screen: 'Home',
  //         },
  //       ],
  //     });
  //   } else if (dataArray[0].userRole === 1) {
  //     navigation.reset({
  //       index: 0,
  //       routes: [
  //         {
  //           name: 'AdminHomeDrawer',
  //           screen: 'AdminDashboard',
  //         },
  //       ],
  //     });
  //   }
  // }

  return (
    <NativeBaseProvider>
      <Provider store={notificationStore}>
        <MainNavigation />
      </Provider>
    </NativeBaseProvider>
  );
};

export default App;
