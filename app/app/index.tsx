import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Button,
  Platform,
} from "react-native";
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from "react-native-audio-recorder-player";
class Home extends Component {
  audioRecorderPlayer: AudioRecorderPlayer;
  constructor(props: {}) {
    super(props);
    this.state = {
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: "00:00:00",
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: "00:00:00",
      duration: "00:00:00",
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }
  //   const [audioRecorderPlayer, setAudioRecorderPlayer] = useState(
  //     new AudioRecorderPlayer()
  //   );
  //   useEffect(() => {
  //     async function requestPermission() {
  //       if (Platform.OS === "android") {
  //         try {
  //           const grants = await PermissionsAndroid.requestMultiple([
  //             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //             PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //           ]);

  //           console.log("write external storage", grants);

  //           if (
  //             grants["android.permission.WRITE_EXTERNAL_STORAGE"] ===
  //               PermissionsAndroid.RESULTS.GRANTED &&
  //             grants["android.permission.READ_EXTERNAL_STORAGE"] ===
  //               PermissionsAndroid.RESULTS.GRANTED &&
  //             grants["android.permission.RECORD_AUDIO"] ===
  //               PermissionsAndroid.RESULTS.GRANTED
  //           ) {
  //             console.log("Permissions granted");
  //           } else {
  //             console.log("All required permissions not granted");
  //             return;
  //           }
  //         } catch (err) {
  //           console.warn(err);
  //           return;
  //         }
  //       }
  //     }
  //     requestPermission();
  //   });

  // render  = () => (
  //     <Card style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center', alignSelf: 'center' }}>
  //       <Background>
  //         <Logo />
  //         <Header>InstaPlayer</Header>
  //         <Title>{this.state.recordTime}</Title>
  //         <Button mode="contained" icon="record" onPress={() => this.onStartRecord()}>
  //           RECORD
  //       </Button>
  //         <Button
  //           icon="stop"
  //           mode="outlined"
  //           onPress={() => this.onStopRecord()}
  //         >
  //           STOP
  //   </Button>
  //         <Divider />
  //         <Title>{this.state.playTime} / {this.state.duration}</Title>
  //         <Button mode="contained" icon="play" onPress={() => this.onStartPlay()}>
  //           PLAY
  //       </Button>
  //         <Button
  //           icon="pause"
  //           mode="contained"
  //           onPress={() => this.onPausePlay()}
  //         >
  //           PAUSE
  //   </Button>
  //         <Button
  //           icon="stop"
  //           mode="outlined"
  //           onPress={() => this.onStopPlay()}
  //         >
  //           STOP
  //   </Button>
  //       </Background>
  //     </Card>
  //   )
  //   return (
  //     <View style={styles.container}>
  //       <Button title="start record" onPress={onStartRecord} />
  //       <Button title="stop record" onPress={onStopRecord} />
  //       <Button title="pause record" onPress={onPausePlay} />
  //       <Button title="stop record" onPress={onStopPlay} />
  //       <Button title="start play" onPress={onStartPlay} />
  //       <Text>Home Page</Text>
  //     </View>
  //   );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
