import React,{Component} from 'react'
import {Text,View,Picker,Image,Dimensions,BackHandler,StatusBar} from 'react-native'
import { Appbar,Snackbar } from 'react-native-paper';
import {MyContext} from '../AppNavigation/AppNavigation'
import colors from '../constants/colors';
import {StackHeader} from '../components/StackHeader'
import AsyncStorage from '@react-native-community/async-storage';
import storageKeys from '../constants/storageKeys';
import urls, { BASE_URL } from '../constants/urls';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { getRequest } from '../services/NetworkRequest';
import Carousel ,{Pagination} from 'react-native-snap-carousel';
import CompressImage from 'react-native-compress-image';

export class DetailsScreen extends Component {
    constructor(props){
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.state={
            data:{},
            entries:[],
            currentImg:0,
            loading:true,
            Snackbar:false,
            snackbarMsg:'',
        }
    }
    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.getData()
    }

    handleBackButtonClick=()=>{
        this.props.navigation.navigate("Menu");
        return true;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    getData=async()=>{
        const token = await AsyncStorage.getItem(storageKeys.TOKEN)
        const headers = {'Content-Type': 'application/json', 'Accept': 'application/json','Authorization':`bearer ${token}`}
        try{
            let data = await getRequest(urls.DETAILS,headers)
            // data = await data.json(
            this.setState({data:data.details[0],entries:data.details[0].images,loading:false})
        }catch(err){
            this.setState({snackbarMsg:'Error Retrieving Data',Snackbar:true})
        }
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={{width:deviceWidth,}}>
                <Image style={{width:'100%',height:200,backgroundColor:colors.TILE}} source={{uri:item}} />
            </View>
        );
    };

    

    render(){
        
        return(
            <View style={{paddingTop:STATUSBAR_HEIGHT,flex:1,backgroundColor:colors.BACKGROUND}}>
                <StackHeader headerText="Contact Us" goBack={()=>{this.props.navigation.navigate("Menu")}} />
                
                {
                    this.state.loading?
                    <View style={{flex:1,backgroundColor:'#fff',justifyContent:'center'}}>
                        <Image source={require('../assets/splash.gif')} />
                    </View>
                    :
                    <View>
                
                        <View style={{justifyContent:'center',backgroundColor:colors.OVERLAY_BACKGROUND,alignItems:'center',flexDirection:"column",padding:10,marginBottom:20}}>

                            <Carousel
                                ref={c => {
                                    this._carousel = c;
                                }}
                                data={this.state.entries}
                                renderItem={this._renderItem}
                                sliderWidth={deviceWidth*.95}
                                itemWidth={deviceWidth}
                                layout={'tinder'} 
                                layoutCardOffset={`18`}
                                dotsLength={3}
                                activeDotIndex={3}
                                onSnapToItem={index => {
                                    this.setState({currentImg:index})
                                }}
                                
                                />
                            <Pagination activeDotIndex={this.state.currentImg} dotsLength={this.state.entries.length} />
                        </View>
                        {   this.state.data &&
                        <View style={{flexDirection:'column',backgroundColor:colors.OVERLAY_BACKGROUND,padding:10}}>
                            <Text style={{fontSize:16}}>{this.state.data.address}</Text>
                            <Text style={{fontSize:13,color:colors.TEXT_SECONDATY}}>Address</Text>

                            <View style={{backgroundColor:colors.TILE,paddingHorizontal:5,height:.5,marginVertical:20}}></View>

                            <View style={{flexDirection:'row'}}>
                                {   this.state.data.contact &&
                                    this.state.data.contact.map((contact,index)=>(
                                        <Text style={{fontSize:16}}>{contact} {this.state.data.contact.length-1==index?'':','} </Text>
                                        ))
                                }
                            </View>
                            <Text style={{fontSize:13,color:colors.TEXT_SECONDATY}}>Contact</Text>

                            <View style={{backgroundColor:colors.TILE,paddingHorizontal:5,height:.5,marginVertical:20}}></View>

                            <Text style={{fontSize:16}}>{this.state.data.email}</Text>
                            <Text style={{fontSize:13,color:colors.TEXT_SECONDATY}}>Email</Text>
        
                        </View>
                        }
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
const ENTRIES1 = ["http://192.168.43.3:3000/images/1592050439295.jpg", "http://192.168.43.3:3000/images/1592050439295.jpg", "http://192.168.43.3:3000/images/1592050439295.jpg"]
const deviceWidth = Dimensions.get('window').width
