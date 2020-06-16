import React,{Component} from 'react'
import {Text,View,Picker,StyleSheet,Dimensions,Image,TextInput,StatusBar,BackHandler} from 'react-native'
import {TabBarHeader} from '../../components/TabBarHeader'
import {StackHeader} from '../../components/StackHeader'
import DocumentPicker from 'react-native-document-picker';
import CompressImage from 'react-native-compress-image';
import urls from '../../constants/urls';
import storageKeys from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import { postRequest } from '../../services/NetworkRequest';
import RNFetchBlob from 'rn-fetch-blob';
import { Switch,Snackbar } from 'react-native-paper';
import colors from '../../constants/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
var RNFS = require('react-native-fs');
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import * as Animatable from 'react-native-animatable'
import ImagePicker from 'react-native-image-crop-picker';

export class PostDish extends Component {
    constructor(props){
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.state={
            image:{},
            dishName:'',
            description:'',
            veg:true,
            subCategory:'',
            quantity:[],
            dialog:false,
            posting:false,
            Snackbar:false,
            snackbarMsg:''
        }
    }
    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    }

    uploadImage=async()=>{
        const res = await this.pickImage()
        const compressedUri = await this.compressImage(res.path)
        this.setState({image:{uri:compressedUri.uri,type:res.mime,name:compressedUri.name}})
        // let uri = compressedUri.uri
        // let name = compressedUri.name
        // let type = res.type

        // var data = new FormData()
        // const token = await AsyncStorage.getItem(storageKeys.TOKEN)
        // const headers =  {
        //     'Authorrization':'bearer '+token,
        //     'Accept': 'application/json',
        //     'Content-Type': 'multipart/form-data;'
        // }
        // data.append('imageFile',
        //     {
        //         "type": type,
        //         "name": name,
        //         "uri" : uri
        //     },
        // );
        // let imageData = await fetch(urls.UPLOAD_IMAGE, { 
        //   method: 'post',
        //   body: data
        // })
        // imageData = await imageData.json()
    }

    postDish=async()=>{
        try{
            const {image,dishName,description,veg,subCategory,quantity} = this.state
            if(image.uri && dishName && description && subCategory && quantity.length>0){
                var data = new FormData()
                const token = await AsyncStorage.getItem(storageKeys.TOKEN)
                let headers =  {'Authorization':'bearer '+token}
                data.append('imageFile',{"type": image.type,"name": image.name,"uri" : image.uri},);
                let imageData = await fetch(urls.UPLOAD_IMAGE,{method: 'post',body: data,headers:headers})
                imageData = await imageData.json()
                postModel.description=description
                postModel.image=imageData.path
                postModel.name=dishName
                postModel.quantity=quantity
                postModel.subCategory=subCategory
                postModel.veg=veg
                
                headers={'Authorization':'bearer '+token,'Accept': 'application/json','Content-Type': 'application/json'}
                const url = urls.POST_DISH+this.props.route.params.id
                // let postResp = await postRequest(url,headers,postModel)
                let postResp = await fetch(url,{
                    method:'POST',
                    headers:headers,
                    body:JSON.stringify(postModel)
                })
                postResp=await postResp.json()
                if(postResp.success==true){
                    this.setState({posting:false,Snackbar:true,snackbarMsg:'Successfully Uploaded Dish'})
                }else{
                    this.setState({posting:false,Snackbar:true,snackbarMsg:'Error in Uploading Dish'})
                }

            }else{
                this.setState({posting:false,snackbarMsg:'Fill All Details',Snackbar:true})
            }
        }catch(err){
            this.setState({posting:false,Snackbar:true,snackbarMsg:'Some Error Occured'})

        }
    }

    handleBackButtonClick=()=>{
        this.props.route.params.updateScreen()
        this.props.navigation.navigate("ShowDishes");
        return true;
    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    pickImage=async()=>{
        try {
            const res = await ImagePicker.openPicker({width: 350,height: 175,cropping: false})
            return res
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
    DishesTile=(props)=>(
        <View style={{borderRadius:5,flexDirection:'column',backgroundColor:colors.OVERLAY_BACKGROUND,marginHorizontal:10,marginTop:10,elevation:.5}}>
            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity style={{}} onPress={()=>{this.uploadImage()}}>
                    {
                        this.state.image.uri ?
                        <View>
                            <Image style={{width:100,height:100,borderRadius:10,margin:10,}} source={{uri:this.state.image.uri}} />
                            <View style={{position:'absolute',width:10,height:10,top:10,right:10,borderWidth:2,borderColor:'#000',backgroundColor:this.state.veg?'#00ff00':'#ff0000'}}></View>

                        </View>
                        :
                        <View style={{width:80,height:80,borderRadius:10,margin:10,justifyContent:'center',alignItems:'center'}}>
                            <MaterialIcons color={colors.TILE} name={"touch-app"} size={50} />
                        </View>
                        // <Image style={{width:80,height:80,borderRadius:10,margin:10,}} source={require('../../assets/tapToSelect.png')} />
                    }
                </TouchableOpacity>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text>VEG </Text>
                    <Switch value={this.state.veg} trackColor={{"false":'#FF0000',"true":'#00FF00'}} onValueChange={()=>{this.setState({veg:!this.state.veg})}} />
                </View>
                </View>

                
                <View style={{flexDirection:'column',justifyContent:'flex-start'}}>
                    <TextInput
                        style={{fontSize:23,color:colors.TEXT_PRIMARY,padding:4}}
                        placeholderTextColor={colors.TEXT_PRIMARY}
                        placeholder="Dish Name ..."
                        multiline={true}
                        value={this.state.dishName}
                        onChangeText={dishName => this.setState({ dishName })}
                    />

                    <TextInput
                        style={{fontSize:15,color:colors.TEXT_SECONDATY,padding:4}}
                        placeholderTextColor={colors.TEXT_SECONDATY}
                        placeholder="Sub Category...."
                        value={this.state.subCategory}
                        onChangeText={subCategory => this.setState({ subCategory })}
                    />
                    <TouchableOpacity style={{padding:4}} onPress={()=>{this.setState({dialog:true})}}>
                        {
                            !this.state.quantity.length==0 ? 
                            <View>
                                {   
                                    this.state.quantity.length==1?
                                    <Text>₹{this.state.quantity[0].price}</Text>
                                    :
                                    <View style={{flexDirection:'row'}}>
                                        <View style={{flexDirection:'column'}}>
                                            {
                                                this.state.quantity.map((price)=>(
                                                    <Text style={{color:colors.BLACK}}>{`₹${price.price}`}  </Text>
                                                ))     
                                            }
                                        </View>
                                        <View style={{flexDirection:'column'}}>
                                            {
                                                this.state.quantity &&
                                                this.state.quantity.map((price)=>(
                                                    <Text style={{color:colors.GREY}}>{`(${price.quantity.toUpperCase()})`}</Text>
                                                ))     
                                            }
                                        </View>
                                    </View>
                                }
                            </View>
                            :
                            <Text style={{color:colors.GREY}}>Submit price</Text>
                        }
                    </TouchableOpacity>

                </View>
            </View>
            <TextInput
                style={{fontSize:15,color:colors.TEXT_SECONDATY,textAlign:'center',marginTop:2,marginHorizontal:10}}
                placeholderTextColor={colors.TEXT_SECONDATY}
                placeholder="description"
                multiline={true}
                value={this.state.description}
                onChangeText={description => this.setState({ description })}
            />
        </View>
    )
    addQuantity=()=>{
        const {priceIndividual,quantityIndividual} = this.state
        let obj={price:priceIndividual,quantity:quantityIndividual}
        let quantity = this.state.quantity
        quantity = [...quantity,obj]
        this.setState({quantity,dialog:false,priceIndividual:'',quantityIndividual:''})
    }

    render(){
        return(
            <View style={{paddingTop:STATUSBAR_HEIGHT,flex:1}}>

                <StackHeader goBack={()=>{this.handleBackButtonClick()}} headerText="Post Dish " />
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:colors.BACKGROUND,padding:10,marginTop:20,marginLeft:10}}>
                    <Text style={{color:colors.BLACK,fontSize:20,fontFamily:'sans-serif-medium'}}>{this.props.route.params.name}</Text>
                    <TouchableOpacity disabled={this.state.posting} style={{marginRight:20}} onPress={()=>{this.setState({posting:true},()=>this.postDish())}} >
                        {
                            this.state.posting?
                            <Animatable.View animation="rotate" iterationCount={"infinite"}>
                                <Ionicons color={colors.TILE} name={"ios-save"} size={25} />    
                            </Animatable.View>
                            :
                            // <Animatable.View animation="rotate" iterationCount={this.state.posting?"infinite":1}>
                                <Ionicons color={colors.TILE} name={"ios-save"} size={25} />    
                            // </Animatable.View>
                        }

                    </TouchableOpacity>
                </View>
                <this.DishesTile/> 

                <ConfirmDialog 
                    visible={this.state.dialog}
                    onTouchOutside={() => this.setState({dialog: false})}
                    positiveButton={{
                        title: "OK",
                        onPress: () => {
                            if(!this.state.priceIndividual || !this.state.quantityIndividual) return
                            this.addQuantity()
                        }
                    }} 
                >   
                    <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                        <TextInput
                            style={{fontSize:15,color:colors.TEXT_SECONDATY,textAlign:'center',marginTop:2,marginHorizontal:10}}
                            placeholderTextColor={colors.TEXT_SECONDATY}
                            placeholder="Quantity"
                            value={this.state.quantityIndividual}
                            onChangeText={quantityIndividual => this.setState({ quantityIndividual })}
                        />
                        <TextInput
                            style={{fontSize:15,color:colors.TEXT_SECONDATY,textAlign:'center',marginTop:2,marginHorizontal:10}}
                            placeholderTextColor={colors.TEXT_SECONDATY}
                            placeholder="Price"
                            multiline={true}
                            value={this.state.priceIndividual}
                            
                            onChangeText={priceIndividual => {
                                this.setState({
                                    priceIndividual: priceIndividual.replace(/[^0-9]/g, ''),
                                });
                            }}
                        />
                    </View>      
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

let postModel = {
    "name":"",
    "description":"",
    "image":"",
    "veg":true,
    "subCategory":"",
    "quantity":[]
}