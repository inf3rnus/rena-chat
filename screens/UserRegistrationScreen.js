import React, { Component } from 'react';
import { ActivityIndicator, Alert, AsyncStorage, Image, Keyboard, StyleSheet, PermissionsAndroid, AppRegistry, Text, TouchableOpacity, TouchableWithoutFeedback, View, Button, Platform } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { TextInput } from 'react-native-gesture-handler';

const HOST = 'http://10.0.2.2:8000';

export default class UserSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password1: null,
            password2: null,
            busy: false
        };
        this.register = this.register.bind(this);
        this.renderActivityIndicator = this.renderActivityIndicator.bind(this);
    }

    async register() {
        this.setState(() => ({
            busy: true
        }));

        try {

            console.log('[register] - Attempting to register a user');

            let data = this.createFormData({ username: this.state.username, password1: this.state.password1, password2: this.state.password2 });

            let options = {
                method: 'POST',
                headers: {
                },
                credentials: 'include',
                body: data
            }

            let response = await fetch(HOST + '/api/v1/rest-auth/registration/', options);
            let responseJSON = await response.json();
            console.log('RESPONSE IS: ' + JSON.stringify(response));
            console.log('[register] - JSON BODY IS: ' + JSON.stringify(responseJSON));
            console.log('[register] - HTTP Status Code: ' + response.status);

            switch (Number(response.status)) {
                case 201:
                    this.props.screenProps.authToken = responseJSON.token;
                    console.log('[login] - Login key is: ' + this.props.screenProps.authToken);
                    Alert.alert('Success', "Your account has successfully been created. You are now logged in!");
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({ routeName: 'Profile' }),
                        ],
                      });
                      this.props.navigation.dispatch(resetAction);
                    break;
                case 400:
                    console.log('[login] - JSON Error: ' + JSON.stringify(responseJSON));
                    Alert.alert('We couldn\'t create your account', responseJSON[Object.keys(responseJSON)[0]][0]);
                    break;
                case 401:
                    console.log('[login] - JSON Error: ' + JSON.stringify(responseJSON));
                    Alert.alert('We couldn\'t create your account', responseJSON[Object.keys(responseJSON)[0]][0]);
                    break;
                default:
                    Alert.alert('Oops, something went wrong', 'Something went wrong, please try logging in again in a couple of minutes.')
            }
        }
        catch (e) {
            this.setState(() => ({
                busy: false
            }));
        }
        this.setState(() => ({
            busy: false
        }));
    }

    createFormData(body) {
        const data = new FormData();

        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });
        return data;
    };

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
                    <Text style={styles.title}>Create Account</Text>
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
                                onChangeText={(text) => this.state.password1 = text}
                                onBlur={() => { console.log("[onBlur] Message Text: " + this.state.password1) }}
                                maxLength={30}
                                secureTextEntry={true}
                            />
                            <TextInput
                                style={styles.textFields}
                                placeholder="Confirm password"
                                placeholderTextColor='grey'
                                onChangeText={(text) => this.state.password2 = text}
                                onBlur={() => { console.log("[onBlur] Message Text: " + this.state.password2) }}
                                maxLength={30}
                                secureTextEntry={true}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={this.register}
                        >
                            <Text style={{
                                color: 'white',
                            }}>
                                Submit
                        </Text>
                        </TouchableOpacity>
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
        flex: .8,
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