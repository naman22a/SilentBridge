import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Button, Icon, MD3Colors } from "react-native-paper";
// import * as FileSystem from "expo-file-system";
// import { socket, uploadChunksToServer } from "./socket.js";
import { Audio } from "expo-av";
import { io } from "socket.io-client";
import * as FileSystem from "expo-file-system";

// let socket = io("http://localhost:5000"); // use the IP address of your machine
const socket = io("http://192.168.0.105:5000", { transports: ["websocket"] });
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function uploadChunksToServer(
  recordingInstance,
  chunkSize,
  delayBetweenChunks
) {
  console.log("calling sending");
  await sleep(4000);

  let info = await FileSystem.getInfoAsync(recordingInstance.getURI());
  let uri = info.uri;
  let currentPosition = 0;

  let current_file_size = info.size;
  let prev_pos = 0;

  do {
    try {
      let info = await FileSystem.getInfoAsync(recordingInstance.getURI());
      current_file_size = info.size;

      if (
        currentPosition + chunkSize >= current_file_size &&
        currentPosition === prev_pos &&
        prev_pos !== 0
      ) {
        console.log("blocked");
        continue;
      } else {
        console.log(currentPosition, current_file_size);
        const fileChunk = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
          position: currentPosition,
          length: chunkSize,
        });
        currentPosition += chunkSize;
        socket.emit("audio-stream", { audio: fileChunk });
      }
      prev_pos = currentPosition;
    } catch (e) {
      console.log(e);
    }
    if (
      recordingInstance._isDoneRecording &&
      current_file_size - currentPosition < chunkSize
    ) {
      const fileChunk = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
        position: currentPosition,
        length: current_file_size - currentPosition,
      });
      currentPosition += current_file_size - currentPosition;
      socket.emit("audio-stream", { audio: fileChunk });
      break;
    }
    await sleep(delayBetweenChunks);
  } while (currentPosition < current_file_size);
  console.log("final report >> ", currentPosition, current_file_size);
  console.log("exiting");

  const fileChunk = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  socket.emit("data", fileChunk);
}

export default function App() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [sending, setSending] = useState(false);
  const [recordingBackLog, setRecordingBackLog] = useState([]);
  const [image, setImage] = useState("");

  const [isRecording, setIsRecording] = React.useState(false);
  const [prevLen, setPrevLen] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  let sum = 0;
  let p_len = 0;

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    } else {
      // socket = io("http://localhost:5000", {
      //   secure: true,
      //   transports: ["websocket"],
      // });
      console.log(socket.connected);
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    function handleImageStream(data) {
      // data -> { image: "base64-string" }
      const base64Image = data.image;
      const imageUri = `data:image/png;base64,${base64Image}`;
      setImage(imageUri);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("image-stream", handleImageStream);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

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
        await uploadChunksToServer(recordingInstance, 96000, 950);

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

  function clearRecordings() {
    setRecordings([]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Silent Bridge</Text>
      <Button
        mode="contained"
        onPress={recording ? stopRecording : startRecording}
      >
        {!recording ? (
          <Icon
            source="record-circle-outline"
            color={MD3Colors.error99}
            size={25}
          />
        ) : (
          <Icon source="waveform" color={MD3Colors.error99} size={25} />
        )}
      </Button>
      {image && <Image src={image} alt="ISL" style={styles.image} />}

      {recordings.map((recordingLine, index) => (
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
      ))}

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
  heading: {
    fontSize: 50,
    marginBottom: 30,
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
  image: {
    marginTop: 20,
    width: 200,
    height: 200,
    backgroundColor: "red",
  },
});
