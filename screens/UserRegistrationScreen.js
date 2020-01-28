import React, { Component } from 'react';
import { ActivityIndicator, Alert, AsyncStorage, Image, Keyboard, StyleSheet, PermissionsAndroid, AppRegistry, Text, TouchableOpacity, TouchableWithoutFeedback, View, Button, Platform } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { postHttp } from './reducer';
import { TextInput } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

//const HOST = 'http://10.0.2.2:8000';
const HOST = 'http://rena-chat.herokuapp.com';

export class UserRegistration extends Component {
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

        console.log('[register] - Attempting to register a user');

        let data = this.createFormData({ username: this.state.username, password1: this.state.password1, password2: this.state.password2 });

        await this.props.postHttp('/api/v1/rest-auth/registration/', data);
        console.log('[login] - HTTP Status Code: ' + this.props.response.status);
        let { status } = this.props.response;
        switch (Number(status)) {
            case 201:
                let { token } = this.props.response.data;
                this.props.screenProps.authToken = token;
                console.log('[login] - Login key is: ' + this.props.screenProps.authToken);
                this.props.screenProps.username = this.state.username;
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
                let _response = JSON.parse(this.props.response.response.request._response);
                let error_message = _response[Object.keys(_response)][0];
                console.log('[login] - HTTP Error: ' + JSON.stringify(this.props.response.status));
                Alert.alert('We couldn\'t create your account', error_message);
                break;
            case 401:
                let _response2 = JSON.parse(this.props.response.response.request._response);
                let error_message2 = _response2[Object.keys(_response2)][0];
                console.log('[login] - HTTP Error: ' + JSON.stringify(this.props.response.status));
                Alert.alert('We couldn\'t create your account', error_message2);
                break;
            default:
                Alert.alert('Oops, something went wrong', 'Something went wrong, please try logging in again in a couple of minutes.')
        }

    }

    createFormData(body) {
        const data = new FormData();

        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });
        return data;
    };

    renderActivityIndicator() {
        if (this.props.loading) {
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
                <LinearGradient
                    start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                    colors={['white', 'grey']}
                    style={styles.container}>
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
                            <Image style={styles.pinLogo} source={require('./images/rena-chat-logo-short.png')} />
                        </View>
                    </View>
                </LinearGradient>
            </TouchableWithoutFeedback>
        );
    }
}

// Refers to the Redux state
const mapStateToProps = state => {
    let { loading, jwt_token, response } = state;
    return {
        loading: loading,
        jwt_token: jwt_token,
        response: response
    };
};

const mapDispatchToProps = {
    postHttp
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistration);

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
        marginTop: '1%',
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
    },
    pinLogo: {
        width: '10%',
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain'
    },
    appLogoContainer: {
        alignSelf: 'flex-end',
        flex: .4,
        top: '2%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
})