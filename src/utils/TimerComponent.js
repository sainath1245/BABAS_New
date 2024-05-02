// import React, { useState, useEffect } from 'react';
// import { View, Text, Button } from 'react-native';

// const Timer = ({ startTimer }) => {
//   const [seconds, setSeconds] = useState(60); // Start with 60 seconds

//   useEffect(() => {
//     let intervalId;

//     if (startTimer) {
//       // Only start the timer if startTimer is true and seconds > 0
//       if (seconds === 0) return;

//       // Decrease seconds by one every second
//       intervalId = setInterval(() => {
//         setSeconds((prevSeconds) => prevSeconds - 1);
//       }, 1000);
//     }

//     // Cleanup function to clear the interval when the component unmounts
//     // or if the `startTimer` prop changes to false.
//     return () => clearInterval(intervalId);
//   }, [startTimer, seconds]);

//   const resetTimer = () => {
//     setSeconds(60); // Reset the timer to 60 seconds
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 30, textAlign: 'center', margin: 10 }}>{seconds}</Text>
//       {startTimer && <Button title="Reset Timer" onPress={resetTimer} />}
//     </View>
//   );
// };

// export default Timer;

// TimerFunction.js

import React, { useState, useEffect } from 'react';

/**
 * Starts a timer that counts down from 300 seconds (5 minutes) if the given condition is true.
 * The timerEndCallback is called when the timer ends.
 * 
 * @param {boolean} startCondition - Whether or not to start the timer.
 * @param {Function} timerEndCallback - A callback function to execute when the timer ends.
 */
// export function startTimerBasedOnCondition(startCondition, timerEndCallback) {
export function startTimerBasedOnCondition(startCondition) {
 const [timerSeconds, setTimerSeconds] = useState(300); // Initial timer value (300 seconds = 5 minutes)
console.log('startTimerBasedOnCondition....');
 useEffect(() => {
  console.log('should start here....');
  let timerId;

  if (startCondition && timerSeconds > 0) {
   console.log('Timer started.');

   // Start the timer
   timerId = setInterval(() => {
    setTimerSeconds(prevSeconds => prevSeconds - 1); // Decrease timer by 1 second
   }, 1000); // Run every 1 second
  } else {
   clearInterval(timerId); // Clear the timer if condition is false or timer reaches 0
   console.log('Timer stopped.');
   // if (timerSeconds === 0 && timerEndCallback && typeof timerEndCallback === 'function') {
   //  timerEndCallback();
   // }
  }

  return () => clearInterval(timerId); // Clear the interval when component unmounts or condition becomes false
 }, [startCondition, timerSeconds]);
}
