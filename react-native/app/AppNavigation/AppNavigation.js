import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {HomeScreen} from '../Screens/HomeScreen'
import {AdminNotification} from '../Screens/Admin/AdminNotification'
import {NotificationScreen} from '../Screens/NotificationScreen'
import {isLoading,SplashScreen,isAdmin} from '../Screens/SplashScreen'
import { Signup } from '../Screens/Signup';
import {ShowDishes} from '../Screens/Admin/ShowDishes'
import AsyncStorage from '@react-native-community/async-storage';
import storageKeys from '../constants/storageKeys';
import {PostDish} from '../Screens/Admin/PostDish'
import { createStackNavigator } from '@react-navigation/stack';
import { getRequest, deleteRequest } from '../services/NetworkRequest';
import urls from '../constants/urls';
import DeviceInfo from 'react-native-simple-device-info';
import {DetailsScreen} from '../Screens/Details'
import {ContactDetailsAdmin} from '../Screens/Admin/ContactDetails'
import colors from '../constants/colors';

const StackNavigator = createStackNavigator();

export class AppNavigation extends React.Component{

    constructor(props){
        super(props)
        this.state={
            isLoading:true,
            LoggedIn:false,
            admin:false
        }
    }

    async componentDidMount(){

    }

    logout=async()=>{
        this.setState({LoggedIn:false})
    }

    login=async()=>{
        let admin = await AsyncStorage.getItem(storageKeys.ADMIN)
        admin = await JSON.parse(admin)
        this.setState({LoggedIn:true,admin:admin})
    }

    splashComplete=async()=>{
        let loggedInStatus = await isLoading()
        if(loggedInStatus=="LoggedIn"){
            let adminStatus = await isAdmin()
            this.setState({isLoading:false,LoggedIn:true,admin:adminStatus})
        }else{
            this.setState({isLoading:false,LoggedIn:false})
        }
    }

    render(){
        const {isLoading,LoggedIn,admin} = this.state

        return(
            
            <View style={{flex:1}}>
                {
                    isLoading && <SplashScreen finished={()=>{this.splashComplete()}} />
                }
                {
                    !isLoading && LoggedIn && !admin &&
                    <MyContext.Provider value={()=>{this.logout()}} >
                        <UserStack/>
                    </MyContext.Provider>
                }
                {
                    !isLoading && LoggedIn && admin &&
                    <MyContext.Provider value={()=>{this.logout()}}>
                        <AdminTabNavigator/>
                    </MyContext.Provider>
                }
                {
                    !isLoading && !LoggedIn &&
                    <Signup login={this.login} />
                }
            </View>

        )
    }
}
export const MyContext = React.createContext(
    ()=>{
        //do nothing 
    }
)
const Tab = createBottomTabNavigator();
// const UserTabNavigator = () => (
//     <Tab.Navigator
//         screenOptions={({ route }) => ({
//             tabBarIcon: ({ focused, color, size }) => {
//             let iconName;

//             if (route.name === 'Home') {
//                 iconName = focused
//                 ? 'ios-information-circle'
//                 : 'ios-information-circle-outline';
//             } else if (route.name === 'Menu') {
//                 iconName = focused ? 'ios-list-box' : 'ios-list';
//             }

//             // You can return any component that you like here!
//             return <Ionicons name={iconName} size={size} color={color} />;
//             },
//         })}
//         tabBarOptions={{
//             activeTintColor: 'tomato',
//             inactiveTintColor: 'gray',
//         }}
//     >
//         <Tab.Screen name="Menu" component={HomeScreen} />
//         <Tab.Screen name="About" component={AboutScreen} />
//     </Tab.Navigator>
// )


const DishesStack = (props) =>(
    <StackNavigator.Navigator 
        initialRouteName="ShowDishes"
        mode="card"
        headerMode="none"
        >
        <StackNavigator.Screen name="ShowDishes" component={ShowDishes} />
        <StackNavigator.Screen name="PostDish" component={PostDish} />
       
    </StackNavigator.Navigator>
)

const UserStack=()=>(
    <StackNavigator.Navigator 
        initialRouteName="Menu"
        mode="card"
        headerMode="none"
        >
        <StackNavigator.Screen name="Menu" component={HomeScreen} />
        <StackNavigator.Screen name="Notification" component={NotificationScreen} />
        <StackNavigator.Screen name="Details" component={DetailsScreen} />
    </StackNavigator.Navigator>
)


const AdminTabNavigator = () => (
    <Tab.Navigator
    initialRouteName="Home"
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
                iconName = focused
                ? 'md-home'
                : 'ios-home';
            } else if (route.name === 'Contact') {
                iconName = !focused ? 'ios-contact' : 'md-contact';
            } else {
                iconName = focused ? 'ios-notifications' : 'ios-notifications-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
            },
        })}
        tabBarOptions={{
            activeTintColor: colors.TILE,
            inactiveTintColor: 'gray',
        }}
    >
        <Tab.Screen name="Notification" component={AdminNotification} />
        <Tab.Screen name="Home" component={DishesStack} />
        <Tab.Screen name="Contact" component={ContactDetailsAdmin} />
    </Tab.Navigator>
)

