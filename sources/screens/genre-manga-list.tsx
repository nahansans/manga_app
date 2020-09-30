import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, ScrollView, Animated, Dimensions, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { BASE_URL } from './../references/base_url';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { StackParamsList } from '../references/types/navigator'
import { Fonts } from '../references/fonts';
import { Colors } from './../references/colors';
import LinearGradient from 'react-native-linear-gradient';
import RNFetchBlob from 'rn-fetch-blob';

type PropsList = {
    navigation: StackNavigationProp<StackParamsList, 'GenreMangaList'>
    route: RouteProp<StackParamsList, 'GenreMangaList'>
}

type mangaType = {
    title?: string,
    thumb?: string,
    endpoint?: string
}

const GenreMangaList = (props: PropsList) => {
    const {navigation, route} = props
    const {OpenSans} = Fonts
    const {height, width} = Dimensions.get('window')

    const [page, setpage] = useState(1)
    const [mangaData, setMangaData] = useState<mangaType[]>([])
    const [isLoadData, setisLoadData] = useState(false)
    const [anyOtherData, setanyOtherData] = useState(true)
    const [scale, setscale] = useState(new Animated.Value(1))

    useEffect(() => {
        getData()
    }, [])

    const getData = async() => {
        
        RNFetchBlob.config({
            trusty: true
        })
        .fetch('GET', `${BASE_URL}/genres/${route.params['endpoint']}${page}`)
        .then(res => res.json())
        .then(resJSON => {
            const manga_list = resJSON.manga_list
            const newData = JSON.parse(JSON.stringify(mangaData)).concat(manga_list)

            setMangaData(newData)
            console.log(resJSON.manga_list.length)
            if (resJSON.manga_list.length < 20) {
                setanyOtherData(false)
            } else {
                setpage(page + 1)
            }
            setisLoadData(false)
        })
    }

    const loadMore = () => {
        if (anyOtherData) {
            setanyOtherData(true)
            setisLoadData(true)

            getData()
        }
    }

    return (
        <SafeAreaView
            style = {{
                flex: 1,
                backgroundColor: Colors.base_white
            }}
        >
            <ScrollView>
                <View
                    style = {{
                        width,
                        backgroundColor: Colors.dark_color,
                        height: 108
                    }}
                >
                    <Text
                        style = {{
                            paddingHorizontal: 27,
                            paddingTop: 53,
                            color: 'white',
                            fontFamily: OpenSans.Regular,
                            fontWeight: 'bold',
                            fontSize: 14
                        }}
                    >
                        Genre {route.params['genreTitle']}
                    </Text>
                </View>
                <View
                    style = {{
                        backgroundColor: Colors.base_white,
                        flex: 1,
                        marginTop: -15,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    }}
                >
                    <Animated.FlatList
                        data = {mangaData}
                        keyExtractor = {(item, index) => String(index)}
                        style = {{
                            flex: 1,
                            margin: 10,
                        }}
                        contentContainerStyle = {{
                            justifyContent: 'center',
                        }}
                        numColumns = {2}
                        renderItem = {({item, index}) => {
                            const inputRange = [
                                (index - 1),
                                index,
                                (index + 1)
                            ]
                            const newScale = scale.interpolate({
                                inputRange,
                                outputRange: [1, 0.7,1]
                            })

                            return (
                                
                                <Animated.View
                                    style = {{
                                        flexDirection:'row',
                                        flexWrap: 'wrap',
                                        margin: 5,
                                        borderRadius: 10,
                                    }}
                                >
                                    <TouchableOpacity
                                        activeOpacity = {0.7}
                                        style = {{
                                            width: width * 0.45,
                                            height: 250,
                                            overflow: 'hidden',
                                            borderRadius: 10,
                                        }}
                                        onPress = {() => {
                                            navigation.navigate('DetailManga', {
                                                fromScreen: 'Home',
                                                endPoint: item.endpoint
                                            })
                                        }}
                                    >
                                        <Image
                                            source = {{ uri: item.thumb }}      
                                            style = {{
                                                width: '100%',
                                                height: 210,
                                                borderRadius: 10
                                            }}
                                        />
                                        <Text
                                            numberOfLines = {1}
                                            style = {{
                                                color: Colors.title_color,
                                                fontFamily: OpenSans.Regular,
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            )
                        }}
                    />
                    {
                        mangaData.length != 0 ?
                        <>
                            {
                                anyOtherData ? 
                                <>
                                {
                                    isLoadData ?
                                    <ActivityIndicator size = 'small' color = {Colors.dark_color} style = {{ marginBottom: 20 }} />
                                    :
                                    <TouchableOpacity
                                        onPress = {loadMore}
                                        style = {{
                                            alignSelf: 'center',
                                            padding: 10,
                                            borderColor: Colors.dark_color,
                                            borderWidth: 1,
                                            marginBottom: 20,
                                            borderRadius: 10
                                        }}
                                    >
                                        <Text
                                            style = {{
                                                fontFamily: OpenSans.Regular,
                                                fontSize: 14,
                                                letterSpacing: 1,
                                                color: Colors.dark_color,
                                                textAlign: 'center'
                                            }}
                                        >
                                            LOAD MORE
                                        </Text>
                                    </TouchableOpacity>
                                }
                                </>
                                : null
                            }
                        </>
                        :
                        <View
                            style = {{
                                marginHorizontal: 10,
                                flexDirection: 'row'
                            }}
                        >
                            <View
                                style = {{
                                    margin: 5,
                                    borderRadius: 10,
                                    width: width * 0.45,
                                    height: 280,
                                    overflow: 'hidden',
                                    backgroundColor: Colors.silver, 
                                }}
                            >
                                <LinearGradient
                                    colors = {['rgb(255,255,255)', 'rgba(1,1,1,0)']}
                                    angle = {180}
                                />
                            </View>
                            <View
                                style = {{
                                    margin: 5,
                                    borderRadius: 10,
                                    width: width * 0.45,
                                    height: 280,
                                    overflow: 'hidden',
                                    backgroundColor: Colors.silver,
                                }}
                            >
                                <LinearGradient
                                    colors = {['rgb(255,255,255)', 'rgba(1,1,1,0)']}
                                    angle = {180}
                                />
                            </View>
                        </View>
                    }
                </View>

                
            </ScrollView>
        </SafeAreaView>
    )
}

export default GenreMangaList