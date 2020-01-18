export const GET = 'GET';
export const GET_SUCCESS = 'GET_SUCCESS';
export const GET_FAIL = 'GET_FAIL';

export default function reducer(state = {}, action) {
    switch (action.type) {
        case GET:
            return { ...state, loading: true };
        case GET_SUCCESS:
            return { ...state, loading: false, response: action.payload };
        case GET_FAIL:
            return {
                ...state,
                loading: false,
                response: action.error
            };
        default:
            return state;
    }
}

export function login(url, data) {
    return {
        type: GET,
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