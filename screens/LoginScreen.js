import React, { Component } from 'react';
import { ActivityIndicator, Alert, AsyncStorage, Image, Keyboard, StyleSheet, PermissionsAndroid, AppRegistry, Text, TouchableOpacity, TouchableWithoutFeedback, View, Button, Platform } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const HOST = 'http://10.0.2.2:8000';

export default class UserSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            busy: false,
        };
        this.login = this.login.bind(this);
        this.renderActivityIndicator = this.renderActivityIndicator.bind(this);
    }

    async login() {
        this.setState(() => ({
            busy: true
        }));

        try {
            console.log('[login] - Attempting to login.');

            let data = this.createFormData({ username: this.state.username, password: this.state.password });

            let options = {
                method: 'POST',
                headers: {
                },
                credentials: 'include',
                body: data
            }

            // http://localhost:8000/api-token-auth/
            let response = await fetch(HOST + '/api-token-auth/', options);
            let responseJSON = await response.json();

            console.log('[login] - HTTP Status Code: ' + response.status);


            switch (Number(response.status)) {
                case 200:
                    this.props.screenProps.authToken = responseJSON.token;
                    AsyncStorage.setItem('authToken', responseJSON.token);
                    console.log('[login] - Login key is: ' + responseJSON.token);
                    this.props.screenProps.username = this.state.username;
                    this.props.navigation.replace('Profile');
                    break;
                case 400:
                    console.log('[login] - JSON Error: ' + JSON.stringify(responseJSON));
                    Alert.alert('We couldn\'nt log into your account', responseJSON[Object.keys(responseJSON)[0]][0]);
                    break;
                case 401:
                    console.log('[login] - JSON Error: ' + JSON.stringify(responseJSON));
                    Alert.alert('We couldn\'nt log into your account', responseJSON[Object.keys(responseJSON)[0]][0]);
                    break;
                default:
                    Alert.alert('Oops, something went wrong', 'Something went wrong, please try logging in again in a couple of minutes.')
            }
        }
        catch (e) {
            console.log(e.message);
            this.setState(() => ({
                busy: false
            }));
        }
    }

    createFormData(body) {
        const data = new FormData();

        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });
        return data;
    };

    async componentWillUnmount() {

    }

    renderActivityIndicator() {
        if (this.state.busy) {
            return (
                <ActivityIndicator
                    style={{
                        alignSelf: 'center',
                        position: 'absolute',
                        top: '40%',
                        zIndex: 50
                    }}
                    color='blue'
                    size='large'
                />
            );
        }
        else
            return (null);
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    {this.renderActivityIndicator()}
                    <View style={styles.formContainer}>
                        <View style={styles.textFieldContainer}>
                            <TextInput
                                style={styles.textFields}
                                placeholder="Username"
                                placeholderTextColor='grey'
                                onChangeText={(text) => this.state.username = text}
                                onBlur={() => { console.log("[onBlur] Message Text: " + this.state.username) }}
                                maxLength={30}
                            />
                            <TextInput
                                style={styles.textFields}
                                placeholder="Password"
                                placeholderTextColor='grey'
                                onChangeText={(text) => this.state.password = text}
                                onBlur={() => { console.log("[onBlur] Message Text: " + this.state.password) }}
                                secureTextEntry={true}
                                maxLength={30}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={this.login}
                        >
                            <Text style={{
                                color: 'white',
                            }}>
                                Login
                        </Text>
                        </TouchableOpacity>

                        <Text onPress={() => { this.props.navigation.navigate('UserRegistration') }} style={styles.accountCreationText}>Don't have an account? Sign up by tapping here!</Text>
                    </View>
                    <View style={styles.appLogoContainer}>
                        <View style={styles.pinContainer}>
                            <Image style={styles.pinLogo} source={null} />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>

        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20
    },
    title: {
        fontSize: 32,
        color: 'black',
        marginTop: '3%',
    },
    formContainer: {
        flex: .7,
        width: '80%',
        justifyContent: 'space-evenly',
    },
    textFieldContainer: {
        flex: .6,
        justifyContent: 'space-evenly',
    },
    textFields: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 18,
        color: 'black'
    },
    submitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        padding: 10,
        borderWidth: 2,
        borderRadius: 5
    },
    accountCreationText: {
        textAlign: 'center',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    pinContainer: {
        marginTop: 30,
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
})