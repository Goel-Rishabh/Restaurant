import React,{Component} from 'react'
import {Text,View,Picker,Image,Dimensions,BackHandler,StatusBar} from 'react-native'
import { Appbar,TouchableRipple } from 'react-native-paper';
import {MyContext} from '../AppNavigation/AppNavigation'
import colors from '../constants/colors';
import {StackHeader} from '../components/StackHeader'
import AsyncStorage from '@react-native-community/async-storage';
import storageKeys from '../constants/storageKeys';
import { BASE_URL } from '../constants/urls';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export class NotificationScreen extends Component {
    constructor(props){
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.state={
            data:''
        }
    }
    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        let data = await AsyncStorage.getItem(storageKeys.NOTIFICATION)
        data = await JSON.parse(data)
        if(data){
            this.setState({data:data.data})
        }
    }

    handleBackButtonClick=()=>{
        this.props.navigation.navigate("Menu");
        return true;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render(){
        const {data} = this.state
        
        return(
            <View style={{paddingTop:STATUSBAR_HEIGHT,flex:1}}>
                <StackHeader headerText="Notification" goBack={()=>{this.props.navigation.navigate("Menu")}} />
                {
                    this.state.data ?
                    <View style={{backgroundColor:colors.OVERLAY_BACKGROUND,marginTop:10,padding:10}}>

                        <Text style={{fontSize:22,fontWeight:'bold',color:colors.TEXT_PRIMARY,marginVertical:5}}>{data.title}</Text>
                        {
                            data.image ?
                            <TouchableRipple style={{height:200,borderWidth:.6,borderColor:colors.OVERLAY_TILE,margin:5,justifyContent:'center',alignItems:'center'}}>
                                
                                <Image style={{width:390,height:200}} source={{uri:data.image}} />
                                       
                            </TouchableRipple> 
                            :
                            null 
                        }                         
                        <Text style={{fontSize:16,color:colors.TEXT_SECONDATY,paddingVertical:10}}>{data.message}</Text>
                    </View>
                    :
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Image style={{width:250,height:250,tintColor:colors.TILE}} source={require('../assets/noPreview.png')} />
                    </View>
                }
            </View>
        );
    }
}

const STATUSBAR_HEIGHT = StatusBar.currentHeight


