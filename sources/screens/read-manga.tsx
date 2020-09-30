import React, { useState, useEffect, useRef } from 'react'
import { View, Text, SafeAreaView, Image, Dimensions, ScrollView, FlatList, Animated, Easing, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'


import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';

import { StackParamsList } from '../references/types/navigator'
import { BASE_URL } from './../references/base_url';
import { Colors } from './../references/colors';
import { Fonts } from './../references/fonts';
import LinearGradient from 'react-native-linear-gradient';
import RNFetchBlob from 'rn-fetch-blob';

type PropsList = {
    navigation: StackNavigationProp<StackParamsList, 'ReadManga'>
    route: RouteProp<StackParamsList, 'ReadManga'>
}

type imageList = {
    chapter_image_link: any
}


const ReadManga = (props: PropsList) => {
    const { navigation, route } = props
    const { width, height } = Dimensions.get('window')
    const {OpenSans} = Fonts
    const [chapterEndPoint, setChapterEndPoint] = useState('')

    const [chapterTitle, setchapterTitle] = useState()
    const [chapterImage, setchapterImage] = useState<imageList[]>([])    
    const [translateY, setTranslateY] = useState(new Animated.Value(0))
    const [loading, setloading] = useState(true)
    const [chapter, setchapter] = useState(route.params['chapter'])
    const [prevDisabled, setprevDisabled] = useState(true)
    const [nextDisabled, setnextDisabled] = useState(true)
    const [prevEndPoint, setprevEndPoint] = useState('')
    const [nextEndPoint, setnextEndPoint] = useState('')
    const [opacity, setopacity] = useState(new Animated.Value(1))
    const [refreshing, setrefreshing] = useState(false)

    useEffect(() => {
        getData(chapter)
    }, [])
    const getData = async(newChapter: any) => {
        setprevDisabled(false)
        setnextDisabled(false)
        setloading(true)
        RNFetchBlob.config({
            trusty: true
        })
        .fetch('GET' ,`${BASE_URL}/manga/detail/${route.params['endPoint']}`)
        .then(res => res.json())
        .then(resJSON => {
            for (let index = 0; index < resJSON.chapter.length; index++) {
                const chapterNumber = resJSON.chapter[index].chapter_title.replace(/[^0-9]/g,'')
                if (newChapter == chapterNumber) {                    
                    if(index == 0){
                        setnextDisabled(true)
                    }
                    if (index == resJSON.chapter.length - 1) {
                        setprevDisabled(true)
                    }
                    if (index != 0) {
                        setnextEndPoint(resJSON.chapter[index - 1].chapter_title.replace(/[^0-9]/g,''))
                        console.log(resJSON.chapter[index - 1].chapter_title.replace(/[^0-9]/g,''))
                    }
                    if (index != resJSON.chapter.length - 1) {
                        setprevEndPoint(resJSON.chapter[index + 1].chapter_title.replace(/[^0-9]/g,''))
                        console.log(resJSON.chapter[index + 1].chapter_title.replace(/[^0-9]/g,''))
                    }
                                        
                    fetch(`${BASE_URL}/chapter/${resJSON.chapter[index].chapter_endpoint}`)
                        .then(res => res.json())
                        .then(resJSON => {                            
                            setchapterTitle(resJSON.title)
                            setchapterImage(resJSON.chapter_image)
                            console.log(typeof resJSON.chapter_image)
                            setloading(false)
                        })
                        .catch(error => {
                            console.warn(error)
                        })
                    break
                }
            }
        })
        .catch(error => {
            console.warn(error)
        })
    }
    const [offset, setOffset] = useState(0)
    const [scaleTitle, setscaleTitle] = useState(new Animated.Value(0))
    

    const handleScroll = (event: any) => {
        let currentOffset = event.nativeEvent.contentOffset.y;
        let direction = currentOffset > offset ? 'down' : 'up';
        setOffset(currentOffset)
        console.log(direction)
        if (direction == 'up') {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.bounce
            }).start()
            Animated.timing(translateY, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.bounce
            }).start()            
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.bounce
            }).start()
            Animated.timing(translateY, {
                toValue: 70,
                duration: 100,
                useNativeDriver: true
            }).start()
        }
    }
    
    const previousChapter = () => {
        if (prevDisabled == false) {
            setloading(true)
            setchapter(prevEndPoint)
            getData(prevEndPoint)
        }
    }

    const nextChapter = () => {
        if (nextDisabled == false) {
            setloading(true)
            setchapter(nextEndPoint)
            getData(nextEndPoint)
        }
    }


    return (
        <SafeAreaView
            style = {{
                backgroundColor: 'white',
                flex: 1
            }}
        >
            <FlatList
                refreshControl = {
                    <RefreshControl
                        refreshing = {refreshing} 
                        onRefresh = {() => { 
                            setrefreshing(true)
                            setTimeout(() => {
                                setloading(true)
                                setrefreshing(false)
                            }, 1500);
                            getData(chapter)
                        }}
                    />
                }
                data = {chapterImage}
                keyExtractor = {(item, index) => String(index)}
                onScroll = {handleScroll}
                renderItem = {({item}) => {
                    return(
                        <Image
                            source = {{uri: item.chapter_image_link}}
                            style = {{
                                width,
                                height: height * 0.75,
                                alignSelf: 'center'
                            }}
                            resizeMode = 'stretch'
                        />
                        // <ImageViewer
                        //     imageUrls = {[{url: item.chapter_image_link}]}
                        //     enableImageZoom = {true}
                        //     style = {{
                        //         width,
                        //         height: height * 0.75
                        //     }}
                        // />
                    )
                }}
            />
            {
                loading == false ?
                <>
                    <Animated.View
                        style = {{
                            width,
                            position: 'absolute',
                            height: 50,
                            top: 0,
                            opacity
                        }}
                    >
                        <LinearGradient 
                            colors = {['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.1)']}
                            style = {StyleSheet.absoluteFillObject}
                        />
                        <Text
                            numberOfLines = {1}
                            style = {{
                                marginHorizontal: 10,
                                color: 'white',
                                fontFamily: OpenSans.Regular,
                                paddingVertical: 10,
                                letterSpacing: 1,
                                textAlign: 'center'
                            }}
                        >
                            {chapterTitle}
                        </Text>
                    </Animated.View>
                    <Animated.View
                        style = {{
                            position: 'absolute',
                            bottom: 10,
                            paddingVertical: 5,
                            paddingHorizontal: 20,
                            backgroundColor: Colors.dark_color,
                            alignSelf: 'center',
                            borderRadius: 40,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transform: [{translateY}]
                        }}
                    >
                        <TouchableOpacity
                            disabled = {prevDisabled}
                            onPress = {previousChapter}
                            style = {{
                                borderRadius: 25,
                                padding: 10,
                            }}
                        >
                            <Image
                                source = {require('../images/ic_arrow_back_white.png')}
                                style = {{
                                    width: 17,
                                    height: 17,
                                    opacity: prevDisabled ? 0.5 : 1
                                }}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style = {{
                                borderRadius: 30,
                                padding: 10,
                                marginHorizontal: 10
                            }}
                            onPress = {() => {
                                navigation.navigate('DetailManga', {
                                    fromScreen: 'Home',
                                    endPoint: route.params['endPoint']
                                })
                            }}
                        >
                            <Image
                                source = {require('../images/list.png')}
                                style = {{
                                    width: 22,
                                    height: 22,
                                    tintColor: 'white',                            
                                }}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled = {nextDisabled}
                            onPress = {nextChapter}
                            style = {{
                                borderRadius: 25,
                                padding: 10,
                            }}
                        >
                            <Image
                                source = {require('../images/ic_arrow_back_white.png')}
                                style = {{
                                    width: 17,
                                    height: 17,
                                    transform: [{rotate: '180deg'}],
                                    tintColor: 'white',
                                    opacity: nextDisabled ? 0.5 : 1
                                }}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                </>
                :
                <View
                    style = {{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'white'
                    }}
                >
                    <ActivityIndicator size = 'small' color = {Colors.dark_color} />
                </View>
            }
        </SafeAreaView>
    )
}

export default ReadManga