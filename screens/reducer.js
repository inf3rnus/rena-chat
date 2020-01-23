export const GET_FRIENDS = 'GET_FRIENDS';
export const GET_FRIENDS_SUCCESS = 'GET_FRIENDS_SUCCESS';
export const GET_FRIENDS_FAIL = 'GET_FRIENDS_FAIL';

export const SET_PROFILE_PICTURE_LOCAL_PATH = 'SET_PROFILE_PICTURE_LOCAL_PATH';

export const GET_PROFILE = 'GET_PROFILE';
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS';
export const GET_PROFILE_FAIL = 'GET_PROFILE_FAIL';

export const POST = 'POST';
export const POST_SUCCESS = 'POST_SUCCESS';
export const POST_FAIL = 'POST_FAIL';

export default function reducer(state = {baseURL: 'http://rena-chat.herokuapp.com', profile: {}}, action) {
    switch (action.type) {
        case SET_PROFILE_PICTURE_LOCAL_PATH:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    profile_picture_local_path: action.payload.profile_picture_local_path
                }
            }
        case GET_PROFILE:
            return {
                ...state,
                loading: true,            
            };
        case GET_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                response: action.payload,
                profile: {
                    ...action.payload.data,
                    profile_picture_server_path: action.payload.data.profile_picture + state.baseURL,
                }
            };
        case GET_PROFILE_FAIL:
            return {
                ...state,
                loading: false,
                response: {
                    ...action.error,
                    // Middleware embeds status code on failure inside of the message property string.
                    status: action.error.response.status
                }
            };
        case POST:
            return {
                ...state,
                loading: true
            };
        case POST_SUCCESS:
            return {
                ...state,
                loading: false,
                response: action.payload,
                jwt_token: action.payload.data.token
            };
        case POST_FAIL:
            return {
                ...state,
                loading: false,
                response: {
                    ...action.error,
                    // Middleware embeds status code on failure inside of the message property string.
                    status: action.error.response.status
                }
            };
        default:
            return state;
    }
}

export function postHttp(url, data) {
    return {
        type: POST,
        payload: {
            request: {
                data: data,
                headers: { 'Content-Type': 'multipart/form-data' },
                method: 'post',
                url: url,
            }

        }
    };
}

export function getHttp(url, headers) {
    return {
        type: GET_PROFILE,
        payload: {
            request: {
                headers: headers,
                method: 'get',
                url: url,
            }

        }
    };
}

export function setProfilePictureLocalPath(path){
    return {
        type: SET_PROFILE_PICTURE_LOCAL_PATH,
        payload: {
            profile_picture_local_path: path
        }
    };
}