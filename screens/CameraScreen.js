import React, { Component } from 'react';
import { Alert, AsyncStorage, Image, Keyboard, StyleSheet, PermissionsAndroid, AppRegistry, Text, TouchableOpacity, View, Button, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default class ProfileScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            cameraType: RNCamera.Constants.Type.front
        }
    }

    componentDidMount() {

    }

    takePicture = async () => {
        if (this.camera) {
            const options = { quality: 0.5, base64: true, fixOrientation: true };
            const data = await this.camera.takePictureAsync(options);
            console.log(data.uri);
            this.props.navigation.state.params.setGeofencePicture(data);
            this.props.navigation.goBack();
        }
    }

    setCameraType() {
        if (this.state.cameraType === RNCamera.Constants.Type.front)
            this.setState(() => ({
                cameraType: RNCamera.Constants.Type.back
            }));
        else if (this.state.cameraType === RNCamera.Constants.Type.back)
            this.setState(() => ({
                cameraType: RNCamera.Constants.Type.front
            }))
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.cameraTypeButton} onPress={this.setCameraType.bind(this)}/>

                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={this.state.cameraType}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                />
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                        <Text style={{ fontSize: 14 }}> SNAP </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    cameraTypeButton: {
        flex: 0,
        alignSelf: 'flex-end',
        backgroundColor: 'white',
        aspectRatio: 1,
        width: '10%',
        borderRadius: 30
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    title: {
        fontSize: 30
    }
})