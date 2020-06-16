import {postRequest,getRequest} from '../../services/NetworkRequest'
import RNFetchBlob from 'rn-fetch-blob'

import urls from '../../constants/urls'
import AsyncStorage from '@react-native-community/async-storage'
import storageKeys from '../../constants/storageKeys'
export const validate = (name,mobileNumber,username,password,confirmPassword)=>{
    if(mobileNumber && username && password && confirmPassword){
        if(mobileNumber.length==10 && mobileNumber.substring(0,1)){
            if(username.length>=8){
                if(password.length>=10){
                    if(password==confirmPassword){
                        return(
                            {
                                error:false,
                                body:{
                                    name:name,
                                    mobileNumber:mobileNumber,
                                    username:username,
                                    password:password
                                }
                            }
                        )
                    }else{
                        return(
                            {
                                error:true,
                                msg:'Password Does Not Match'
                            }
                        )                         
                    }
                }else{
                    return(
                        {
                            error:true,
                            msg:'Password Should Have Atleast 10 Characters'
                        }
                    ) 
                }
            }else{
                return(
                    {
                        error:true,
                        msg:'Username Should Have Atleat 8 Characters'
                    }
                )   
            }
        }else{
            return(
                {
                    error:true,
                    msg:"Mobile Number Incorrect"
                }
            )
        }
    }else{
        return(
            {
                error:true,
                msg:'Enter All Fields'
            }
        );
    }
}

export const signupUser = async(body)=>{
    const url = urls.SIGNUP
    let data = await postRequest(url,{'Content-Type': 'application/json', 'Accept': 'application/json'},JSON.stringify(body))  
    data = await data.json()
    return data
}

export const loginUser=async(username,password)=>{
    const url = urls.LOGIN
    let data= await postRequest(url,{'Content-Type': 'application/json', 'Accept': 'application/json'},JSON.stringify({username,password}))
    data = await data.json()
    return(data)
}

export const facebookSignup=async(id,cb)=>{
    const url = urls.FACEBOOK_LOGIN
    const resp = await getRequest(url,{"access_token":id})
    await AsyncStorage.setItem(storageKeys.TOKEN,resp.token)
    cb(resp)
}