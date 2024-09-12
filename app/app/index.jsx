import React from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import AudioToIsl from "./AudioToIsl.jsx";
import { Link } from "expo-router";
import { Button } from "react-native-paper";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Silent Bridge</Text>
      <Link href="/IslToAudio" style={{ marginBottom: 15 }}>
        <Button mode="outlined">
          <Text style={styles.BtnText}>ISL to Audio</Text>
        </Button>
      </Link>
      <Link href="/AudioToIsl" style={{ marginBottom: 15 }}>
        <Button mode="outlined">
          <Text style={styles.BtnText}>Audio to ISL</Text>
        </Button>
      </Link>
      {/* <AudioToIsl /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  BtnText: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
  },
  heading: {
    fontSize: 50,
    marginBottom: 30,
  },
  clearBTN: {
    marginTop: 20,
  },
  clearBTN: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#green",
    backgroundColor: "#green",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 40,
  },
  fill: {
    flex: 1,
    margin: 15,
  },
  scrollContainer: {
    height: 200,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    justifyItems: "center",
    marginVertical: 20,
    width: "90%",
  },
  slide: {
    // flex: 0.3,
    height: 20,
  },
  scrollContainer: {
    height: 200,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    justifyItems: "center",
    marginVertical: 20,
    width: "90%",
  },
  slide: {
    // flex: 0.3,
    height: 20,
  },
  image: {
    marginTop: 20,
    // flex: 1,
    // flex: 1,
    width: 200,
    height: 200,
    margin: 10,
    margin: 10,
    backgroundColor: "red",
  },
});
