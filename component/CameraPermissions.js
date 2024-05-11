import { Text, View, StyleSheet, Button } from "react-native";
import { useCameraPermission } from "react-native-vision-camera";

function CameraPermissions() {
  const { hasPermission, requestPermission } = useCameraPermission();

  const requestPermissionF = () => {
    requestPermission();
    console.log("Requesting Permission");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Camera Permissions Required to Capture Your Emotions
      </Text>
      <Button title="Request Permission" onPress={requestPermissionF} />
    </View>
  );
}

export default CameraPermissions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});
