// import { useState } from "react";
// import { View, StyleSheet, Button } from "react-native";
// import AudioRecord from "react-native-audio-record";
// // import { SpeechToText } from "react-native-watson";
// import { Audio } from "expo-av";
// import App from "./app";
// const options = {
//   sampleRate: 32000, // default is 44100 but 32000 is adequate for accurate voice recognition
//   channels: 1, // 1 or 2, default 1
//   bitsPerSample: 16, // 8 or 16, default 16
//   audioSource: 6, // android only (see below)
//   bufferSize: 4096, // default is 2048
// };
// export default function Home() {
//   const [sound, setSound] = useState();
//   const [uria, setUri] = useState();
//   const [recording, setRecording] = useState();
//   const [permissionResponse, requestPermission] = Audio.usePermissions();
//   const options = {
//     sampleRate: 16000, // default 44100
//     channels: 1, // 1 or 2, default 1
//     bitsPerSample: 16, // 8 or 16, default 16
//     audioSource: 6, // android only (see below)
//     wavFile: "test.wav", // default 'audio.wav'
//   };
//   // async function uploadChunksToServer(recordingInstance, chunkSize, delayBetweenChunks) {
//   //   let info = await FileSystem.getInfoAsync(recordingInstance.getURI());
//   //   let uri = info.uri;
//   //   let currentPosition = 0;
//   //   let current_file_size = info.size;
//   //   let prev_pos = 0;
//   //   await sleep(delayBetweenChunks);

//   //   do{

//   //     try{

//   //       let info = await FileSystem.getInfoAsync(recordingInstance.getURI());
//   //       current_file_size = info.size;

//   //         if (currentPosition + chunkSize >= current_file_size &&  currentPosition === prev_pos && prev_pos !== 0){
//   //           console.log('blocked')
//   //           continue;
//   //         }
//   //         else{
//   //           const fileChunk = await FileSystem.readAsStringAsync(uri, {
//   //               encoding: FileSystem.EncodingType.Base64,
//   //             })
//   //             currentPosition += chunkSize;
//   //             socket.emit('audioData', fileChunk);
//   //           }
//   //           prev_pos = currentPosition;
//   //     }
//   //     catch (e) {
//   //       console.log(e);
//   //     }
//   //     if (recordingInstance._isDoneRecording && current_file_size - currentPosition < chunkSize){
//   //           const fileChunk = await FileSystem.readAsStringAsync(uri, {
//   //           encoding: FileSystem.EncodingType.Base64,
//   //           position: currentPosition,
//   //           length: current_file_size - currentPosition
//   //         })
//   //         currentPosition += current_file_size - currentPosition;
//   //         socket.emit('recording', fileChunk);
//   //         break
//   //       }
//   //   } while(currentPosition < current_file_size)

//   //   console.log("final report >> ", currentPosition, current_file_size)
//   //   console.log('exiting')

//   //    const fileChunk = await FileSystem.readAsStringAsync(uri, {
//   //     encoding: FileSystem.EncodingType.Base64,
//   //   })
//   //   socket.emit('done_recording', fileChunk);

//   // }

//   // async function startRecording() {
//   //   try {
//   //     if (permissionResponse.status !== "granted") {
//   //       console.log("Requesting permission..");
//   //       await requestPermission();
//   //     }
//   //     // LiveAudioStream.init(options);
//   //     // LiveAudioStream.on("data", (data) => {
//   //     //   // base64-encoded audio data chunks
//   //     // });
//   //     // LiveAudioStream.init(options);

//   //     // LiveAudioStream.start();

//   //     // LiveAudioStream.stop();
//   //     // or to get the wav file path
//   //     // let audioFile = await LiveAudioStream.stop();

//   //     // LiveAudioStream.on("data", (data) => {
//   //     //   // base64-encoded audio data chunks
//   //     // });

//   //     SpeechToText.initialize("username", "password");

//   //     // will transcribe microphone audio
//   //     SpeechToText.startStreaming((error, text) => {
//   //       console.log(text);
//   //     });

//   //     SpeechToText.stopStreaming();

//   //     // await Audio.setAudioModeAsync({
//   //     //   allowsRecordingIOS: true,
//   //     //   playsInSilentModeIOS: true,
//   //     // });

//   //     // console.log("Starting recording..");
//   //     // const { recording } = await Audio.Recording.createAsync(
//   //     //   Audio.RecordingOptionsPresets.HIGH_QUALITY
//   //     // );
//   //     // setRecording(recording);
//   //     // console.log("Recording started");
//   //   } catch (err) {
//   //     console.error("Failed to start recording", err);
//   //   }
//   // }
//   async function playSound() {
//     console.log("Loading Sound");
//     const sound = new Audio.Sound();
//     if (uria) {
//       await sound.loadAsync({
//         uri: uria,
//         //   shouldPlay: true,
//       });
//     }
//     await sound.playAsync();
//   }
//   async function stopRecording() {
//     console.log("Stopping recording..");
//     setRecording(undefined);
//     await recording.stopAndUnloadAsync();
//     await Audio.setAudioModeAsync({
//       allowsRecordingIOS: false,
//     });
//     const uri = recording.getURI();
//     setUri(uri);
//     console.log("Recording stopped and stored at", uri);
//   }

//   return (
//     <View style={styles.container}>
//       <App />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     backgroundColor: "#ecf0f1",
//     padding: 10,
//   },
// });

import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import { socket, uploadChunksToServer } from "./socket.js";

export default function App() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [sending, setSending] = useState(false);
  const [recordingBackLog, setRecordingBackLog] = useState([]);

  const [isRecording, setIsRecording] = React.useState(false);
  const [prevLen, setPrevLen] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  let sum = 0;
  let p_len = 0;

  //   useEffect(() => {
  //     if (socket.connected) {
  //       onConnect();
  //     }

  //     function onConnect() {
  //       setIsConnected(true);
  //       setTransport(socket.io.engine.transport.name);

  //       socket.io.engine.on('upgrade', (transport) => {
  //         setTransport(transport.name);
  //       });
  //     }

  //     function onDisconnect() {
  //       setIsConnected(false);
  //       setTransport('N/A');
  //     }

  //     socket.on('connect', onConnect);
  //     socket.on('disconnect', onDisconnect);

  //     return () => {
  //       socket.off('connect', onConnect);
  //       socket.off('disconnect', onDisconnect);
  //     };
  //   }, []);

  const convertMP4ToBase64 = async (uri, delay = 0) => {
    try {
      // Read the file
      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
        position: 0,
        length: 100,
      });

      // Introduce optional delay (if delay is a positive number)
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      return fileContent;
    } catch (error) {
      console.error("Error converting MP4 to base64:", error);
      return null;
    }
  };

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recordingInstance = new Audio.Recording();
        await recordingInstance.prepareToRecordAsync({
          android: {
            extension: ".wav",
            linearPCMIsBigEndian: false,
          },
          ios: {
            extension: ".wav",
            linearPCMIsBigEndian: false,
          },
        });

        await recordingInstance.startAsync();

        setRecording(recordingInstance);
        setRecordingBackLog((prevBackLog) => [
          ...prevBackLog,
          recordingInstance,
        ]);
        console.log(recordingInstance);
        // await uploadChunksToServer(recordingInstance, 96000, 950);

        recordingInstance.setOnRecordingStatusUpdate(async (status) => {});
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setPrevLen(0);
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      let allRecordings = [...recordings];
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      allRecordings.push({
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
      });
      setRecordings(allRecordings);
    } catch (err) {
      console.error("Failed to stop recording", err);
    } finally {
      setRecording(undefined);
    }
  }

  function getDurationFormatted(milliseconds) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10
      ? `${Math.floor(minutes)}:0${seconds}`
      : `${Math.floor(minutes)}:${seconds}`;
  }

  function toggleRecording() {
    setIsRecording((prevState) => !prevState);
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording #{index + 1} | {recordingLine.duration}
          </Text>
          <Button
            onPress={() => recordingLine.sound.replayAsync()}
            title="Play"
          ></Button>
          <Button title="Send Recording to Backend" />
        </View>
      );
    });
  }

  function clearRecordings() {
    setRecordings([]);
  }

  return (
    <View style={styles.container}>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {getRecordingLines()}
      <Button
        title={recordings.length > 0 ? "Clear Recordings" : ""}
        onPress={clearRecordings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 40,
  },
  fill: {
    flex: 1,
    margin: 15,
  },
});
