import React,{Component} from 'react'
import {Dimensions,View,Image,Animated,Easing,BackHandler, ImageBackground} from 'react-native'
import {getToken,checkPermission,requestPermission} from '../services/pushNotification'
import AsyncStorage from "@react-native-community/async-storage";
import storageKeys from '../constants/storageKeys';
import * as Animatable from "react-native-animatable";
import colors from '../constants/colors';


export class SplashScreen extends Component {
    constructor(props){
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.state={
            animationM : new Animated.Value(0), 
            animationO : new Animated.Value(0), 
            animationM2 : new Animated.Value(0), 
            animationM3 : new Animated.Value(0), 
            animationY : new Animated.Value(0), 
            animationZ : new Animated.Value(0), 
            animationO2 : new Animated.Value(0), 
            animationN : new Animated.Value(0), 
            animationE : new Animated.Value(0), 
            animationS : new Animated.Value(0), 

        }
    }
    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.configureNotification()
        //animate and call below method
        // this.props.finished()
        this.fadeInOutM()
        this.fadeInOutO()
        this.fadeInOutM2()
        this.fadeInOutM3()
        this.fadeInOutY()
        this.fadeInOutZ()
        this.fadeInOutO2()
        this.fadeInOutN()
        this.fadeInOutE()
        this.fadeInOutS()
        //
    }

    fadeInOutM=()=>{
        Animated.timing(this.state.animationM, {
            toValue : 1,
            delay:200,
            duration : 600,
            useNativeDriver: true,
            easing:Easing.cubic,
        }).start(()=>{
            Animated.timing(this.state.animationM,{
                toValue : 0,
                delay:200,
                useNativeDriver: true,
                duration : 600,
                easing:Easing.cubic, 
            }).start()    
        })
    }
    fadeInOutO=()=>{
        Animated.timing(this.state.animationO, {
            toValue : 1,
            delay:300,
            useNativeDriver: true,
            duration : 600,
            easing:Easing.cubic,
        }).start(()=>{
            Animated.timing(this.state.animationO,{
                toValue : 0,
                delay:300,
                useNativeDriver: true,
                duration : 600,
                easing:Easing.cubic, 
            }).start()    
        })
    }
    fadeInOutM2=()=>{
        Animated.timing(this.state.animationM2, {
            toValue : 1,
            delay:400,
            duration : 600,
            useNativeDriver: true,
            easing:Easing.cubic,
        }).start(()=>{
            Animated.timing(this.state.animationM2,{
                toValue : 0,
                delay:400,
                duration : 600,
                useNativeDriver: true,
                easing:Easing.cubic, 
            }).start()    
        })
    }
    fadeInOutM3=()=>{
        Animated.timing(this.state.animationM3, {
            toValue : 1,
            delay:500,
            duration : 600,
            useNativeDriver: true,
            easing:Easing.cubic,
        }).start(()=>{
            Animated.timing(this.state.animationM3,{
                toValue : 0,
                delay:500,
                duration : 600,
                useNativeDriver: true,
                easing:Easing.cubic, 
            }).start()    
        })
    }
    fadeInOutY=()=>{
        Animated.timing(this.state.animationY, {
            toValue : 1,
            delay:600,
            duration : 600,
            useNativeDriver: true,
            easing:Easing.cubic,
        }).start(()=>{
            Animated.timing(this.state.animationY,{
                toValue : 0,
                delay:600,
                duration : 600,
                useNativeDriver: true,
                easing:Easing.cubic, 
            }).start()    
        })
    }
    fadeInOutZ=()=>{
        Animated.timing(this.state.animationZ, {
            toValue : 1,
            delay:700,
            duration : 600,
            useNativeDriver: true,
            easing:Easing.cubic,
        }).start(()=>{
            Animated.timing(this.state.animationZ,{
                toValue : 0,
                delay:700,
                duration : 600,
                useNativeDriver: true,
                easing:Easing.cubic, 
            }).start()    
        })
    }
    fadeInOutO2=()=>{
        Animated.timing(this.state.animationO2, {
            toValue : 1,
            delay:800,
            duration : 600,
            useNativeDriver: true,
            easing:Easing.cubic,
        }).start(()=>{
            Animated.timing(this.state.animationO2,{
                toValue : 0,
                delay:800,
                duration : 600,
                useNativeDriver: true,
                easing:Easing.cubic, 
            }).start()    
        })
    }
    fadeInOutN=()=>{
        Animated.timing(this.state.animationN, {
            toValue : 1,
            delay:900,
            duration : 600,
            useNativeDriver: true,
            easing:Easing.cubic,
        }).start(()=>{
            Animated.timing(this.state.animationN,{
                toValue : 0,
                delay:900,
                duration : 600,
                useNativeDriver: true,
                easing:Easing.cubic, 
            }).start()    
        })
    }
    fadeInOutE=()=>{
        Animated.timing(this.state.animationE, {
            toValue : 1,
            delay:1000,
            duration : 600,
            useNativeDriver: true,
            easing:Easing.cubic,
        }).start(()=>{
            Animated.timing(this.state.animationE,{
                toValue : 0,
                delay:1000,
                duration : 600,
                useNativeDriver: true,
                easing:Easing.cubic, 
            }).start()    
        })
    }
    fadeInOutS=()=>{
        Animated.timing(this.state.animationS, {
            toValue : 1,
            delay:1100,
            duration : 600,
            easing:Easing.cubic,
            useNativeDriver: true,
        }).start(()=>{
            Animated.timing(this.state.animationS,{
                toValue : 0,
                delay:1100,
                duration : 600,
                easing:Easing.cubic, 
                useNativeDriver: true,
            }).start(()=>{
                this.props.finished()
            })    
        })
    }

    configureNotification=async()=>{
        const perm = await checkPermission()
        if(perm){
            const token = await getToken()
        }else{
            await requestPermission()
        }
    }

    handleBackButtonClick=()=>{
        // this.props.navigation.navigate("Menu");
        return true;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render(){

        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <View style={{flexDirection:'row'}}>
                    <Animated.Image style={{width:50,height:50,tintColor:colors.TILE,opacity:this.state.animationM}} source={require('../assets/M.png')} />
                    <Animated.Image style={{width:50,height:50,tintColor:colors.TILE,opacity:this.state.animationO}} source={require('../assets/O.png')} />
                    <Animated.Image style={{width:50,height:50,tintColor:colors.TILE,opacity:this.state.animationM2}} source={require('../assets/M.png')} />
                    <Animated.Image style={{width:50,height:50,tintColor:colors.TILE,opacity:this.state.animationM3}} source={require('../assets/M.png')} />
                    <Animated.Image style={{width:50,height:50,tintColor:colors.TILE,opacity:this.state.animationY}} source={require('../assets/Y.png')} />
                </View>
                <View style={{flexDirection:'row'}}>
                    <Animated.Image style={{width:50,height:50,tintColor:colors.TILE,opacity:this.state.animationZ}} source={require('../assets/Z.png')} />
                    <Animated.Image style={{width:50,height:50,tintColor:colors.TILE,opacity:this.state.animationO2}} source={require('../assets/O.png')} />
                    <Animated.Image style={{width:50,height:50,tintColor:colors.TILE,opacity:this.state.animationN}} source={require('../assets/N.png')} />
                    <Animated.Image style={{width:50,height:50,tintColor:colors.TILE,opacity:this.state.animationE}} source={require('../assets/E.png')} />
                    <Animated.Image style={{width:50,height:50,tintColor:colors.TILE,opacity:this.state.animationS}} source={require('../assets/S.png')} />
                </View>
                <Image style={{width:deviceWidth*2/3,height:deviceWidth*2/3,position:'absolute',top:-60,right:-40}} source={require('../assets/splashNoodle.png')} />
                <Image style={{width:deviceWidth/2,height:deviceWidth/2,position:'absolute',bottom:-45,left:-30}} source={require('../assets/splashDrink.png')} />
            </View>
        );
    }
}



export const isLoading = async() =>{
    try{
        let token = await AsyncStorage.getItem(storageKeys.TOKEN)
        if(token==null){
            return "LoggedOut"
        }else{            
            return "LoggedIn"
        }
      }
    catch(err){
      // 
    }
}
  

export const isAdmin = async()=>{
    try{
        let admin = await AsyncStorage.getItem(storageKeys.ADMIN)
        admin = await JSON.parse(admin)
        if(admin==true){
            return true
        }else{            
            return false
        }
      }
    catch(err){
      // 
    }
}
const deviceWidth = Dimensions.get('window').width
