import React, { Component } from 'react';
import { ActivityIndicator, Alert, AsyncStorage, Image, Keyboard, StyleSheet, PermissionsAndroid, AppRegistry, Text, TouchableOpacity, TouchableWithoutFeedback, View, Button, Platform } from 'react-native';
import { connect } from 'react-redux';
import { postHttp } from './reducer';
import { TextInput } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

//const HOST = 'http://10.0.2.2:8000';
const HOST = 'http://rena-chat.herokuapp.com';

export class UserLogin extends Component {
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

        console.log('[login] - Attempting to login.');
        let data = this.createFormData({ username: this.state.username, password: this.state.password });
        await this.props.postHttp('/api/v1/rest-auth/login/', data);
        let { status } = this.props.response;
        console.log('[login] - HTTP Status Code: ' + JSON.stringify(this.props.response.status));
        switch (Number(status)) {
            case 200:
                let { token } = this.props.response.data;
                this.props.screenProps.authToken = token;
                await AsyncStorage.setItem('authToken', token);
                console.log('[login] - Login key is: ' + this.props.jwt_token);
                this.props.screenProps.username = this.state.username;
                this.props.navigation.navigate('Profile');
                break;
            case 400:
                let _response = JSON.parse(this.props.response.response.request._response);
                let error_message = _response[Object.keys(_response)][0];
                console.log('[login] - HTTP Error: ' + JSON.stringify(this.props.response.status));
                Alert.alert('We couldn\'t log into your account', error_message);
                break;
            case 401:
                let _response2 = JSON.parse(this.props.response.response.request._response);
                let error_message2 = _response2[Object.keys(_response2)][0];
                Alert.alert('We couldn\'t log into your account', error_message2);
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

    async componentWillUnmount() {

    }

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
                </LinearGradient>
            </TouchableWithoutFeedback>
        );
    }
}

// Refers to the Redux state
const mapStateToProps = state => {
    let response = state.response;
    let loading = state.loading;
    let jwt_token = state.jwt_token;
    return {
        loading: loading,
        jwt_token: jwt_token,
        response: response
    };
};

const mapDispatchToProps = {
    postHttp
};

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
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