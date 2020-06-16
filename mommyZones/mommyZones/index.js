/**
 * @format
 */
import React,{useEffect} from 'react'
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {foregroundMessage,backgroundMessage,configure} from './app/services/pushNotification'
import messaging from '@react-native-firebase/messaging';

const hook = () => {
    configure()
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            foregroundMessage(remoteMessage)
        });
        
        return unsubscribe;
    }, []);
    return(
        <App/>
    )
}
messaging().setBackgroundMessageHandler(async remoteMessage => {
    backgroundMessage(remoteMessage)
});

AppRegistry.registerComponent(appName, () => hook);
