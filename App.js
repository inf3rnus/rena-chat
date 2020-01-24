import React from 'react';
import AppNavigator from './AppNavigator';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

import reducer from './screens/reducer';

console.disableYellowBox = false;

// BS message from RN, [RCTRootView cancelTouches] will not be deprecated according to github.
console.ignoredYellowBox = ['Warning: `-[RCTRootView cancelTouches]` is deprecated and will be deleted soon.'];

const client = axios.create({
  baseURL: 'http://rena-chat.herokuapp.com',
  responseType: 'json'
});

client.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  console.log('AXIOS INTERCEPTOR - ' + JSON.stringify(error.response));
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

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