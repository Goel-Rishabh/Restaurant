import React,{Component} from 'react'
import {Text,View,Image,TextInput,BackHandler,StatusBar, Dimensions} from 'react-native'
import { Appbar, Button, TouchableRipple,Snackbar } from 'react-native-paper';
import {MyContext} from '../../AppNavigation/AppNavigation'
import colors from '../../constants/colors';
import urls from '../../constants/urls';
import { getRequest, putRequest, deleteRequest } from '../../services/NetworkRequest';
import AsyncStorage from '@react-native-community/async-storage';
import storageKeys from '../../constants/storageKeys';
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DocumentPicker from 'react-native-document-picker';
import CompressImage from 'react-native-compress-image';
var RNFS = require('react-native-fs');
import ImagePicker from 'react-native-image-crop-picker';
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import DeviceInfo from 'react-native-simple-device-info';

export class AdminNotification extends Component {
    constructor(props){
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state={
            title:'',
            subtitle:'',
            message:'',
            uri:'',
            dialog:false,
            sending:false,
            dialogMsg:'',
            Snackbar:false,
            snackbarMsg:'',
        }
    }

    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick=()=>{
        this.props.navigation.navigate("Home");
        return true;
    }

    pickImage=async()=>{
        try {
            let image = await ImagePicker.openPicker({width: 350,height: 175,cropping: true})
            return image
        }catch (err) {
            if(DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
            }else{
                throw err;
            }
        }
    }

    setImage=async()=>{
        const res = await this.pickImage()
        const compRes = await this.compressImage(res.path)
        this.setState({uri:compRes.uri,type:res.mime,name:compRes.name})
    }

    compressImage=async(imageUri)=>{
        var path = RNFS.DocumentDirectoryPath+'/CompressedImg'
        const resp = await CompressImage.createCompressedImage(imageUri, path)
        return resp
    }

    sendNotification=async()=>{
        this.setState({dialog:false,sending:true})
        const {title,subtitle,message,uri,type,name} = this.state
        if(title && subtitle && message && uri && type && name){
            try{
                var data = new FormData()
                const token = await AsyncStorage.getItem(storageKeys.TOKEN)
                let headers =  {'Authorization':'bearer '+token}

                data.append('imageFile',{"type": type,"name": name,"uri" : uri},);
                let imageData = await fetch(urls.UPLOAD_IMAGE,{method: 'post',body: data,headers:headers})
                imageData = await imageData.json()

                let body={
                    title,
                    body:subtitle,
                    message,
                    image:imageData.filename
                }
                let notification = await putRequest(urls.FCM,headers,body)
                this.setState({Snackbar:true,sending:false,snackbarMsg:'Notification Sent To '+notification.data.success+' Users'})

            }catch(err){
                this.setState({Snackbar:true,sending:false,snackbarMsg:'Error Sending Notification'})
            }
            
        }else{
            this.setState({Snackbar:true,snackbarMsg:'Fill All Details',sending:false})
        }
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    logout=async(value)=>{
        try{
            const token = await AsyncStorage.getItem(storageKeys.TOKEN)
            const headers = {'Content-Type': 'application/json', 'Accept': 'application/json','Authorization':`bearer ${token}`}
            const device_id = await DeviceInfo.getUniqueID()
            let resp = await deleteRequest(urls.FCM,headers,{device_id:device_id})
            resp = await resp.json()
            const keys = await AsyncStorage.getAllKeys()
            await AsyncStorage.multiRemove(keys)
            value()
        }catch(err){
            this.setState({Snackbar:true,snackbarMsg:'Error While Logging You Out'})
        }
    }

    render(){
        return(
            <View style={{paddingTop:STATUSBAR_HEIGHT,flex:1}}>
                <MyContext.Consumer>
                    {
                        value=>(
                            <Appbar.Header color={colors.WHITE} theme={{colors: {primary: colors.TILE,}}}>
                            <Appbar.Content
                            titleStyle={{alignSelf:'center',fontWeight:'200',paddingLeft:45}}
                            title="Notification"
                            color={colors.WHITE}
                            />

                            <Appbar.Action icon="logout" color={colors.WHITE} 
                                onPress={()=>{
                                    // value()
                                    this.logout(value)
                            }} />
                            </Appbar.Header>
                        )
                    }
                </MyContext.Consumer>
                <TextInput
                    style={{color:colors.TEXT_PRIMARY,padding:4,backgroundColor:colors.OVERLAY_BACKGROUND,marginTop:10,padding:10}}
                    placeholderTextColor={colors.TEXT_SECONDATY}
                    placeholder="Enter Notification Title ..."
                    // mode="outlined"
                    value={this.state.title}
                    onChangeText={title => this.setState({ title })}
                />
                <TextInput
                    style={{color:colors.TEXT_PRIMARY,padding:4,backgroundColor:colors.OVERLAY_BACKGROUND,marginTop:10,padding:10}}
                    placeholderTextColor={colors.TEXT_SECONDATY}
                    placeholder="Enter Notification Subtitle ..."
                    // mode="outlined"
                    value={this.state.subtitle}
                    onChangeText={subtitle => this.setState({ subtitle })}
                />
                <TextInput
                    style={{color:colors.TEXT_PRIMARY,padding:4,backgroundColor:colors.OVERLAY_BACKGROUND,marginTop:10,padding:10}}
                    placeholderTextColor={colors.TEXT_SECONDATY}
                    placeholder="Enter Notification Message ..."
                    // mode="outlined"
                    value={this.state.message}
                    onChangeText={message => this.setState({ message })}
                />
                    
                <TouchableRipple style={{height:200,borderWidth:.6,borderRadius:7,borderColor:colors.OVERLAY_TILE,margin:5,justifyContent:'center',alignItems:'center',backgroundColor:colors.BACKGROUND}} onPress={()=>{this.setImage()}}>
                    {
                        this.state.uri ?
                        <Image style={{width:390,height:200}} source={{uri:this.state.uri}} />
                        :
                        <MaterialIcons name={"touch-app"} color={colors.TILE} size={55} />
                    }     
                </TouchableRipple>

                <Button
                    disabled={this.state.sending}
                    mode={"outlined"}
                    style={{backgroundColor:colors.BACKGROUND,margin:10}}
                    loading={this.state.sending}
                    icon={"telegram"}
                    onPress={()=>{this.setState({dialog:true,dialogMsg:''})}}
                >
                    <Text>Send Notification</Text>
                </Button>
                

                <ConfirmDialog 
                    visible={this.state.dialog}
                    onTouchOutside={() => this.setState({dialog: false})}
                    positiveButton={{
                        title: "OK",
                        onPress: () => {
                            this.sendNotification()
                        }
                    }} 
                    negativeButton={{
                        title:"CANCEL",
                        onPress: () => {
                            this.setState({dialog:false})
                        }    
                    }}
                >

                    <Text>Notification Once Sent Can Not Be Reverted</Text>    
                </ConfirmDialog>
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

const STATUSBAR_HEIGHT = StatusBar.currentHeight


