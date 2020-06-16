import React from 'react'
import {View,Text,Dimensions,StyleSheet} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import storageKeys from '../constants/storageKeys'
// import RNFetchBlob from 'rn-fetch-blob';


export async function getRequest(url="",headers={}) {

    let response = await fetch(url,{
        method:'GET',
        headers:headers
    });
    let responseJson = await response.json();
    return responseJson;
}


export async function postRequest(url="",headers={},body={}) {

    let response = await fetch(url,{
        method:'POST',
        headers:headers,
        body:body
    });
    // let responseJson = await response.json();
    return response;
}


export async function putRequest(url="",headers={},body={}) {
    let response = await fetch(url,{
        method:'PUT',
        body:body,
        headers:headers
    });
    let responseJson = await response.json();
    return responseJson;
}

export async function deleteRequest(url="",headers={},body={}) {

    let response = await fetch(url,{
        method:'DELETE',
        headers:headers,
        body:JSON.stringify(body)
    });
    // let responseJson = await response.json();
    return response;
}
