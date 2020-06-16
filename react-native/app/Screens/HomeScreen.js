import React,{Component} from 'react'
import {Text,View,Picker,StyleSheet,Dimensions,BackHandler,TouchableOpacity,Button,StatusBar,Image,Animated,TextInput, ImageBackground} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ScrollView } from 'react-native-gesture-handler';
import {Snackbar} from 'react-native-paper'
import {TabBarHeader} from '../components/TabBarHeader'
import colors from '../constants/colors'
const STATUSBAR_HEIGHT = StatusBar.currentHeight
import urls, { BASE_URL } from '../constants/urls'
import {getRequest,postRequest,deleteRequest} from '../services/NetworkRequest'
import storageKeys from '../constants/storageKeys'
import AsyncStorage from '@react-native-community/async-storage';
import FeatherIcon from 'react-native-vector-icons/Feather'
import {ConfirmDialog,Dialog} from 'react-native-simple-dialogs'
import RBSheet from "react-native-raw-bottom-sheet";
import { FloatingAction } from "react-native-floating-action";
import { MyContext } from '../AppNavigation/AppNavigation';
import DeviceInfo from 'react-native-simple-device-info';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
let {width, height} = Dimensions.get('window');

export class HomeScreen extends Component {

    constructor(props){
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.state={
            filterText:'',
            menuFilterSelected:[],
            height:new Animated.Value(0),
            width:new Animated.Value(0),
            categories:[],
            loading:true,
            dishes:[],
            snackbarMsg:'',
            Snackbar:false,
            dishesOriginal:[],
            confirmDialog:false,
            newCategory:'',
            backClickCount:0,
        }
        this.springValue = new Animated.Value(100);

    }
    
    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.getData()
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

    handleBackButtonClick=()=>{
        this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();
        return true;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    getData=async()=>{
        try{
            const url = urls.GET_DISHES
            const url2 = urls.GET_CATEGORY
            const token = await AsyncStorage.getItem(storageKeys.TOKEN)
            const headers = {'Content-Type': 'application/json', 'Accept': 'application/json','Authorization':`bearer ${token}`}
            const dishes = await getRequest(url,headers)
            if(dishes.error){
                AsyncStorage.clear()
                this.setState({Snackbar:true,snackbarMsg:"Session Expired",loading:false})
            }
            const categories = await getRequest(url2,headers)
            this.setState({categories,dishes:[...dishes],dishesOriginal:[...dishes],loading:false})
        }catch(err){
            this.setState({Snackbar:true,snackbarMsg:'Error Retrieving Data'})
        }
    }

    HeaderFilterViewToggle=()=>{
        Animated.timing(this.state.height,{
            toValue:this.state.height._value==0?150:0,
            duration:400,
            useNativeDriver:false
        }).start()

        Animated.timing(this.state.width,{
            toValue:this.state.width._value==0?200:0,
            duration:400,
            useNativeDriver:false
        }).start(()=>{this.setState(prevState=>({menuMsg:prevState.menuMsg=="Menu"?"Close":"Menu"}))})
    }

    HeaderFilterView=(props)=>(
        <Animated.View style={{width:this.state.width,height:this.state.height,backgroundColor:'white',borderRadius:5,}}>
            <ScrollView>
                {
                    this.state.categories.map((category,index)=>(
                        <TouchableOpacity 
                            style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:8}}
                            onPress={()=>{
                                // let newArr = Array(arr.length).fill(0)
                                let newArr = this.state.menuFilterSelected
                                newArr[index] = !newArr[index]
                                this.setState({menuFilterSelected:newArr})
                            }}
                        >
                            <Text style={{marginLeft:10,fontSize:16}}>{category}</Text>
                            <View style={{alignSelf:'center',marginRight:10}}>
                                <Icon size={20} color={colors.TILE} name={this.state.menuFilterSelected[index]?'check':''} />
                            </View>
                        </TouchableOpacity>
                    ))
                }
            </ScrollView>
        </Animated.View>
    )

    headerFilterCategories=(arr)=>{
        let dishes = [...this.state.dishesOriginal]
        let newDishes = []
        dishes.map((category,index)=>{
            if(arr[index]){
                newDishes = [...newDishes,category]
            }
        })
        if(newDishes.length==0){
            newDishes = [...dishes]
        }
        this.setState({dishes:newDishes})

    }

    Header=(props)=>(
        <View style={{backgroundColor:colors.TILE,paddingVertical:STATUSBAR_HEIGHT,paddingHorizontal:10,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>

            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20,}}>

                <Text style={{color:colors.WHITE,fontSize:40,fontWeight:'bold'}}>Our Menu</Text>
                <TouchableOpacity 
                    onPress={()=>{this.HeaderFilterViewToggle()}}
                    style={{alignItems:'center',justifyContent:'space-evenly',backgroundColor:colors.OVERLAY_TILE,borderRadius:50,width:90,height:35,flexDirection:'row'}}
                >
                    
                    <Text style={{color:colors.WHITE,fontFamily:'Roboto'}}>Filter</Text>
                    <MaterialCommunityIcons color={colors.WHITE} style={{marginRight:5}} size={20} name="filter-variant"/>
                </TouchableOpacity>

            </View>
            <Animated.View style={{width:this.state.width,height:this.state.height,alignSelf:'flex-end'}}>
                    
                    <View style={{backgroundColor:'white',borderRadius:5}}>
                        <ScrollView>
                            {   
                                this.state.categories.length==0?
                                <Text style={{textAlign:'center',color:colors.TEXT_SECONDATY,padding:10}}>Nothing To Show Here Here</Text>
                                :
                                this.state.categories.map((category,index)=>(
                                    <TouchableOpacity 
                                        style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:8}}
                                        onPress={()=>{
    // let newArr = Array(arr.length).fill(0)
                                            let newArr = this.state.menuFilterSelected
                                            newArr[index] = !newArr[index]
                                            this.setState({menuFilterSelected:newArr},(this.headerFilterCategories(newArr)))
                                        }}
                                    >
                                        <Text style={{marginLeft:10,fontSize:16}}>{category.category}</Text>
                                        <View style={{alignSelf:'center',marginRight:10}}>
                                            <Icon size={20} name={this.state.menuFilterSelected[index]?'check':''} />
                                        </View>
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                </View>
            </Animated.View>
            <View
                animation="lightSpeedIn"
                easing={"ease-in-circ"}
                // delay={200}
                style={{flexDirection:'row',borderWidth:.5,borderColor:colors.WHITE,backgroundColor:colors.WHITE,marginHorizontal:10,borderRadius:10,marginTop:20}}
                >
                <TextInput
                    style={{flex:8,fontSize:16,paddingHorizontal:20}}
                    placeholderTextColor={colors.GREY}
                    placeholder="Start typing to search ..."
                    value={this.state.filterText}
                    onChangeText={filterText => {
                        this.setState({ filterText },()=>{this.filterDishes()})
                    }}
                    // onEndEditing={()=>{this.filterDishes()}}

                />   
                {   
                    <TouchableOpacity 
                        onPress={()=>{this.setState({filterText:'',filterContent:[],dishes:this.state.dishesOriginal})}} 
                        style={{justifyContent:'center',alignItems:'center',flex:2,}}
                    >
                        <Icon size={25} name={this.state.filterText? "cancel" : "search"} color={colors.TILE} />
                    </TouchableOpacity>         
                }

            </View> 
        </View>
    )

    filterDishes=()=>{
        let filterText = this.state.filterText.toLowerCase()
        let dishesOriginal = [...this.state.dishesOriginal]
        if(filterText==''){
            this.setState({dishes:dishesOriginal})
            return
        }
        let dishes = [...this.state.dishes]
        let filteredDishes = []

        dishesOriginal.map((category)=>{
            let obj = Object.assign({},category)
            obj.dishes = []
            category.dishes.map((dish)=>{
                if(dish.name.toLowerCase().includes(filterText)){
                    obj.dishes = [...obj.dishes,dish]
                }
            })
            if(obj.dishes.length>0){
                filteredDishes=[...filteredDishes,obj]
            }
            obj = {}

        })
        this.setState({dishes:filteredDishes,menuFilterSelected:[]}) 
    }

    DishesTile=(props)=>(
        <View style={{borderRadius:5,flexDirection:'column',backgroundColor:colors.OVERLAY_BACKGROUND,paddingHorizontal:10,marginTop:5}}>
            <Text style={{borderBottomWidth:1,width:'80%',paddingHorizontal:10,borderBottomColor:colors.BORDER,alignSelf:'center',marginBottom:10}}></Text>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',}}>
                <View style={{flexDirection:'row'}}>
                    <View>
                        <Image style={{width:100,height:100,borderRadius:10,margin:10,}} source={{uri:props.image}} />
                        <View style={{position:'absolute',width:10,height:10,top:10,right:10,borderWidth:2,borderColor:'#000',backgroundColor:props.veg?'#00ff00':'#ff0000'}}></View>
                    </View>
                    
                    <View style={{flexDirection:'column',justifyContent:'flex-start',marginTop:10}}>
                        <Text style={{fontSize:20,color:colors.TEXT_PRIMARY,marginTop:5}}>{props.name}</Text>
                        {/* <Text style={{fontSize:15,color:colors.TEXT_SECONDATY}}>{props.description}</Text> */}
                        <Text style={{fontSize:12,color:colors.TEXT_SECONDATY,marginVertical:5,fontFamily:'monospace'}}>{props.category}</Text>
                        {
                            props.quantity.length==1?
                            <Text style={{fontSize:13}}>₹{props.quantity[0].price}</Text>
                            :
                            <View style={{flexDirection:'row'}}>
                                <View style={{flexDirection:'column'}}>
                                    {
                                        props.quantity.map((price)=>(
                                            <Text style={{color:colors.BLACK,fontSize:13}}>{`₹${price.price}`}  </Text>
                                        ))     
                                    }
                                </View>
                                <View style={{flexDirection:'column'}}>
                                    {
                                        props.quantity.map((price)=>(
                                            <Text style={{color:colors.GREY,fontSize:13}}>{`(${price.quantity.toUpperCase()})`}</Text>
                                        ))     
                                    }
                                </View>
                            </View>
                        }

                    </View>
                </View>
                {/* Add Favorite Tag */}
            </View>
            {
                props.description &&
                <Text style={{fontSize:15,color:colors.TEXT_SECONDATY,textAlign:'center',margin:10}}>{props.description}</Text>
            }
        </View>
    )

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
            this.setState({Snackbar:true,snackbarMsg:'Some Error Occured. Try Again Later'})
        }
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:colors.BACKGROUND}}>
                
                <this.Header openTextInput={()=>{this.RBSheet.open()}} />
                {

                    this.state.loading?
                    
                    <View style={{flex:1,backgroundColor:'#fff',justifyContent:'center'}}>
                        <Image source={require('../assets/splash.gif')} />
                    </View>
                    :
                    <View style={{flex:1}}>
                    <ScrollView>
                        {
                            this.state.dishes.length>0 &&
                            this.state.dishes.map(data=>{
                                const {name,dishes,_id} = data
                                return(
                                    <View style={{backgroundColor:colors.OVERLAY_BACKGROUND,marginTop:5}}>
                                        <View style={{flexDirection:'row',marginLeft:20,alignItems:'center',justifyContent:"space-between",marginTop:30}}>
                                            <View style={{flexDirection:'column'}}>
                                                <Text style={{color:colors.BLACK,fontSize:20,fontFamily:'sans-serif-medium'}}>{`${name}`} </Text>
                                                <Text style={{fontSize:12,fontWeight:'normal',alignSelf:'flex-start'}}>{`(${dishes.length} items)`}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            {
                                                dishes.length==0?
                                                <Text style={{backgroundColor:colors.OVERLAY_BACKGROUND,textAlign:'center',color:colors.GREY,padding:10,marginTop:10}}>Add Some Dishes To See Here</Text>
                                                :
                                                <View>
                                                    {
                                                        dishes.map((dish)=>(
                                                            <this.DishesTile dishId={dish._id} categoryId={_id} name={dish.name} description={dish.description} veg={dish.veg} category={dish.subCategory} quantity={dish.quantity} image={dish.image} />
                                                        ))
                                                    }

                                                </View>
                                            }
                                        </View>

                                    </View>
                                )
                            })
                        }
                    </ScrollView>

                    <RBSheet
                        ref={ref => {
                            this.RBSheet = ref;
                        }}
                        closeOnDragDown={false}
                        height={80}
                        openDuration={250}
                        animationType={"fade"}
                    >

                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:5,padding:5,marginTop:5,borderWidth:.5,borderRadius:10,borderColor:colors.TILE}}>
                            <TextInput
                                style={{fontSize:16,flex:18}}
                                placeholderTextColor={colors.GREY}
                                placeholder="Start typing ..."
                                multiline={true}
                                value={this.state.newCategory}
                                onChangeText={newCategory => {
                                    this.setState({ newCategory })
                                }}

                            />
                            <TouchableOpacity onPress={()=>{this.addCategory(this.state.newCategory,()=>{this.RBSheet.close()}) }} style={{marginRight:10,flex:2}}>
                                <Icon name="send" size={25} color={colors.TILE} />
                            </TouchableOpacity>  
                        </View>
                    </RBSheet>
                    </View>

                }
                    <Snackbar
                        visible={this.state.Snackbar}
                        duration={Snackbar.DURATION_SHORT}
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
                    <Dialog
                        visible={this.state.confirmDialog}
                        onTouchOutside={() => this.setState({confirmDialog: false})}
                        
                    >
                        <View>
                            {
                                this.state.dishesOriginal.map((dish)=>(
                                    <TouchableOpacity onPress={()=>{this.deleteCategory(dish)}} >
                                        <Text style={{fontSize:18,padding:5,color:colors.TEXT_SECONDATY}}>{dish.name}</Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>

                    </Dialog>
                    <MyContext.Consumer>
                        {
                            value=>(
                                <FloatingAction
                                    color={colors.TILE}
                                    actions={[
                                        {
                                            text: "Notification",
                                            icon: <Icon name="notifications" color={colors.WHITE} size={20} />,
                                            name: "Notification",
                                            position: 2 ,
                                            color:colors.TILE
                                        },{
                                            text: "Logout",
                                            icon: <AntDesign name={'logout'} color={colors.WHITE} size={20} />,
                                            name: "Logout",
                                            position: 1 ,
                                            color:colors.TILE
                                        },{
                                            text: "Contact",
                                            // icon: require("../assets/google.png"),
                                            icon:<Ionicons name={"ios-contact"} color={colors.WHITE} size={20} />, 
                                            name: "Details",
                                            position: 1 ,
                                            color:colors.TILE
                                        }
                                    ]}
                                    onPressItem={name => {
                                        if(name=='Logout'){
                                            this.logout(value)
                                        }else{
                                            this.props.navigation.navigate(name)
                                        }
                                    }}
                                />

                            )
                        }
                    </MyContext.Consumer>
                <Animated.View style={[styles.animatedView, {transform: [{translateY: this.springValue}],backgroundColor:colors.TILE}]}>
                    <Text style={styles.exitTitleText}>press back again to exit the app</Text>
                </Animated.View>  
                
                
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    appName: {
        fontSize: 20,
        textAlign: "center"
    },
    textInputUsername: {
        marginTop: 15
    },
    textInputPassword: {
        marginTop: 10
    },
    button: {
        marginTop: 10
    },
    team: {
        alignSelf: "auto",
        textAlign: "center"
    },
    forgotPassword: {
        textAlign: "right",
        marginTop: 15
    },
    animatedView: {
        width,
        elevation: 2,
        position: "absolute",
        bottom: 0,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    exitTitleText: {
        textAlign: "center",
        color: "#ffffff",
        marginRight: 10,
    },
    exitText: {
        color: "#e5933a",
        paddingHorizontal: 10,
        paddingVertical: 3
    }
    });