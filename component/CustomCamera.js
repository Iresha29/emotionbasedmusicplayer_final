import {
  useCameraPermission,
  useCameraDevice,
  Camera,
} from "react-native-vision-camera";
import { useEffect, useRef, useState } from "react";
import { View, Pressable, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";

import CameraPermissions from "./CameraPermissions";

import { MoodContext } from "../context/MoodContext";

function CustomCamera() {
  const url = "http://51.20.64.60:5000/predict-emotion";

  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef(null); // Using useRef hook to create a ref
  const [currentImage, setCurrentImage] = useState(null);
  const [emotion, setEmotion] = useState(null);

  const device = useCameraDevice("front");

  const { mood, setMood } = useContext(MoodContext);
  const navigate = useNavigation();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [requestPermission]);

  console.log("hasPermission:", hasPermission);

  const captureImage = async () => {
    let photo = null;
    if (camera.current) {
      photo = await camera.current.takePhoto();
      setCurrentImage(photo.path);
      console.log(photo);
    }

    const formData = new FormData();

    const uri = "file://" + photo.path;

    formData.append("file", { uri: uri, name: "photo.jpg", type: "image/jpg" });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      const data = await response.json();
      setEmotion(data.emotion);

      if (
        ["sad", "angry", "disgust", "fear", "neutral"].includes(
          data.emotion?.toLowerCase()
        )
      ) {
        setMood("sad");
      } else {
        setMood("happy");
      }

      navigate.goBack();

      // Write Your Code here for redirections and response handling
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!hasPermission) return <CameraPermissions />;
  if (device == null) return <NoCameraDeviceError />;

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        photo={true}
        isActive={true}
      />
      <View style={styles.captureButtonContainer}>
        <Pressable
          style={styles.captureButton}
          onPress={() => captureImage()}
        ></Pressable>
        {currentImage && (
          <Image
            source={{ uri: "file://" + currentImage }}
            style={styles.capturedImage}
          />
        )}
        <View style={styles.statusText}>
          <Text>{mood}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "relative",
    backgroundColor: "transparent",
  },
  camera: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  captureButtonContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    width: "100%",
    alignItems: "center",
    height: 210,
    bottom: 0,
  },
  captureButton: {
    position: "absolute",
    top: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 60,
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: 5,
    borderRadius: 30,
    elevation: 0,
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 14,
    color: "white",
    backgroundColor: "transparent",
  },
  statusText: {
    position: "absolute",
    bottom: 0,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    fontSize: 20,
    color: "black",
  },
  capturedImage: {
    position: "absolute",
    top: -10,
    right: 20,
    width: 90,
    height: 160,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
});

export default CustomCamera;
