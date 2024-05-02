// import React, {createContext, useState, useContext} from 'react';

// // interface ProfileImageContextType {
// //   profileImage: string | null;
// //   setProfileImage: Dispatch<SetStateAction<string | null>>;
// // }

// // Provide an initial default value matching the type
// const defaultContextValue = {
//   profileImage: null,
//   setProfileImage: () => {}, // This is a no-op function matching the signature
// };

// const ProfileImageContext = createContext(defaultContextValue);

// export const useProfileImage = () => useContext(ProfileImageContext);

// export const ProfileImageProvider = ({children}) => {
//   const [profileImage, setProfileImage] = (useState < string | (null > null)

//   return (
//     <ProfileImageContext.Provider value={{profileImage, setProfileImage}}>
//       {children}
//     </ProfileImageContext.Provider>
//   );
// };

// export default ProfileImageProvider;

import React, {createContext, useContext, useState, useEffect} from 'react';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({children}) => {
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(true);
  const [timers, setTimers] = useState([]);

  const startTimer = () => {
    stopTimer();
    console.log('Timer started Here...');
    setTimerExpiredToFalse();

    if (!intervalId) {
      const id = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
      setIntervalId(id);
      setTimers(prevTimers => [...prevTimers, id]);
    }
  };

  const stopTimer = () => {
    console.log('Total Timer running count -- ', timers.length);
    timers.forEach(timerId => {
      clearInterval(timerId); // Clear each timer using clearInterval
    });
    setTimers([]); // Clear the timers array

    setTimer(0);
    clearInterval(intervalId);
    setIntervalId(null);
    console.log('Timer stopped ....');
    setTimerExpiredToTrue();
  };
  const setTimerExpiredToTrue = () => {
    setSessionExpired(true);
  };
  const setTimerExpiredToFalse = () => {
    setSessionExpired(false);
  };

  useEffect(() => {
    if (timer >= 40) {
      stopTimer();
    }
  }, [timer, stopTimer]);

  return (
    <TimerContext.Provider
      value={{
        timer,
        sessionExpired,
      }}>
      {children}
    </TimerContext.Provider>
  );
};
