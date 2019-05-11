import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {createStackNavigator, createAppContainer} from 'react-navigation';
import FirstScreen from "./app/components/Login"
import SecondScreen from "./app/components/Register"
import MainScreen from "./app/components/Main"
import Test from "./app/components/TestVac"
// import Main from "./app/components/First"
// import locScreen from "./app/components/loc"
import FetchLocation from "./app/components/FetchLocation"


  const MainNavigator = createStackNavigator({
    First: {screen:  FirstScreen},
    Second: {screen: SecondScreen},
    Main: {screen: MainScreen},
    Test: {screen: Test}

  },{
    headerMode: 'none',
    navigationOptions: {
      header: null
    }
  }
  );
  const App = createAppContainer(MainNavigator);

  export default App;
