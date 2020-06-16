import React, { Component } from 'react';
import { Appbar } from 'react-native-paper';
import {View, Platform, NativeModules,StatusBar } from 'react-native'
import colors from '../constants/colors';

export const StackHeader = class extends Component {
    constructor(props){
        super(props)
    }
  render() {
    return (
      <View style={{}}>
      <Appbar.Header style={{backgroundColor:colors.HEADER}}>
        <Appbar.BackAction
            color={colors.WHITE}
            onPress={this.props.goBack}
        />
        <Appbar.Content
            color={colors.WHITE}
            title={this.props.headerText}
        />
      </Appbar.Header>
      </View>
    );
  }
}
