import React from 'react';
import AppNavigator from './AppNavigator';

console.disableYellowBox = false;

// BS message from RN, [RCTRootView cancelTouches] will not be deprecated according to github.
console.ignoredYellowBox = ['Warning: `-[RCTRootView cancelTouches]` is deprecated and will be deleted soon.'];

export default class App extends React.Component {

  constructor(props) {
    super(props);
    
    // Any state data for the entire app should be placed here.
    this.state = {
    };
  }

  componentDidMount() {
  }
  componentWillUnmount(){
  }

  render() {
    const mainAppFunctions = {
      username: null,
      password: null,
      authToken: null,
    }
    return (
      <AppNavigator screenProps={mainAppFunctions} />
    );
  }
}