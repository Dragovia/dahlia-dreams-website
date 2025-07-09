import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { GLView } from 'expo-gl';
import { Button, Icon } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import AROverlay from './AROverlay';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [isARMode, setIsARMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const onContextCreate = async (gl: any) => {
    // AR rendering context setup
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        Alert.alert('Success', 'Photo captured!');
        console.log('Photo taken:', photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync({
          quality: Camera.Constants.VideoQuality['720p'],
          maxDuration: 30,
        });
        Alert.alert('Success', 'Video recorded!');
        console.log('Video recorded:', video.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to record video');
      } finally {
        setIsRecording(false);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Camera View */}
      <Camera 
        style={styles.camera} 
        type={type}
        ref={cameraRef}
      >
        {/* AR Overlay */}
        {isARMode && (
          <AROverlay onContextCreate={onContextCreate} />
        )}

        {/* AR Mode Toggle */}
        <View style={styles.arToggleContainer}>
          <TouchableOpacity
            style={[styles.arToggle, isARMode && styles.arToggleActive]}
            onPress={() => setIsARMode(!isARMode)}
          >
            <Text style={[styles.arToggleText, isARMode && styles.arToggleTextActive]}>
              AR {isARMode ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Camera Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.topControls}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => {
                setType(current => (
                  current === CameraType.back ? CameraType.front : CameraType.back
                ));
              }}>
              <Text style={styles.flipText}>Flip</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordButtonActive]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Text style={styles.recordButtonText}>
                {isRecording ? 'Stop' : 'Record'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  arOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 1,
  },
  arToggleContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  arToggle: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  arToggleActive: {
    backgroundColor: 'rgba(0, 255, 0, 0.7)',
    borderColor: '#00ff00',
  },
  arToggleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  arToggleTextActive: {
    color: '#000',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  flipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  flipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  recordButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  recordButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 