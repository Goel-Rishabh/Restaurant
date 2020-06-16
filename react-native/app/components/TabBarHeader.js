import React, { Component } from 'react';
import { Appbar } from 'react-native-paper';
import {View, Platform, NativeModules,StatusBar } from 'react-native'
import colors from '../constants/colors';

export class TabBarHeader extends Component {
    constructor(props){
        super(props)
    }
  render() {
    // const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
    const STATUSBAR_HEIGHT = StatusBar.currentHeight
    return (
      <View style={{marginBottom:10}}>
      <Appbar.Header 
        color={colors.TEXT_PRIMARY}
        style={{backgroundColor:colors.TILE}}>
        
        <Appbar.Content
            color={colors.WHITE}
            titleStyle={{alignSelf:'center',fontWeight:'200',fontSize:25}}
            title={this.props.headerText}
        />
      </Appbar.Header>
      </View>                
    )
              
  }
}

