import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

import TrackPlayer, { Capability } from "react-native-track-player";

import MusicPlayer from "./component/MusicPlayer";
import CustomCamera from "./component/CustomCamera";
import SelectEmotion from "./component/SelectEmotion";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import { MoodContext } from "./context/MoodContext";

import LoginPage from "./component/LoginPage";

const Stack = createStackNavigator();

export default function App() {
  const [mood, setMood] = useState("all");

  return (
    <MoodContext.Provider value={{ mood, setMood }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Auth"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Auth" component={LoginPage} />
          <Stack.Screen name="Play" component={MusicPlayer} />
          <Stack.Screen name="Camera" component={CustomCamera} />
          <Stack.Screen name="Select" component={SelectEmotion} />
        </Stack.Navigator>
        <StatusBar style="dark" />
      </NavigationContainer>
    </MoodContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
