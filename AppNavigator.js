import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import SplashScreen from './screens/SplashScreen';
import ProfileScreen from './screens/ProfileScreen';
import CameraScreen from './screens/CameraScreen';
import LoginScreen from './screens/LoginScreen';
import UserRegistrationScreen from './screens/UserRegistrationScreen';
import ChatScreen from './screens/ChatScreen';

const AppNavigator = createStackNavigator(
  {
    Splash: {
      screen: SplashScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    Login: LoginScreen,
    UserRegistration: UserRegistrationScreen,
    Camera: {
      screen: CameraScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: () => ({
        //header: null
      })
    },
    Chat: ChatScreen
  },
  {
    initialRouteName: 'Splash',
    defaultNavigationOptions: {
      title: 'Rena Chat',
      headerStyle: {
        backgroundColor: 'black',

      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontSize: 34,
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
      },
    },
    headerLayoutPreset: 'center'
  },

)

export default createAppContainer(AppNavigator);