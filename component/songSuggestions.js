// import React, { useState, useRef } from 'react';
// import { View, Text, Button } from 'react-native';
// import { Camera } from 'expo-camera';

// const CameraScreen = () => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const cameraRef = useRef(null);

//   // Request camera permissions
//   const requestCameraPermission = async () => {
//     const { status } = await Camera.requestPermissionsAsync();
//     setHasPermission(status === 'granted');
//   };

//   // Take a photo
//   const takePicture = async () => {
//     if (cameraRef.current) {
//       const photo = await cameraRef.current.takePictureAsync();
//       console.log('Photo taken:', photo);
//       // Handle the captured photo (e.g., save it to state or upload it)
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <Camera
//         style={{ flex: 1 }}
//         type={Camera.Constants.Type.back}
//         ref={cameraRef}
//         onCameraReady={requestCameraPermission}
//       >
//         <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end' }}>
//           <Button title="Take Picture" onPress={takePicture} disabled={!hasPermission} />
//         </View>
//       </Camera>
//     </View>
//   );
// };

// export default CameraScreen;
