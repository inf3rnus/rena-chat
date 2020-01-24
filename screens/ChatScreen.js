import React, { Component } from 'react';
import { Alert, AsyncStorage, Image, Keyboard, StyleSheet, PermissionsAndroid, AppRegistry, Text, TextInput, TouchableOpacity, View, Button, Platform } from 'react-native';
import { connect } from 'react-redux';
import { getPreviousMessages } from './reducer';
import { GiftedChat } from 'react-native-gifted-chat';

//const HOST = 'http://10.0.2.2:8000';
const HOST = 'http://rena-chat.herokuapp.com';
//const WS_HOST = 'ws://10.0.2.2:8000';
const WS_HOST = 'ws://rena-chat.herokuapp.com';
const LIMIT = 10;

export class ChatScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: {
                _id: this.props.profile.pk,
                name: this.props.profile.username,
                avatar: this.props.profile.profile_picture_server_path,
            },
            friend_user_id: this.props.navigation.state.params.friend_id,
            conversation_id: null,

            user_message: null,
            messages: [],
            page_offset: 0,
        }
        this.setupWebsocket = this.setupWebsocket.bind(this);
        this.getPreviousMessages = this.getPreviousMessages.bind(this);
    }

    socket;
    setupWebsocket() {
        this.socket = new WebSocket(WS_HOST + '/ws/chat');
        console.log('[setupWebsocket] - WebSocket initialized');

        // If the conversation ID has not been ascertained yet, retrieve it
        this.socket.onopen = (e) => {
            this.socket.send(JSON.stringify({
                friend_user_id: this.state.friend_user_id,
                command: 'start_conversation',
            }));
        }

        this.socket.onmessage = (e) => {
            let data = JSON.parse(e.data);
            // Determine if a conversation has been started
            console.log('[onmessage] - Received the following command: ' + data.client_command);
            switch (data.client_command) {
                case 'start_chat':
                    console.log('[onmessage] - start_chat fired, data contents: ' + JSON.stringify(data));
                    this.state.conversation_id = data.conversation_id;
                    this.getPreviousMessages(this.state.conversation_id);
                    break;
                default:
                    console.log('[onmessage] - receive_chat fired, data contents: ' + e.data);
                    console.log('[onmessage] - Type of the contents: ' + typeof data.message_contents);
                    if (data.current_user_id !== this.state.user._id) {
                        this.setState(previousState => ({
                            messages: GiftedChat.append(previousState.messages, data.message_contents),
                        }), () => { });
                        console.log('[onmessage] - Message contents: ' + JSON.stringify(data.message_contents));

                    }
                    break;
            }
        }
    }

    async getPreviousMessages(conversation_id) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + this.props.jwt_token
        });

        console.log('[getPreviousMessages] - Offset is: ' + this.state.page_offset);

        await this.props.getPreviousMessages(HOST + '/api/v1/chat/get_conversation_messages?limit=' + LIMIT + '&offset=' + this.state.page_offset + '&conversation_id=' + conversation_id, headers);
        this.state.page_offset += 10;

        console.log('[getPreviousMessages] - JSON response is: ' + JSON.stringify(this.props.messages));

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, this.props.messages, false),
        }));
    }

    onSend(messages = []) {
        console.log('[onSend] - Avatar server path is: ' + this.state.user.avatar);
        messages[0].user = this.state.user;
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));

        // You may need to figure out why the argument passed to this callback is an array...
        // I can only think it's purpose is to 
        console.log('[onSend] - Message encapsulated: ' + JSON.stringify(messages));
        this.socket.send(JSON.stringify({
            conversation_id: this.state.conversation_id,
            command: 'send_chat',
            message_contents: messages[0],
            current_user_id: this.state.user._id,
        }));
    }

    async componentDidMount() {
        console.log('[ChatScreen] - Selected friend pk is: ' + this.state.friend_user_id);
        this.setupWebsocket();
    }

    async componentWillUnmount() {
        this.socket.close();
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <GiftedChat
                    style={{ flex: 1, alignSelf: 'stretch', height: 200 }}
                    messages={this.state.messages}
                    loadEarlier={true}
                    onLoadEarlier={this.getPreviousMessages.bind(this, this.state.conversation_id)}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.user._id,
                    }}
                />
            </View>
        );
    }

};

// Refers to the Redux state
const mapStateToProps = state => {
    let { friends, loading, jwt_token, messages, profile, response, } = state;
    return {
        friends,
        loading: loading,
        jwt_token: jwt_token,
        messages: messages,
        profile: profile,
        response: response
    };
};

const mapDispatchToProps = {
    getPreviousMessages
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#62F698'
    },
    title: {
        fontSize: 30
    }
})