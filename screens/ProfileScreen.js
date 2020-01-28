import React, { Component } from 'react';
import { ActivityIndicator, Alert, AsyncStorage, FlatList, Image, Keyboard, StyleSheet, PermissionsAndroid, AppRegistry, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View, Button, Platform } from 'react-native';
import { connect } from 'react-redux';
import { getHttp, getFriends, getPendingFriends, postHttp, postRequestFriend, postConfirmFriend, postRemoveFriend, postSetProfileBio, postSetProfilePicture, postRemovePendingFriend, setFriendPictureLocalPath, setPendingFriendPictureLocalPath, setProfilePictureLocalPath } from './reducer';
import ImagePicker from 'react-native-image-picker';
import { TextInput } from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';

const HOST = 'http://rena-chat.herokuapp.com';

export class ProfileScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            profile: {

            },
            topBarOption: 'friends',

            request_friend_text: null,
            confirm_friend_text: null,

            isEditingBio: false,
        }
        this.changeBodyOption = this.changeBodyOption.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.requestFriend = this.requestFriend.bind(this);
        this.confirmFriend = this.confirmFriend.bind(this);
        this.removePendingFriend = this.removePendingFriend.bind(this);
        this.removeFriend = this.removeFriend.bind(this);
        this.renderListHeader = this.renderListHeader.bind(this);
        this.setProfilePicture = this.setProfilePicture.bind(this);
        this.setProfileBio = this.setProfileBio.bind(this);
        this.startChat = this.startChat.bind(this);
        this.renderActivityIndicator = this.renderActivityIndicator.bind(this);
    }

    async getProfile() {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + this.props.jwt_token
        });

        await this.props.getHttp('/api/v1/users/get_current_profile', headers);

        console.log('[getProfile] - Current user profile\'s details: ' + JSON.stringify(this.props.profile));
        console.log('[getProfile] - Picture SERVER PATH equal to: ' + this.props.profile.profile_picture_server_path);

        let localPicturePath = null;

        if (this.props.profile.profile_picture != null) {
            let filename = this.props.profile.profile_picture.split('/').pop();
            let dirs = RNFetchBlob.fs.dirs;
            await RNFetchBlob
                .config({
                    // response data will be saved to this path if it has access right.
                    path: dirs.CacheDir + '/' + filename
                })
                .fetch('GET', HOST + this.props.profile.profile_picture, {
                    //some headers ..
                })
                .then((res) => {
                    // the path should be dirs.DocumentDir + 'path-to-file.anything'
                    console.log('[getProfile] - Picture file was saved to: ' + res.path());
                    localPicturePath = res.path();
                })
                .catch((e) => { console.log('[getProfile] - Blob fetch failed for the following reason: ' + e.message) });
        }
        this.props.setProfilePictureLocalPath(localPicturePath);
    }

    async getFriends() {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + this.props.jwt_token
        });

        await this.props.getFriends('/api/v1/friends/get_friends', headers);

        console.log('[getFriends] - Friends for user: ' + this.props.profile.username + ' ' + JSON.stringify(this.props.friends));

        // Retrieve pictures from the server and format them so that they are readily downloaded
        this.props.friends.forEach(async (friend, index) => {
            console.log('[getFriends] - Current friend\'s details: ' + JSON.stringify(friend));
            console.log('[getFriends] - Picture is equal to: ' + friend.profile_picture);
            let localProfilePicturePath = null;

            if (friend.profile_picture != null) {
                let filename = friend.profile_picture.split('/').pop();
                let dirs = RNFetchBlob.fs.dirs;
                await RNFetchBlob
                    .config({
                        // response data will be saved to this path if it has access right.
                        path: dirs.CacheDir + '/' + filename
                    })
                    .fetch('GET', HOST + friend.profile_picture, {
                        //some headers ..
                    })
                    .then((res) => {
                        // the path should be dirs.DocumentDir + 'path-to-file.anything'
                        console.log('[getFriends] - Picture file was saved to: ' + res.path());
                        localProfilePicturePath = res.path();
                    })
                    .catch((e) => { console.log('[getFriends] - Blob fetch failed for the following reason: ' + e.message) });
            }
            this.props.setFriendPictureLocalPath(localProfilePicturePath, index)
        });
    }
    async getPendingFriends() {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + this.props.jwt_token
        });
        await this.props.getPendingFriends('/api/v1/friends/get_pending_friends', headers);

        console.log('[getPendingFriends] - Friends for user: ' + this.props.username + ' ' + JSON.stringify(this.props.pending_friends));

        this.props.pending_friends.forEach(async (friend, index) => {
            console.log('Current friend\'s details: ' + JSON.stringify(friend));
            console.log('[getPendingFriends] - Picture is equal to: ' + friend.profile_picture);
            let localProfilePicturePath = null;

            if (friend.profile_picture != null) {
                let filename = friend.profile_picture.split('/').pop();
                let dirs = RNFetchBlob.fs.dirs;
                await RNFetchBlob
                    .config({
                        // response data will be saved to this path if it has access right.
                        path: dirs.CacheDir + '/' + filename
                    })
                    .fetch('GET', HOST + friend.profile_picture, {
                        //some headers ..
                    })
                    .then((res) => {
                        // the path should be dirs.DocumentDir + 'path-to-file.anything'
                        console.log('[getPendingFriends] - Picture file was saved to: ' + res.path());
                        localProfilePicturePath = res.path();
                    })
                    .catch((e) => { console.log('[getPendingFriends] - Blob fetch failed for the following reason: ' + e.message) });
            }
            this.props.setPendingFriendPictureLocalPath(localProfilePicturePath, index)
        });
    }

    async requestFriend(friend_username) {
        let data = this.createFormData({ username: friend_username });
        console.log('[requestFriend] - User auth token is: ' + this.props.jwt_token + ' requested friend is: ' + this.state.request_friend_text + ' Form data: ' + JSON.stringify(data));
        // Careful of the headers, make sure your content type is appropriate....
        const headers = new Headers({
            'Authorization': 'JWT ' + this.props.jwt_token
        });

        await this.props.postRequestFriend('/api/v1/friends/request_friend', headers, data);

        console.log('[requestFriend] - Requested friend: ' + friend_username + ' for user: ' + this.props.profile.username + ' Result: ' + JSON.stringify(this.props.response.success));
        Alert.alert(friend_username + ' friend request sent!', 'You have requested to be friends with ' + friend_username + '!');
    }

    async confirmFriend(friend_username) {
        let data = this.createFormData({ username: friend_username });
        console.log('[confirmFriend] - User auth token is: ' + this.props.jwt_token + ' confirmed friend is: ' + this.state.confirm_friend_text + ' Form data: ' + JSON.stringify(data));
        const headers = new Headers({
            'Authorization': 'JWT ' + this.props.jwt_token
        });
        this.props.postConfirmFriend('/api/v1/friends/confirm_friend', headers, data);
        console.log('[confirmFriend] - Confirmed friend: ' + friend_username + ' for user: ' + this.props.profile.username + ' Result: ' + JSON.stringify(this.props.response.status));
        Alert.alert(friend_username + ' added!', 'You have added ' + friend_username + ' to your friends list!');
        // Don't query the server again in the future, just add them to the friends array.
        await this.getPendingFriends();
        await this.getFriends();
    }

    async removeFriend(friend_username) {
        let data = this.createFormData({ username: friend_username });
        console.log('[removeFriend] - User auth token is: ' + this.props.jwt_token + ' removed friend is: ' + this.state.confirm_friend_text + ' Form data: ' + JSON.stringify(data));
        const headers = new Headers({
            'Authorization': 'JWT ' + this.props.jwt_token
        });
        await this.props.postRemoveFriend('/api/v1/friends/remove_friend', headers, data);
        console.log('[removeFriend] - Confirmed friend: ' + friend_username + ' for user: ' + this.props.profile.username + ' Result: ' + JSON.stringify(this.props.response.success));
        Alert.alert(friend_username + ' removed', 'You have removed ' + friend_username + ' from your friends list.');
        // Don't query the server again in the future, just add them to the friends array.
        await this.getFriends();
    }

    async setProfilePicture() {
        const options = {
            title: 'Select Avatar',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                cameraRoll: true,
                waitUntilSaved: true,
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, async (response) => {
            console.log('[showImagePicker] - Image has been selected or taken.');
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                console.log('[pickImage] - Returned file is: ' + Platform.OS == 'android' ? JSON.stringify(response.path) : JSON.stringify(response.uri));

                let pictureDetails = null;
                pictureDetails = {};
                pictureDetails.uri = response.uri;
                pictureDetails.type = 'image/jpg';
                pictureDetails.name = response.fileName;


                let data = this.createFormData({ profile_picture: pictureDetails, username: this.props.profile.username });
                const headers = new Headers({
                    'Authorization': 'JWT ' + this.props.jwt_token
                });
                await this.props.postSetProfilePicture('/api/v1/users/set_profile_picture', headers, data);

                Alert.alert('Success', 'You have successfully added your new profile picture!');
                this.props.setProfilePictureLocalPath(Platform.OS == 'android' ? response.path : response.uri);
            }
        });
    }

    async setProfileBio() {
        if (!this.state.isEditingBio) {
            this.setState(() => ({
                isEditingBio: true
            }))
        }
        else if (this.state.isEditingBio) {
            let data = this.createFormData({ bio: this.state.profile.bio, username: this.props.profile.username });
            const headers = new Headers({
                'Authorization': 'JWT ' + this.props.jwt_token
            });
            console.log('[setProfileBio] - Setting bio to: ' + this.state.profile.bio);
            await this.props.postSetProfileBio('/api/v1/users/set_profile_bio', headers, data, this.state.profile.bio);

            if (this.props.response.status === 200) {
                console.log('[setProfileBio] - Successfully added bio to profile, bio: ' + this.props.profile.bio);
                Alert.alert('Bio changed!', 'You have successfully changed your bio.');
            }
            else {
                Alert.alert('Uh oh!', 'A network problem has occurred!');
            }
            this.setState(() => ({ isEditingBio: false }));
        }
    }

    async removePendingFriend(friend_username) {
        let data = this.createFormData({ username: friend_username });
        console.log('[removePendingFriend] - User auth token is: ' + this.props.jwt_token + ' removed pending friend is: ' + this.state.confirm_friend_text + ' Form data: ' + JSON.stringify(data));
        const headers = new Headers({
            'Authorization': 'JWT ' + this.props.jwt_token
        });
        await this.props.postRemovePendingFriend('/api/v1/friends/remove_pending_friend', headers, data);
        console.log('[removePendingFriend] - Pending friend: ' + friend_username + ' for user: ' + this.props.profile.username + ' Result: ' + JSON.stringify(this.props.response.success));
        Alert.alert(friend_username + ' removed', 'You have removed ' + friend_username + ' from your friends list.');
        // Don't query the server again in the future, just add them to the friends array.
        this.getPendingFriends();
    }

    createFormData(body) {
        const data = new FormData();

        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });
        return data;
    };

    startChat(friend_id) {
        console.log('[startChat] - CURRENT USER PK: ' + this.state.profile.pk);
        this.props.navigation.navigate('Chat', {
            friend_id: friend_id,
        });
    }

    async componentDidMount() {
        console.log('[ProfileScreen.js] - User token is: ' + this.props.screenProps.authToken);
        this.setState(() => ({
            busy: true
        }))
        await Promise.all([
            this.getProfile().catch((e) => console.log('Error: ' + e.message)),
            this.getFriends().catch((e) => console.log('Error: ' + e.message)),
            this.getPendingFriends().catch((e) => console.log('Error: ' + e.message)),
        ]);
    }

    renderActivityIndicator() {
        if (this.props.loading) {
            return (
                <ActivityIndicator
                    style={{
                        alignSelf: 'center',
                        position: 'absolute',
                        top: '50%',
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

    changeBodyOption(option) {
        this.setState(() => ({
            topBarOption: option
        }))
    }

    renderSeparatorComponent() {
        return (
            <View
                style={{
                    height: 7,
                }}
            />
        );
    }
    renderListHeader(shouldRenderFriendBar) {
        return (
            <View style={{ flex: 1, alignSelf: 'stretch', marginBottom: 10 }}>
                {
                    shouldRenderFriendBar === true ?
                        <View style={styles.addFriendBar}>
                            <TextInput
                                style={styles.addFriendBarTextField}
                                onChangeText={(text) => this.state.request_friend_text = text}
                                placeholder='Request friend'
                                placeholderTextColor='grey'
                            />
                            <TouchableOpacity style={styles.addFriendBarButton} onPress={() => { this.requestFriend(this.state.request_friend_text) }}>
                                <Text style={styles.addFriendBarText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                }
                {
                    this.props.pending_friends.length > 0 ?
                        <View>
                            <Text style={{ fontSize: 18, marginLeft: '1%', fontWeight: 'bold', marginBottom: 10 }}>Pending friends</Text>
                            <FlatList
                                style={{ marginBottom: 10 }}
                                data={this.props.pending_friends}
                                renderItem={({ item, index, separators }) => (
                                    <View style={styles.postContentContainer}>
                                        <View style={styles.postPictureGroupContainer}>
                                            <View style={styles.postPictureContainer}>
                                                {item.profile_picture_local_path !== null ? <Image style={styles.profileBannerPicture} source={{ uri: Platform.OS == 'android' ? 'file://' + item.profile_picture_local_path : item.profile_picture_local_path }} /> : null}
                                            </View>
                                            <Text>{item.username}</Text>
                                        </View>
                                        <View style={{ flex: 1.5, marginRight: '2%', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                                            <View style={{ flex: 1, alignItems: 'center' }}>
                                                <Text style={{ textAlign: 'center' }}>{item.bio}</Text>
                                            </View>
                                            <TouchableOpacity onPress={this.confirmFriend.bind(this, item.username)} style={{ margin: '1%', padding: '3%', borderRadius: 3, backgroundColor: 'black' }}>
                                                <Text style={{ fontSize: 12, color: 'white' }}>Add</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={this.removePendingFriend.bind(this, item.username)} style={{ margin: '1%', padding: '3%', borderRadius: 3, backgroundColor: 'black' }}>
                                                <Text style={{ fontSize: 12, color: 'white' }}>Reject</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                                ItemSeparatorComponent={this.renderSeparatorComponent}
                                keyExtractor={item => item.username}
                            />
                        </View>
                        :
                        null
                }

                <Text style={{ fontSize: 18, marginLeft: '1%', fontWeight: 'bold' }}>Friends</Text>
            </View>


        );
    }

    renderBioField(isEditingBio) {
        if (isEditingBio) {
            return (
                <View style={styles.profileBannerBodyBioContainer}>
                    <TextInput style={{
                        textAlign: 'center',
                        fontSize: 16,
                        borderRadius: 7,
                        backgroundColor: 'white'
                    }} onChangeText={(text) => this.state.profile.bio = text} multiline={true} numberOfLines={3} maxLength={80}>{this.props.profile.bio}</TextInput>
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginRight: '2%' }}>
                        <TouchableOpacity onPress={this.setProfileBio}>
                            <Text style={{ margin: '2%', fontWeight: 'bold' }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        else {
            return (
                <View style={styles.profileBannerBodyBioContainer}>
                    <Text style={{
                        textAlign: 'center',
                        fontSize: 16,
                        borderRadius: 7,
                    }} onChangeText={(text) => this.state.profile.bio = text} multiline={true} numberOfLines={3} maxLength={80}>{this.props.profile.bio}</Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginRight: '2%' }}>
                        <TouchableOpacity onPress={this.setProfileBio}>
                            <Text style={{ margin: '2%' }}>edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }

    render() {
        if (this.state.topBarOption === 'friends')
            return (
                <View style={styles.container}>
                    {this.renderActivityIndicator()}
                    <View style={styles.profileContainer}>
                        <View style={styles.profileBanner}>

                            <View style={styles.profileBannerPictureGroupContainer}>
                                <View style={styles.profileBannerPictureContainer}>
                                    {this.props.profile.profile_picture_local_path !== null ? <Image style={styles.profileBannerPicture} source={{ uri: Platform.OS == 'android' ? 'file://' + this.props.profile.profile_picture_local_path : this.props.profile.profile_picture_local_path }} /> : null}
                                </View>
                                <TouchableOpacity onPress={this.setProfilePicture}>
                                    <Text style={styles.profileBannerUploadPhotoText}>Upload photo</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.profileBannerBodyContainer}>

                                <View style={styles.profileBannerBodyNameContainer}>
                                    <Text style={styles.profileBannerBodyName}>{this.props.profile.username}</Text>
                                </View>

                                {this.renderBioField(this.state.isEditingBio)}

                            </View>

                        </View>

                        <View style={styles.bodyContainer}>
                            <View style={styles.bodyTopBar}>

                                <TouchableOpacity
                                    style={styles.bodyTopBarFriendsButton}
                                    onPress={this.changeBodyOption.bind(this, 'friends')}
                                >
                                    <Text style={styles.bodyTopBarFriendsButtonText}>Friends</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.bodyTopBarHotButton}
                                    onPress={this.changeBodyOption.bind(this, 'chat')}
                                >
                                    <Text style={styles.bodyTopBarHotButtonText}>Chat</Text>
                                </TouchableOpacity>

                            </View>

                            <FlatList
                                style={styles.postsContainer}
                                data={this.props.friends}
                                renderItem={({ item, index, separators }) => (
                                    <View style={styles.postContentContainer}>
                                        <View style={styles.postPictureGroupContainer}>
                                            <View style={styles.postPictureContainer}>
                                                {item.profile_picture_local_path !== null ? <Image style={styles.profileBannerPicture} source={{ uri: Platform.OS == 'android' ? 'file://' + item.profile_picture_local_path : item.profile_picture_local_path }} /> : null}
                                            </View>
                                            <Text>{item.username}</Text>
                                        </View>
                                        <View style={{ flex: 1.5, marginRight: '2%', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                                            <View style={{ flex: 1, alignItems: 'center' }}>
                                                <Text style={{ textAlign: 'center' }}>{item.bio}</Text>
                                            </View>
                                            <TouchableOpacity onPress={this.removeFriend.bind(this, item.username)} style={{ margin: '1%', padding: '3%', borderRadius: 3, backgroundColor: 'black' }}>
                                                <Text style={{ fontSize: 12, color: 'white' }}>Remove</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                                ItemSeparatorComponent={this.renderSeparatorComponent}
                                ListHeaderComponent={this.renderListHeader.bind(this, true)}
                                keyExtractor={item => item.username}
                            />
                        </View>
                    </View>
                </View>
            );
        else if (this.state.topBarOption === 'chat')
            return (
                <View style={styles.container}>
                    {this.renderActivityIndicator()}
                    <View style={styles.profileContainer}>
                        <View style={styles.profileBanner}>

                            <View style={styles.profileBannerPictureGroupContainer}>
                                <View style={styles.profileBannerPictureContainer}>
                                    {this.props.profile.profile_picture_local_path !== null ? <Image style={styles.profileBannerPicture} source={{ uri: Platform.OS == 'android' ? 'file://' + this.props.profile.profile_picture_local_path : this.props.profile.profile_picture_local_path }} /> : null}
                                </View>
                                <TouchableOpacity onPress={this.setProfilePicture}>
                                    <Text style={styles.profileBannerUploadPhotoText}>Upload photo</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.profileBannerBodyContainer}>

                                <View style={styles.profileBannerBodyNameContainer}>
                                    <Text style={styles.profileBannerBodyName}>{this.props.profile.username}</Text>
                                </View>

                                {this.renderBioField(this.state.isEditingBio)}

                            </View>

                        </View>

                        <View style={styles.bodyContainer}>
                            <View style={styles.bodyTopBar}>

                                <TouchableOpacity
                                    style={styles.bodyTopBarFriendsButton}
                                    onPress={this.changeBodyOption.bind(this, 'friends')}
                                >
                                    <Text style={styles.bodyTopBarFriendsButtonText}>Friends</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.bodyTopBarHotButton}
                                    onPress={this.changeBodyOption.bind(this, 'chat')}
                                >
                                    <Text style={styles.bodyTopBarHotButtonText}>Chat</Text>
                                </TouchableOpacity>

                            </View>



                            <FlatList
                                style={styles.postsContainer}
                                data={this.props.friends}
                                renderItem={({ item, index, separators }) => (
                                    <View style={styles.postContentContainer}>
                                        <View style={styles.postPictureGroupContainer}>
                                            <View style={styles.postPictureContainer}>
                                                {item.profile_picture_local_path !== null ? <Image style={styles.profileBannerPicture} source={{ uri: Platform.OS == 'android' ? 'file://' + item.profile_picture_local_path : item.profile_picture_local_path }} /> : null}
                                            </View>
                                            <Text>{item.username}</Text>
                                        </View>
                                        <View style={{ flex: 1.5, marginRight: '2%', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                                            <View style={{ flex: 1, alignItems: 'center' }}>
                                                <Text style={{ textAlign: 'center' }}>{item.bio}</Text>
                                            </View>
                                            <TouchableOpacity onPress={this.startChat.bind(this, item.pk)} style={{ margin: '1%', padding: '3%', borderRadius: 3, backgroundColor: 'black' }}>
                                                <Text style={{ fontSize: 12, color: 'white' }}>Chat</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                                ItemSeparatorComponent={this.renderSeparatorComponent}
                                ListHeaderComponent={this.renderListHeader.bind(this, false)}
                                keyExtractor={item => item.username}
                            />
                        </View>
                    </View>
                </View>
            );

    }
}

// Refers to the Redux state
const mapStateToProps = state => {
    let response = state.response;
    let loading = state.loading;
    let jwt_token = state.jwt_token;
    let profile = state.profile;
    let friends = state.friends;
    let pending_friends = state.pending_friends;

    return {
        friends: friends,
        pending_friends,
        loading: loading,
        jwt_token: jwt_token,
        profile: profile,
        response: response
    };
};

const mapDispatchToProps = {
    getHttp,
    getFriends,
    getPendingFriends,

    postHttp,
    postConfirmFriend,
    postRemoveFriend,
    postRemovePendingFriend,
    postRequestFriend,
    postSetProfileBio,
    postSetProfilePicture,

    setFriendPictureLocalPath,
    setPendingFriendPictureLocalPath,
    setProfilePictureLocalPath
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 25,
        //paddingHorizontal: '5%',kjk
        flexDirection: 'column',
        backgroundColor: 'lightgrey',
    },
    chatContainer: {

    },
    profileContainer: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 15,
        //backgroundColor: '#E6E6E6'
    },
    profileBanner: {
        flex: .25,
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-evenly',
        borderRadius: 15,
        backgroundColor: '#E6E6E6',
    },
    // Adjusting the flex fixes the border issue with the images.
    profileBannerPictureGroupContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileBannerPictureContainer: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 200,
        margin: '2%',
        borderWidth: 2,
        borderColor: 'grey',
        backgroundColor: 'white'
    },
    profileBannerPicture: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 200,

    },
    profileBannerUploadPhotoText: {
    },
    profileBannerBodyContainer: {
        flex: 1,
        padding: '2%',
        borderRadius: 15,
        justifyContent: 'space-evenly',
        //backgroundColor: 'purple'
    },
    profileBannerBodyName: {
        textAlign: 'center',
        fontSize: 28,

    },
    profileBannerBodyBioContainer: {

    },
    profileBannerBodyBio: {
        // textAlign: 'center',
        // fontSize: 16,
        // borderRadius: 7,
        // backgroundColor: this.state.isEditingBio ? 'white' : null
    },

    bodyContainer: {
        flex: .75,
        flexDirection: 'column',
        alignSelf: 'stretch',
        //justifyContent: 'space-evenly',
        borderRadius: 15,
        marginTop: '7%',
        backgroundColor: 'white',
    },
    bodyTopBar: {
        height: '10%',
        flexDirection: 'row',
        backgroundColor: '#E6E6E6',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    bodyTopBarPostsButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        //backgroundColor: 'red',
        borderTopLeftRadius: 15,
    },
    bodyTopBarPostsButtonText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        //color: 'black'
    },
    bodyTopBarFriendsButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        borderRightWidth: 1,
        borderRightColor: 'grey',
        //backgroundColor: 'yellow'
    },
    bodyTopBarFriendsButtonText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        //color: 'black'
    },
    bodyTopBarHotButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        borderTopRightRadius: 15,
        //backgroundColor: 'green'
    },
    bodyTopBarHotButtonText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        //color: 'black'
    },

    addFriendBar: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignSelf: 'stretch',
        borderRadius: 5,
        marginBottom: 10,
    },

    addFriendBarButton: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor: 'black'
    },

    addFriendBarText: {
        color: 'white'
    },

    addFriendBarTextField: {
        flex: 1.5,
        marginRight: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        textAlign: 'center',
        backgroundColor: 'white',
        color: 'black'
    },
    postsContainer: {
        flex: 1,
        color: 'red',
        margin: '2%',
        zIndex: 50,

    },
    postContentContainer: {
        height: 95,
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-evenly',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'grey',
        //backgroundColor: 'red',
    },
    postPictureGroupContainer: {
        flex: .6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    postPictureContainer: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 200,
        margin: '2%',
        borderWidth: 2,
        borderColor: 'grey',
        backgroundColor: 'white'
    },
    postPicture: {

    },
    postPictureUser: {

    },
    postBodyContainer: {
        flex: 1.5,
        borderRadius: 15,
        marginRight: '5%',
        justifyContent: 'space-evenly',
    },
    postBodyTextContainer: {
        padding: '2%',
        //backgroundColor: 'red'
    },
    postBodyText: {
        textAlign: 'center'
    },
})