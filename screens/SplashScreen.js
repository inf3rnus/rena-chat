import React, { Component } from 'react';
import { ActivityIndicator, Alert, AsyncStorage, PermissionsAndroid, StyleSheet, AppRegistry, Text, View, Button, Image, Platform } from 'react-native';

export default class SplashScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            busy: true
        }
    }

    componentDidMount() {
        setTimeout(async () => {
            this.props.navigation.replace('Login');
        }, 1500)
    }


    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator style={{
                    alignSelf: 'center',
                    position: 'absolute',
                    top: '25%',
                    zIndex: 50
                }} animating={this.state.busy} size='large' color='blue' />
                <View style={styles.appLogoContainer}>
                    <View style={styles.pinContainer}>
                        <Image style={styles.pinLogo} source={null}/>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',

    },
    pinContainer: {
        bottom: 50,
        width: 130,
        height: 130,
        alignSelf: 'stretch',
    },
    pinLogo: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    appLogoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 54,
        fontWeight: 'bold',
        color: 'white'
    },
    titleDescription: {
        fontSize: 12,
        color: 'white'
    }
});