/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Text,StatusBar,View} from 'react-native'
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import {AppNavigation} from './app/AppNavigation/AppNavigation'
import {Signup} from './app/Screens/Signup'
import { DefaultTheme,Provider as PaperProvider } from 'react-native-paper';
import colors from './app/constants/colors';
import {HomeScreen} from './app/Screens/HomeScreen'
import {SplashScreen} from './app/Screens/SplashScreen'
const STATUSBAR_HEIGHT = StatusBar.currentHeight

const App: () => React$Node = () => {
  return (
    <PaperProvider theme={theme}>
        <NavigationContainer>
            <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = {colors.TILE} translucent = {true}/>    
            <View style={{flex:1,}}>
                <AppNavigation/>
            </View>
        </NavigationContainer>
    </PaperProvider>
  );
};

const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.TILE,
      accent: colors.OVERLAY_TILE,
    },
  };

export default App;
