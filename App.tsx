import React, { useState, useEffect } from 'react'

import { StatusBar } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator, } from '@react-navigation/material-bottom-tabs'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

import { StackParamsList } from './sources/references/types/navigator'
import { View, Image } from 'react-native'
import { Colors } from './sources/references/colors'

import Home from './sources/screens/home';
import Search from './sources/screens/search'
import DetailManga from './sources/screens/detail-manga'
import ReadManga from './sources/screens/read-manga';
import SplashScreen from './sources/screens/splash-screen';
import GenreMangaList from './sources/screens/genre-manga-list';
import Bookmark from './sources/screens/bookmark';
import Menu from './sources/screens/menu';

const Tab = createMaterialBottomTabNavigator<StackParamsList>()
const Stack = createStackNavigator<StackParamsList>()

export default () => {
    useEffect(() => {
        StatusBar.setHidden(true)
    }, [])
    const MainBottomTab = () => {
        return (
            <Tab.Navigator
                sceneAnimationEnabled = {true}
                activeColor = {Colors.dark_color}
                barStyle = {{
                    backgroundColor: Colors.base_white,
                    borderTopColor: 'lightgrey',
                    borderTopWidth: 1
                }} 
                
            >
                <Tab.Screen
                    name = 'Home'
                    component = {Home}
                    options = {{
                        tabBarLabel: 'Home',                        
                        tabBarIcon: ( {color} ) => (
                            <Image source = {require('./sources/images/home.png')} style = {{ width: 20, height: 20, tintColor: color }} />
                        ),                        
                    }}
                    
                />
                <Tab.Screen
                    name = 'Search'
                    component = {Search}
                    options = {{
                        tabBarLabel: 'Search',
                        tabBarIcon: ( {color} ) => (
                            <Image source = {require('./sources/images/search.png')} style = {{ width: 20, height: 20, tintColor: color }} />
                        )
                    }}
                />
                <Tab.Screen
                    name = 'Bookmark'
                    component = {Bookmark}
                    options = {{
                        tabBarLabel: 'Bookmark',
                        tabBarIcon: ( {color} ) => (
                            <Image source = {require('./sources/images/bookmark-inactive.png')} style = {{ width: 20, height: 20, tintColor: color }} />
                        )
                    }}
                />
                <Tab.Screen
                    name = 'Menu'
                    component = {Menu}
                    options = {{
                        tabBarLabel: 'Lainnya',
                        tabBarIcon: ( {color} ) => (
                            <Image source = {require('./sources/images/menu.png')} style = {{ width: 20, height: 20, tintColor: color }} />
                        )
                    }}
                />
            </Tab.Navigator>
        )
    }
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions = {{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS
                }}
                initialRouteName = 'SplashScreen'
            >
                <Stack.Screen 
                    name = 'MainBottomTab'
                    component = {MainBottomTab}
                    options = {{
                        ...TransitionPresets.FadeFromBottomAndroid
                    }}
                />
                <Stack.Screen
                    name = 'DetailManga'
                    component = {DetailManga}
                />
                <Stack.Screen
                    name = 'ReadManga'
                    component = {ReadManga}
                />
                <Stack.Screen
                    name = 'SplashScreen'
                    component = {SplashScreen}
                />
                <Stack.Screen
                    name = 'GenreMangaList'
                    component = {GenreMangaList}
                />
            </Stack.Navigator>
            
        </NavigationContainer>
    )
}
