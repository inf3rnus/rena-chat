import React from 'react';
import AppNavigator from './AppNavigator';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

import reducer from './screens/reducer';
import { AsyncStorage } from 'react-native';

console.disableYellowBox = true;

// BS message from RN, [RCTRootView cancelTouches] will not be deprecated according to github.
console.ignoredYellowBox = ['Warning: `-[RCTRootView cancelTouches]` is deprecated and will be deleted soon.'];

const client = axios.create({
  baseURL: 'https://rena-chat.herokuapp.com',
  responseType: 'json'
});

// client.interceptors.response.use(null, async (error) => {
//   // Any status codes that falls outside the range of 2xx cause this function to trigger
//   if (error.response.status === 401){
    
//     let jwt_token = await AsyncStorage.getItem('authToken');
//     const data = new FormData();
//     data.append('token', jwt_token);
    
//     let response = await axios.post('http://10.0.2.2:8000/api/v1/rest-auth/refresh_jwt/', data).catch((e) => console.log('AXIOS ERROR: ' + e));
//     console.log('[AXIOS INTERCEPTOR] - Refresh token is: ' + JSON.stringify(response.data.token));
//     await AsyncStorage.setItem('authToken', response.data.token);
    
//     error.config.headers = {'Authorization': 'JWT ' + response.data.token}
//     return axios.request(error.config);
//   }

// });

const store = createStore(reducer, applyMiddleware(axiosMiddleware(client)));

export default class App extends React.Component {

  constructor(props) {
    super(props);

    // Any state data for the entire app should be placed here.
    this.state = {
    };
  }

  componentDidMount() {
  }
  componentWillUnmount() {
  }

  render() {
    const mainAppFunctions = {
      username: null,
      password: null,
      authToken: null,
    }
    return (
      <Provider store={store}>
        <AppNavigator screenProps={mainAppFunctions} />
      </Provider>
    );
  }
}