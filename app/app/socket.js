import { io } from "socket.io-client";
import * as FileSystem from "expo-file-system";

export const socket = io.connect("ws//localhost:5000"); // use the IP address of your machine

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
