import React,{Component} from 'react'
import {Text,View,Picker,Image,Dimensions,BackHandler,StatusBar, ImageBackground} from 'react-native'
import { Appbar,Snackbar, TextInput, Button } from 'react-native-paper';
import {MyContext} from '../../AppNavigation/AppNavigation'
import colors from '../../constants/colors';
import {StackHeader} from '../../components/StackHeader'
import AsyncStorage from '@react-native-community/async-storage';
import storageKeys from '../../constants/storageKeys';
import urls, { BASE_URL } from '../../constants/urls';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { getRequest, postRequest,deleteRequest, putRequest } from '../../services/NetworkRequest';
import Carousel ,{Pagination} from 'react-native-snap-carousel';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
var RNFS = require('react-native-fs');
import CompressImage from 'react-native-compress-image';
import { TabBarHeader } from '../../components/TabBarHeader';

export class ContactDetailsAdmin extends Component {
    constructor(props){
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.state={
            data:{},
            currentImg:0,
            address:'',
            number:'',
            email:'',
            images:[],
            submitting:false,
            Snackbar:false,
            snackbarMsg:'',
            loading:true,
        }
    }

    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.getData()
    }

    handleBackButtonClick=()=>{
        this.props.navigation.navigate("Home");
        return true;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    addImage=async()=>{
        this.setState({loading:true})
        const img = await this.pickImage()
        const compImg = await this.compressImage(img.path)
        const token = await AsyncStorage.getItem(storageKeys.TOKEN)
        let headers =  {'Authorization':'bearer '+token}
        var data = new FormData()
        data.append('imageFile',{"type": img.mime,"name": compImg.name,"uri" : compImg.uri},);
        let imageData = await fetch(urls.UPLOAD_IMAGE,{method: 'post',body: data,headers:headers})
        imageData = await imageData.json()
        let postObj={
            id:this.state.data._id,
            image:imageData.path
        }
        const headers2 = {'Content-Type': 'application/json', 'Accept': 'application/json','Authorization':`bearer ${token}`}

        let postImage = await putRequest(urls.DETAILS,headers2,JSON.stringify(postObj))
        this.getData()
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

    compressImage=async(imageUri)=>{
        var path = RNFS.DocumentDirectoryPath+'/CompressedImg'
        const resp = await CompressImage.createCompressedImage(imageUri, path)
        return resp
    }

    getData=async()=>{
        const token = await AsyncStorage.getItem(storageKeys.TOKEN)
        const headers = {'Content-Type': 'application/json', 'Accept': 'application/json','Authorization':`bearer ${token}`}
        try{
            let data = await getRequest(urls.DETAILS,headers)
            console.log(data)
            if(data.success){
                if(data.message=='No Details'){
                    this.setState({loading:false,})    
                }else{
                    let number = data.details[0].contact[0]
                    if(data.details[0].contact.length>1){
                        for(let i = 1 ; i < data.details[0].contact.length ;i++){
                            number = number +' , '+data.details[0].contact[i]
                        }
                    }
                    this.setState({loading:false,data:data.details[0],images:data.details[0].images,number,address:data.details[0].address,email:data.details[0].email})
                }
            }else{
                this.setState({Snackbar:true,snackbarMsg:'Some Error Occured While Fetching Data',loading:false})
            }
        }catch(err){
            this.setState({Snackbar:true,snackbarMsg:'Some Error Occured While Fetching Data',loading:false})
        }
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={{width:deviceWidth,}}>
                <Image style={{width:'100%',height:200,backgroundColor:colors.TILE}} source={{uri:item}} />
            </View>
        );
    };

    deleteImage=async(index)=>{
        this.setState({loading:true})
        const token = await AsyncStorage.getItem(storageKeys.TOKEN)
        const headers = {'Content-Type': 'application/json', 'Accept': 'application/json','Authorization':`bearer ${token}`}
        let resp = await deleteRequest(`${urls.DETAILS}/?index=${index}&id=${this.state.data._id}`,headers)
        resp = await resp.json()
        this.getData()
    }
    
    postData=async(body)=>{
        const token = await AsyncStorage.getItem(storageKeys.TOKEN)
        const headers = {'Content-Type': 'application/json', 'Accept': 'application/json','Authorization':`bearer ${token}`}
        let data = await postRequest(urls.DETAILS,headers,JSON.stringify(body)) 
    }

    submit=async()=>{
        const {address,number,email} = this.state
        if(address.trim() && number.trim() && email.trim()){
            let num = number.split(',')
            let data = {
                details:{
                    address:address,
                    contact:num,
                    email:email,
                },
                id:{_id:this.state.data._id}
            }
            try{
                await this.postData(data)
                this.setState({submitting:false,Snackbar:true,snackbarMsg:'Data Successfully Inserted'})
            }catch(err){
                this.setState({submitting:false,Snackbar:true,snackbarMsg:'Something Seems Broken'})
            }
        }else{
            this.setState({submitting:false,Snackbar:true,snackbarMsg:'Fill All Details'})
        }


    }

    render(){
        
        return(
            <View style={{paddingTop:STATUSBAR_HEIGHT,flex:1,backgroundColor:colors.BACKGROUND}}>
                <TabBarHeader headerText="Contact Us" />
                {
                    this.state.loading?
                    <View style={{flex:1,backgroundColor:'#fff',justifyContent:'center'}}>
                        <Image source={require('../../assets/splash.gif')} />
                    </View>  
                    :
                    <View>
                    
                    {   this.state.data &&
                        <View>

                            <TextInput
                                value={this.state.address}
                                mode={"flat"}
                                multiline={true}
                                style={{margin:10,backgroundColor:colors.BACKGROUND}}
                                placeholder={"Address"}
                                onChangeText={(address)=>{this.setState({address})}}
                            />
                            <TextInput
                                value={this.state.number}
                                mode={"flat"}
                                style={{margin:10,backgroundColor:colors.BACKGROUND}}
                                placeholder={"Number ( 9898567854, 7654836479 .... )"}
                                keyboardType={"numeric"}
                                onChangeText={(number)=>{this.setState({number})}}
                            />
                            <TextInput
                                value={this.state.email}
                                mode={"flat"}
                                style={{margin:10,backgroundColor:colors.BACKGROUND}}
                                placeholder={"email"}
                                onChangeText={(email)=>{this.setState({email})}}
                            />
                        </View>
                    }
                    <View style={{padding:10,justifyContent:'center',alignItems:'center'}}>
                        <ScrollView horizontal={true} >
                            {   this.state.images &&
                                this.state.images.map((image,index)=>{
                                    return(
                                        <ImageBackground style={{height:150,width:150,backgroundColor:colors.TILE,margin:10,alignItems:'flex-end',padding:0}} source={{uri:image}}>
                                            
                                            <Button style={{alignSelf:'flex-end'}} onPress={()=>{this.deleteImage(index)}}>
                                                <MaterialIcons color={'red'} size={25} name={"delete"} />
                                            </Button>
                                        </ImageBackground>
                                    )
                                })
                            }
                            <Button style={{alignSelf:'center'}} onPress={()=>{this.addImage()}}>
                                    <MaterialIcons name={'touch-app'} size={50} />
                                    <Text>Add Image</Text>
                            </Button>
                        </ScrollView>
                    </View>
                    <Button mode={"outlined"} loading={this.state.submitting} style={{marginTop:10,margin:20}} onPress={()=>{this.setState({submitting:true},()=>this.submit())}}>
                        Submit
                    </Button>
                    </View>
                }
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
const deviceWidth = Dimensions.get('window').width
