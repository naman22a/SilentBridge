import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import imagePicker from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";

const options2 = {
  title: "Select video",
  mediaType: "video",
  path: "video",
  quality: 1,
};

const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    // selectVideo(result.assets[0].uri);
    console.log(result.assets[0].uri);
    postImage(result.assets[0].uri);
  }
};

const postImage = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: data }),
  };
  try {
    const res = await fetch("http://10.10.35.178:8080/predict", requestOptions);
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

// async function selectVideo(data) {
//   // -i input.flv -ss 00:00:14.435 -frames:v 1 out.png
//   // const ffmpegSession = await FFmpegKit.execute(
//   //   `-i ${data} -vf fps=1/5 thumb.png`
//   // );

//   // const result = await ffmpegSession.getReturnCode();

//   // if (ReturnCode.isSuccess(result)) {
//   //   setLoading(() => false);
//   //   setResult(() => resultVideo);
//   // } else {
//   //   setLoading(() => false);
//   //   console.error(result);
//   // }
//   // FFmpegKit.execute(`-i ${data} -r 1/3 frame%04d.png`).then(async (session) => {
//   FFmpegKit.execute(
//     `-i ${data} -vf "select='eq(pict_type,PICT_TYPE_I)'" -vsync vfr thumb%04d.png`
//   ).then(async (session) => {
//     const returnCode = await session.getReturnCode();

//     if (returnCode.isSuccess(returnCode)) {
//       console.log(returnCode);
//       // SUCCESS
//     } else if (returnCode.isCancel(returnCode)) {
//       console.log(returnCode);
//       // CANCEL
//     } else {
//       console.log("error");
//       // ERROR
//     }
//   });
// }

// import {
//   FFmpegKit,
//   FFmpegKitConfig,
//   ReturnCode,
// } from "ffmpeg-kit-react-native";
const IslToAudio = () => {
  // React.useEffect(() => {
  //   FFmpegKitConfig.init();
  // }, []);
  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        small
        primary
        onPress={() => {
          pickImage();
        }}
      >
        Select Photo
      </Button>
    </View>
  );
};

export default IslToAudio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
  },
});
