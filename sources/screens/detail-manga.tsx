import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, SafeAreaView, Dimensions, StyleSheet, FlatList, Animated, Easing } from 'react-native'

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { StackParamsList } from '../references/types/navigator'
import { Colors } from './../references/colors';
import { Fonts } from './../references/fonts';
import { BASE_URL } from './../references/base_url';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob'

type PropsList = {
    navigation: StackNavigationProp<StackParamsList, 'DetailManga'>
    route: RouteProp<StackParamsList, 'DetailManga'>
}

interface MangaType {
    title?: string,
    type?: string,
    author?: string,
    status?: string,
    manga_endpoint?: string,
    thumb?: string,
    chapter?: any,
    synopsis?: string,
    genre_list?: any
}

const DetailManga = (props: PropsList) => {
    const {route, navigation} = props
    const { Poppins, OpenSans } = Fonts
    const {width} = Dimensions.get('window')
    const [item, setitem] = useState<MangaType>()
    const [offset, setOffset] = useState(0)
    const [scaleTitle, setscaleTitle] = useState(new Animated.Value(0))
    const [isBookmark, setisBookmark] = useState(false)

    let scrollOffset = 0

    const handleScroll = (event: any) => {
        let currentOffset = event.nativeEvent.contentOffset.y;
        let direction = currentOffset > offset ? 'down' : 'up';
        console.log(currentOffset)
        setOffset(currentOffset)
        if (currentOffset > 330) {
            Animated.timing(scaleTitle, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.bounce
            }).start()
        }else {
            Animated.timing(scaleTitle, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.linear
            }).start()
        }
    }

    useEffect(() => {
        getData()
        checkIsBookmarked()
    }, [])

    const getData = async() => {
        RNFetchBlob.config({
            trusty: true
        })
        .fetch('GET', `${BASE_URL}/manga/detail/${route.params['endPoint']}`)
        .then(res => res.json())
        .then(resJSON => {
            setitem(resJSON)
        })
    }

    const bookmark = async(title: any, thumb: any, endpoint: any) => {        
        
        if (isBookmark) {
            setisBookmark(false)
        } else {            
            setisBookmark(true)
        }
        

    }

    const checkIsBookmarked = async() => {
        // AsyncStorage.removeItem('bookmark')
        // const bookmarkName = route.params['endPoint']
        // const bookmarkData = await AsyncStorage.getItem(bookmarkName)
        // if (bookmarkData != null) {
        //     setisBookmark(true)
        // }
        
    }


    return (
        <SafeAreaView
            style = {{
                backgroundColor: Colors.base_white,
                flex: 1
            }}
        >
            <ScrollView
                onScroll = {handleScroll}
            >
                <View
                    style = {{
                        width,
                        backgroundColor: Colors.dark_color,
                        height: 273
                    }}
                >
                    <Image
                        blurRadius = {0.5}
                        source = {{uri:item?.thumb}}
                        style = {StyleSheet.absoluteFillObject}
                    />
                    <LinearGradient
                        colors = {['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
                        style = {StyleSheet.absoluteFillObject}
                    />
                    
                </View>
                <View
                    style = {{
                        backgroundColor: Colors.base_white,
                        flex: 1,
                        marginTop: -15,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        paddingHorizontal: 20,
                        marginBottom: 20
                    }}
                >
                    <Image
                        source = {{uri: item?.thumb}}
                        style = {{
                            width: 200,
                            height: 255,
                            alignSelf: 'center',
                            borderRadius: 10,
                            marginTop: -165
                        }}
                    />
                    <Text
                        style = {{
                            fontFamily: OpenSans.SemiBold,
                            color: Colors.dark_color,
                            textAlign: 'center',
                            fontSize: 17,
                            letterSpacing: 0.6,
                            marginTop: 10
                        }}
                    >
                        {item?.title}
                    </Text>
                    {
                        item == undefined ?
                        null
                        :
                        <>
                            <View
                                style = {{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    marginTop: 10,
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style = {{
                                        fontFamily: OpenSans.SemiBold,
                                        fontSize: 14,
                                        marginRight: 3
                                    }}
                                >
                                    Genre :
                                </Text>
                                {
                                item?.genre_list.map((item: any, index: any) => {
                                        return (
                                            <TouchableOpacity
                                                style = {{
                                                    borderRadius: 20,
                                                    backgroundColor: '#DDDDDD',
                                                    paddingVertical: 2,
                                                    paddingHorizontal: 5,
                                                    marginBottom: 5,
                                                    marginRight: 5
                                                }}
                                            >
                                                <Text
                                                    style = {{
                                                        fontFamily: OpenSans.Regular,
                                                        fontSize: 14,
                                                        color: Colors.dark_color
                                                    }}
                                                >
                                                    {item.genre_name}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                            <View
                                style = {{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    marginTop: 5,
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style = {{
                                        fontFamily: OpenSans.SemiBold,
                                        fontSize: 14,
                                        marginRight: 3
                                    }}
                                >
                                    Author:
                                </Text>
                                <Text
                                    style = {{
                                        fontSize: 14,
                                        fontFamily: OpenSans.Regular
                                    }}
                                >
                                    {item.author}
                                </Text> 
                            </View>

                            <View
                                style = {{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    marginTop: 5,
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style = {{
                                        fontFamily: OpenSans.SemiBold,
                                        fontSize: 14,
                                        marginRight: 3
                                    }}
                                >
                                    Type:
                                </Text>
                                <Text
                                    style = {{
                                        fontSize: 14,
                                        fontFamily: OpenSans.Regular
                                    }}
                                >
                                    {item.type}
                                </Text> 
                            </View>

                            <View
                                style = {{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    marginTop: 5,
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style = {{
                                        fontFamily: OpenSans.SemiBold,
                                        fontSize: 14,
                                        marginRight: 3
                                    }}
                                >
                                    Status:
                                </Text>
                                <Text
                                    style = {{
                                        fontSize: 14,
                                        fontFamily: OpenSans.Regular
                                    }}
                                >
                                    {item.status}
                                </Text> 
                            </View>
                            <Text
                                style = {{
                                    marginHorizontal: 10,
                                    textAlign: 'center',
                                    fontSize: 14,
                                    fontFamily: OpenSans.SemiBold,
                                    letterSpacing: 0.6,
                                    marginTop: 3
                                }}
                            >
                                Sinopsis
                            </Text>
                            <Text
                                style = {{
                                    textAlign: 'justify',
                                    fontSize: 14,
                                    fontFamily: OpenSans.Regular,
                                    marginTop: 3
                                }}
                            >
                                {item.synopsis}
                            </Text>
                            <TouchableOpacity
                                activeOpacity = {0.7}
                                style = {{
                                    backgroundColor: '#F6C600',
                                    alignSelf: 'center',
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    marginTop: 10,
                                    borderRadius: 20
                                }}
                                onPress = {() => {
                                    let chapter = item.chapter[item.chapter.length - 1].chapter_title.replace(/[^0-9]/g,'')
                                    
                                    navigation.navigate('ReadManga', {
                                        fromScreen: 'DetailManga',
                                        chapter,
                                        endPoint: route.params['endPoint']
                                    })
                                }}
                            >
                                <Text
                                    style = {{
                                        fontFamily: OpenSans.SemiBold,
                                        fontSize: 14,
                                        letterSpacing: 1,
                                        color: Colors.dark_color
                                    }}
                                >
                                    BACA
                                </Text>
                            </TouchableOpacity>
                            <Text
                                style = {{
                                    fontSize: 14,
                                    fontFamily: OpenSans.SemiBold,
                                    color: Colors.dark_color,
                                    letterSpacing: 0.6,
                                    textTransform: 'uppercase',
                                    marginVertical: 20,
                                }}
                            >
                                chapter {item.title}
                            </Text>
                            {
                                item.chapter.map((item: any, index: any) => {
                                    return (
                                        <TouchableOpacity
                                            key = {index}
                                            activeOpacity = {0.7}
                                            style = {{
                                                flexDirection: 'row',
                                                marginBottom: 20,
                                                alignItems: 'center',
                                            }}
                                            onPress = {() => {
                                                let chapter = item.chapter_title.replace(/[^0-9]/g,'')
                                                navigation.navigate('ReadManga', {
                                                    fromScreen: 'DetailManga',
                                                    chapter,
                                                    endPoint: route.params['endPoint']
                                                })
                                            }}
                                        >
                                            <View
                                                style = {[StyleSheet.absoluteFillObject, {
                                                    backgroundColor: Colors.silver,
                                                    borderRadius: 10,
                                                    opacity: 0.3
                                                }]}
                                            />
                                            <View
                                                style = {{
                                                    padding: 10,
                                                    borderRadius: 10,
                                                    backgroundColor: '#6a89cc',
                                                }}
                                            >
                                                <Image
                                                    source = {require('../images/open-book.png')}
                                                    style = {{
                                                        width: 20,
                                                        height: 20,
                                                        tintColor: 'white'
                                                    }}
                                                />
                                            </View>
                                            <Text
                                                numberOfLines = {1}
                                                style = {{
                                                    fontSize: 13,
                                                    fontFamily: OpenSans.Regular,
                                                    marginLeft: 20,
                                                }}
                                            >
                                                {item.chapter_title}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </>
                        
                    }
                </View>
            </ScrollView>
            {item == undefined ?
            null
            :
            <View
                style = {{
                    position: 'absolute',
                    bottom: 20, right: 20,
                }}
            >
                <TouchableOpacity
                    onPress = {() => bookmark(item.title, item.thumb, item.manga_endpoint)}
                    activeOpacity = {0.6}
                    style = {{
                        padding: 8,
                        borderRadius: 40,
                        backgroundColor: Colors.active_color
                    }}
                >
                    <Image
                        source = {isBookmark ? require('../images/bookmark-active.png') : require('../images/bookmark-inactive.png')}
                        style = {{
                            width: 20,
                            height: 20
                        }}
                    />
                </TouchableOpacity>
            </View>}
            <View
                style = {{
                    flexDirection: 'row',
                    paddingHorizontal: 27,
                    paddingTop: 33,
                    paddingBottom: 20,
                    alignItems: 'center',
                    position: 'absolute'
                }}
            >
                <View
                    style = {[StyleSheet.absoluteFillObject]}
                >
                    <LinearGradient
                        colors = {Colors.title_linear}
                        style = {[StyleSheet.absoluteFillObject]}
                    />
                </View>
                <TouchableOpacity
                    activeOpacity = {0.7}
                    onPress = {() => navigation.goBack()}
                >
                    <Image
                        style = {{
                            width: 17,
                            height: 12,
                            marginRight: 27,
                        }}
                        source = {require('../images/arrow_back.png')}
                    />
                </TouchableOpacity>
                <Animated.Text
                    numberOfLines = {1}
                    style = {{
                        textAlign: 'center',
                        color: Colors.white,
                        marginRight: 27,
                        fontSize: 14,
                        fontFamily: OpenSans.SemiBold,
                        flex: 1,
                        justifyContent: 'space-between',
                        opacity: scaleTitle
                    }}
                >
                    {item?.title}
                </Animated.Text>
            </View>
        </SafeAreaView>

    )
}

export default DetailManga