export const GET = 'GET';
export const GET_SUCCESS = 'GET_SUCCESS';
export const GET_FAIL = 'GET_FAIL';

export const POST = 'POST';
export const POST_SUCCESS = 'POST_SUCCESS';
export const POST_FAIL = 'POST_FAIL';

export default function reducer(state = {}, action) {
    switch (action.type) {
        case POST:
            return { ...state, loading: true };
        case POST_SUCCESS:
            return { ...state, loading: false, response: action.payload };
        case POST_FAIL:
            return {
                ...state,
                loading: false,
                response: action.error
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
                headers: {'Content-Type': 'multipart/form-data' },
                method: 'post',
                url: url,
            }
            
        }
    };
}