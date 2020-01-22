export const GET = 'GET_PROFILE';
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS';
export const GET_PROFILE_FAIL = 'GET_PROFILE_FAIL';

export const POST = 'POST';
export const POST_SUCCESS = 'POST_SUCCESS';
export const POST_FAIL = 'POST_FAIL';

export default function reducer(state = {}, action) {
    switch (action.type) {
        case GET_PROFILE:
            return {
                ...state,
                loading: true
            };
        case GET_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                response: action.payload,
                jwt_token: action.payload.data.token
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
                data: data,
                headers: { 'Content-Type': 'multipart/form-data' },
                method: 'get',
                url: url,
            }

        }
    };
}