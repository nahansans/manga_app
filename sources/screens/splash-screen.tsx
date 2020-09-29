import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { Fonts } from './../references/fonts';
import { Colors } from './../references/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamsList } from '../references/types/navigator'

type PropsList = {
    navigation: StackNavigationProp<StackParamsList, 'SplashScreen'>
}

const SplashScreen = (props: PropsList) => {
    const { OpenSans } = Fonts
    const {navigation} = props

    useEffect(() => {
        setTimeout(() => {
            navigation.replace('MainBottomTab')
        }, 1500);
    }, [])

    return (
        <View
            style = {{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.dark_color
            }}
        >
            <Text
                style = {{
                    fontFamily: OpenSans.SemiBold,
                    color: 'white',
                    letterSpacing: 2,
                    fontSize: 23,
                    textTransform: 'uppercase'
                }}
            >
                manga
            </Text>
            <View
                style = {{
                    paddingVertical: 2,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    backgroundColor: 'white'
                }}
            />
        </View>
    )
}

export default SplashScreen