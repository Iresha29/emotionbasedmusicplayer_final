import "react-native-gesture-handler";
import "react-native-screens";
import { registerRootComponent } from "expo";
import App from "./App";
import TrackPlayer from "react-native-track-player";

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => require("./service.js"));
