import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  Button,
  Pressable,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import TrackPlayer, {
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  Capability,
} from "react-native-track-player";

import Ionicons from "@expo/vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import initialSongs from "../model/data";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

function SelectEmotion() {
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const currentTrack = TrackPlayer;

  const scrollX = useRef(new Animated.Value(0)).current;
  const [songIndex, setSongIndex] = useState(0);
  const songSlider = useRef(null);

  const navigation = useNavigation();

  const [songs, setSongs] = useState([
    ...initialSongs.sad,
    ...initialSongs.happy,
  ]);

  async function setup() {
    try {
      await TrackPlayer.setupPlayer({});
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
          Capability.SeekTo,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
    } catch (e) {
      console.log(e);
    }
  }

  const togglePlayback = async () => {
    if (currentTrack != null) {
      console.log(playbackState.state);
      if (playbackState.state == "playing") {
        console.log(playbackState);
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    }
  };

  const addTracks = async () => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add(songs);
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    } catch (e) {
      console.log(e);
    }
  };

  const skipTo = async (trackId) => {
    await TrackPlayer.skip(trackId);
  };

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        await setup();
        await addTracks();
      } catch {
        console.log("error");
      }

      scrollX.addListener(({ value }) => {
        const index = Math.round(value / width);
        skipTo(index);
        setSongIndex(index);
      });
    };

    initializePlayer();

    return () => {
      TrackPlayer.pause();
      scrollX.removeAllListeners();
    };
  }, []);

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };
  const skipToBack = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  useEffect(() => {
    console.log(progress.position);
    if (progress.position > 0 && progress.position >= 30.0) {
      console.log("Song Ended");
      resetSong();
    }
  }, [progress.position]);

  const resetSong = () => {
    TrackPlayer.seekTo(0);
  };

  const songsRender = ({ index, item }) => {
    return (
      <Animated.View style={styles.songScroler}>
        <View style={styles.songImageWrapper}>
          <Image source={item.image} style={styles.songImage} />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.maincontainer}>
        <View style={{ width: width }}>
          <Animated.FlatList
            ref={songSlider}
            data={songs}
            renderItem={songsRender}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { x: scrollX },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
          />
        </View>
        <View>
          <Text style={styles.title}>{songs[songIndex].title}</Text>
          <Text style={styles.artist}>{songs[songIndex].artist}</Text>
        </View>
        <View>
          <Slider
            style={styles.soundBarContainer}
            value={progress.position}
            minimumValue={0}
            maximumValue={30.0}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#FFFFFF"
            onSlidingComplete={async (value) => {
              TrackPlayer.seekTo(value);
            }}
          />
        </View>
        <View style={styles.musicPlayerControll}>
          <TouchableOpacity onPress={() => togglePlayback()}>
            <Ionicons
              name={
                playbackState.state == "playing"
                  ? "pause-circle-outline"
                  : "play-circle-outline"
              }
              size={50}
              color="#09e0d2"
            ></Ionicons>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.emotionContainer}>
        <View style={styles.emotionButtonContainer}>
          <Pressable style={styles.emotionButton} onPress={() => skipToNext()}>
            <Text style={styles.emotionButtonText}>😡</Text>
          </Pressable>
          <Pressable style={styles.emotionButton} onPress={() => skipToNext()}>
            <Text style={styles.emotionButtonText}>🤢</Text>
          </Pressable>
          <Pressable style={styles.emotionButton} onPress={() => skipToNext()}>
            <Text style={styles.emotionButtonText}>😱</Text>
          </Pressable>
          <Pressable style={styles.emotionButton} onPress={() => skipToNext()}>
            <Text style={styles.emotionButtonText}>😊</Text>
          </Pressable>
          <Pressable style={styles.emotionButton} onPress={() => skipToNext()}>
            <Text style={styles.emotionButtonText}>😐</Text>
          </Pressable>
          <Pressable style={styles.emotionButton} onPress={() => skipToNext()}>
            <Text style={styles.emotionButtonText}>😞</Text>
          </Pressable>
          <Pressable style={styles.emotionButton} onPress={() => skipToNext()}>
            <Text style={styles.emotionButtonText}>😮</Text>
          </Pressable>
        </View>
        <Text style={styles.emotionText}>Select Emotion</Text>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.bottomButtons}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back-outline"
              size={30}
              color="#ffff"
            ></Ionicons>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
export default SelectEmotion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
  },
  maincontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    borderTopColor: "#393E46",
    borderTopWidth: 1,
    width: width,
    alignItems: "center",
    paddingVertical: 15,
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  songImageWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,
    elevation: 5,
  },
  songImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#EEEEEE",
  },
  artist: {
    fontSize: 16,
    fontWeight: "200",
    textAlign: "center",
    color: "#EEEEEE",
  },
  soundBarContainer: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: "row",
  },
  soundBarLableContainer: {
    width: 340,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  soundBarLableText: {
    color: "#ffff",
  },
  musicPlayerControll: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 15,
  },
  musicPlayerSkipButtons: {
    marginTop: 9,
  },
  songScroler: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },

  emotionContainer: {
    display: "flex",
    height: 120,
    flexDirection: "column",
    alignItems: "center",
  },
  emotionText: {
    color: "#EEE",
    fontSize: 20,
    fontWeight: "bold",
  },
  emotionButtonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emotionButton: {
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    padding: 5,
    margin: 5,
    borderRadius: 5,
  },
  emotionButtonText: {
    color: "#EEE",
    fontSize: 20,
    fontWeight: "bold",
  },
});
