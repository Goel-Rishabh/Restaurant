import React,{Component} from 'react'
import {Text,View,TextInput,StyleSheet,Dimensions,TouchableOpacity,BackHandler,Image,Animated} from 'react-native'
import {Button,Snackbar} from 'react-native-paper'
import * as Animatable from "react-native-animatable";
import MaterialIcon from 'react-native-vector-icons/Entypo'
import colors from '../constants/colors';
import { ScrollView } from 'react-native-gesture-handler';
import {signupUser,validate,loginUser,facebookSignup} from './LoginSignup/SignupFunctions'
import FBSDK from 'react-native-fbsdk'
import {facebookService} from './LoginSignup/Facebook'
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import {getToken,checkPermission,requestPermission} from '../services/pushNotification'
import DeviceInfo from 'react-native-simple-device-info';
import {postRequest} from '../services/NetworkRequest'
import urls from '../constants/urls'
import AsyncStorage from '@react-native-community/async-storage';
import storageKeys from '../constants/storageKeys';
let {width, height} = Dimensions.get('window');

export class Signup extends Component {

    constructor(props){
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.state={
            login:true,
            submitMsg:'LOGIN',
            loginusername:'',
            loginPassword:'',
            fullName:'',
            mobileNumber:'',
            username:'',
            password:'',
            confirmPassword:'',
            secureEntry:true,
            secureEntry2:true,
            Snackbar:false,
            snackbarMsg:'',
            backClickCount:0,
        }
    }

    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick=()=>{
        // this.state.backClickCount == 1 ? 
        BackHandler.exitApp() 
        // : this._spring();
        return true;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    signupUser=async()=>{
        this.setState({loading:true})
        const {fullName,mobileNumber,username,password,confirmPassword} = this.state
        const data = validate(fullName,mobileNumber,username,password,confirmPassword)
        if(data.error){
            this.setState({Snackbar:true,snackbarMsg:data.msg,loading:false})
        }else{
            try{
                let resp = await signupUser(data.body)
                if(resp.error){
                    this.setState({Snackbar:true,snackbarMsg:resp.message,loading:false})
                }else{
                    this.setState({Snackbar:true,snackbarMsg:'Signed Up Successfully',login:true,loading:false})
                }
            }catch(err){
                this.setState({Snackbar:true,snackbarMsg:'Some Error Occured',loading:false})
            }

        }
    }

    validateUser=async()=>{
        this.setState({loading:true})
        try{
            const data = await loginUser(this.state.loginusername,this.state.loginPassword)
            await AsyncStorage.setItem(storageKeys.TOKEN,data.token)
            await AsyncStorage.setItem(storageKeys.ADMIN,JSON.stringify(data.admin))
            this.loginUser(data)
        }catch(err){
            this.setState({Snackbar:true,snackbarMsg:'Some Error Occured',loading:false})
        }
    }

    loginUser=async(loginData)=>{
        const token = await AsyncStorage.getItem(storageKeys.TOKEN)

        const fcm = await this.getFCM()
        const device_id = await DeviceInfo.getUniqueID()
        //fcm request
        const url = urls.FCM
        const headers = {'Content-Type': 'application/json', 'Accept': 'application/json','Authorization':`bearer ${token}`}
        const body = {fcm:fcm,device_id:device_id}
        
        let resp = await postRequest(url,headers,JSON.stringify(body))
        resp = await resp.json()
        this.setState({loading:false})
        this.props.login()
    }

    getFCM=async()=>{
        const perm = await checkPermission()
        if(perm){
            const token = await getToken()
            console.log(token)
            return token

        }else{
            await requestPermission()
        }
    }

    _spring() {
        this.setState({backClickCount: 1}, () => {
        Animated.sequence([
            Animated.spring(
            this.springValue,{
                toValue: -.15 * height,
                friction: 5,
                duration: 300,
                useNativeDriver: true,
            }
            ),
            Animated.timing(
            this.springValue,{
                toValue: 100,
                duration: 300,
                useNativeDriver: true,
            }
            ),
        ]).start(() => {
            this.setState({backClickCount: 0});
        });
        });
    }


    render(){
        return(
            <View style={{flex:1,backgroundColor:colors.BACKGROUND,}}>

                <ScrollView style={{flex:1,}}>

                    
                    <View style={{flexDirection:'column',justifyContent:'flex-start',alignItems:'stretch',padding:5,paddingTop:50,marginBottom:30}}>
        
                        <View style={{backgroundColor:'white',borderRadius:10,padding:10,marginTop:100,marginHorizontal:10,paddingBottom:70}}>
                            <Image style={{height:deviceWidth*2/5,width:deviceWidth*3/5,position:'absolute',right:-60,top:-100,}} source={require('../assets/noodle.png')} />
                            
                            <View style={{flexDirection:'column',borderBottomColor:'red',marginTop:60,}}>

                                <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',}}>
                                    <TouchableOpacity onPress={()=>{this.setState({login:true})}}>
                                        <Text style={this.state.login?styles.textSelected:styles.textNotSelected}>Login</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{
                                        this.setState({login:false})
                                    }}>
                                        <Text style={!this.state.login?styles.textSelected:styles.textNotSelected}>Signup</Text>
                                    </TouchableOpacity>
                                </View>
                                

                            </View>
                            {   this.state.login ?
                                <View>
                                    <Animatable.View
                                        animation="lightSpeedIn"
                                        easing={"ease-in-circ"}
                                        // delay={200}
                                        style={{flexDirection:'row',borderBottomWidth:1,marginTop:30}}
                                        >
                                        <TextInput
                                            style={{flex:8,fontSize:16}}
                                            placeholderTextColor={colors.TEXT_PRIMARY}
                                            placeholder="Username"
                                            value={this.state.loginusername}
                                            onChangeText={loginusername => this.setState({ loginusername })}
                                            />   
                                        {
                                            this.state.loginusername ? 
                                            <TouchableOpacity 
                                            onPress={()=>{this.setState({loginusername:''})}} 
                                            style={{justifyContent:'center',alignItems:'center',flex:2}}
                                            >
                                                <MaterialIcon size={25} name={"circle-with-cross"} color={colors.TILE} />
                                            </TouchableOpacity>  : null          
                                        }

                                    </Animatable.View>
                                    <Animatable.View
                                        animation="lightSpeedIn"
                                        easing={"ease-in-circ"}
                                        // delay={200}
                                        style={{flexDirection:'row',borderBottomWidth:1,marginTop:20,marginBottom:40}}
                                        >
                                        <TextInput
                                            style={{flex:8,fontSize:16}}
                                            placeholderTextColor={colors.TEXT_PRIMARY}
                                            placeholder="Password"
                                            secureTextEntry={this.state.secureEntry}
                                            value={this.state.loginPassword}
                                            onChangeText={loginPassword => this.setState({ loginPassword })}
                                            />   
                                        <TouchableOpacity 
                                            onPress={()=>{this.setState( prevstate=>({secureEntry:!prevstate.secureEntry}) )}} 
                                            style={{justifyContent:'center',alignItems:'center',flex:2,}}
                                            >
                                            <MaterialIcon size={25} name={this.state.secureEntry? "eye" : "eye-with-line"} color={colors.TILE} />
                                        </TouchableOpacity>
                                    </Animatable.View>
                                </View>
                                :
                                <View>
                                    <View
                                        style={{flexDirection:'row',borderBottomWidth:1,marginTop:30}}
                                        >
                                        <TextInput
                                            style={{flex:8,fontSize:16}}
                                            placeholderTextColor={colors.TEXT_SECONDATY}
                                            placeholder="Full Name"
                                            value={this.state.fullName}
                                            onChangeText={fullName => this.setState({ fullName })}
                                            />   
                                        

                                    </View>
                                    <View
                                        style={{flexDirection:'row',borderBottomWidth:1,marginTop:30}}
                                        >
                                        <TextInput
                                            style={{flex:8,fontSize:16}}
                                            placeholderTextColor={colors.TEXT_SECONDATY}
                                            placeholder="Mobile Number"
                                            value={this.state.mobileNumber}
                                            onChangeText={mobileNumber => this.setState({ mobileNumber })}
                                            />   


                                    </View>
                                    <View
                                        style={{flexDirection:'row',borderBottomWidth:1,marginTop:30}}
                                        >
                                        <TextInput
                                            style={{flex:8,fontSize:16}}
                                            placeholderTextColor={colors.TEXT_SECONDATY}
                                            placeholder="Username"
                                            value={this.state.username}
                                            onChangeText={username => this.setState({ username })}
                                            />   


                                    </View>
                                    <View
                                        style={{flexDirection:'row',borderBottomWidth:1,marginTop:30}}
                                        >
                                        <TextInput
                                            style={{flex:8,fontSize:16}}
                                            placeholderTextColor={colors.TEXT_SECONDATY}
                                            placeholder="Password"
                                            secureTextEntry={this.state.secureEntry}
                                            value={this.state.password}
                                            onChangeText={password => this.setState({ password })}
                                            />   

                                        {   
                                        <TouchableOpacity 
                                        onPress={()=>{this.setState( prevstate=>({secureEntry:!prevstate.secureEntry}) )}} 
                                        style={{justifyContent:'center',alignItems:'center',flex:2,}}
                                        >
                                            <MaterialIcon size={25} name={this.state.secureEntry? "eye" : "eye-with-line"} color={colors.TILE} />
                                        </TouchableOpacity>         
                                        }
                                    </View>
                                    <View
                                        style={{flexDirection:'row',borderBottomWidth:1,marginTop:30}}
                                        >
                                        <TextInput
                                            style={{flex:8,fontSize:16}}
                                            secureTextEntry={this.state.secureEntry2}
                                            placeholderTextColor={colors.TEXT_SECONDATY}
                                            placeholder="Confirm Password"
                                            value={this.state.confirmPassword}
                                            onChangeText={confirmPassword => this.setState({ confirmPassword })}
                                            />   
                                        {   
                                            <TouchableOpacity 
                                            onPress={()=>{this.setState( prevstate=>({secureEntry2:!prevstate.secureEntry2}) )}} 
                                            style={{justifyContent:'center',alignItems:'center',flex:2,}}
                                            >
                                                <MaterialIcon size={25} name={this.state.secureEntry2? "eye" : "eye-with-line"} color={colors.TILE} />
                                            </TouchableOpacity>         
                                        }

                                    </View>
                                </View>
                            }
                            <Button style={{position:'absolute',elevation:7,bottom:-15,right:10,borderRadius:20,width:120,height:40}} 
                                onPress={
                                    ()=>{this.state.login ? this.validateUser() : this.signupUser()}
                                } loading={this.state.loading} icon={'gesture-tap'} mode="contained"
                                >
                                {this.state.login?'LOGIN':'SIGNUP'}
                            </Button>
                        </View>

                        {   this.state.login &&
                            <View style={{flexDirection:'row',justifyContent:'space-evenly',width:'100%',marginTop:80}}>
                                {/* <TouchableOpacity >
                                    <Image  source={require('../assets/google.png')} style={{width:100,height:40,}} />
                                </TouchableOpacity> */}                
                                {
                                    facebookService.makeLoginButton((text)=>{facebookSignup(text,this.loginUser)})
                                }
                            </View>
                        }

                        
                    </View>
                </ScrollView>
                <Snackbar
                    visible={this.state.Snackbar}
                    onDismiss={() => this.setState({ Snackbar: false })}
                    action={{
                        label: 'Okay',
                        onPress: () => {
                            // Do something
                        },
                    }}
                    >
                    {this.state.snackbarMsg}
                </Snackbar> 
            </View>
        );
    }
}

const deviceWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
    textSelected:{
        color:colors.TILE,
        fontSize:40,
        fontWeight:'bold'
    },
    textNotSelected:{
        color:colors.TILE,
        fontSize:20
    }
})

