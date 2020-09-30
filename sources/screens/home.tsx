import React, {useEffect, useRef, useState} from 'react'
import { View, Text, ScrollView, FlatList, Platform, Dimensions, TouchableOpacity, Animated, TouchableHighlight, Image, SafeAreaView, ActivityIndicator } from 'react-native'
import { Colors } from '../references/colors'
import { Fonts } from './../references/fonts';
import { BASE_URL } from './../references/base_url';


import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { StackParamsList } from '../references/types/navigator'
import LinearGradient from 'react-native-linear-gradient';
import RNFetchBlob from 'rn-fetch-blob';

type PropsList = {
    navigation: StackNavigationProp<StackParamsList, 'Home'>,
    route: RouteProp<StackParamsList, 'Home'>
}

type MangaType = {
    title?: string,
    thumb?: string,
    type?: string,
    endpoint?: string,
    updated_on?: string,
    chapter?: string
}

const Home = (props: PropsList) => {
    const { navigation, route } = props
    const { Poppins, Montserrat, OpenSans, PermanentMarker } = Fonts
    const {width} = Dimensions.get('window')    

    const ITEM_SIZE = width * 0.8
    const ITEM_POPULAR_SIZE = width * 0.45
    const SPACING = 28

    useEffect(() => {
        getAllManga()
        getPopularManga()
    }, [])

    const [allManga, setAllManga] = useState<MangaType[]>([])
    const [popularManga, setPopularManga] = useState<MangaType[]>([])
    const [isLoadData, setisLoadData] = useState(false)
    const [anyOtherData, setanyOtherData] = useState(true)
    const [page, setpage] = useState(1)

    const getAllManga = () => {
        RNFetchBlob.config({
            trusty: true
        })
        .fetch('GET',`${BASE_URL}/manga/page/${page}`)
        .then(res => res.json())
        .then(resJSON => {
            const manga_list = resJSON.manga_list
            const newData = JSON.parse(JSON.stringify(allManga)).concat(manga_list)

            setAllManga(newData)
            console.log(resJSON.manga_list.length)
            if (resJSON.manga_list.length < 20) {
                setanyOtherData(false)
            } else {
                setpage(page + 1)
            }
            setisLoadData(false)
            
        })
    }
    const getPopularManga = () => {
        RNFetchBlob.config({
            trusty: true
        })
        .fetch('GET' ,`${BASE_URL}/manga/popular/1`)
        .then(res => res.json())
        .then(resJSON => {
            setPopularManga(resJSON.manga_list)
        })
    }

    const loadMore = () => {
        if (anyOtherData) {
            setanyOtherData(true)
            setisLoadData(true)

            getAllManga()
        }
    }

    const scale = useRef(new Animated.Value(0)).current

    return (
        <SafeAreaView
            style = {{
                backgroundColor: Colors.base_white,
                flex: 1
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
                        Home
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
                    <Text
                        style = {{
                            textAlign: 'center',
                            fontSize: 14,
                            fontWeight: 'bold',
                            fontFamily: OpenSans.Regular,
                            color: Colors.dark_color,
                            paddingVertical: 28
                        }}
                    >
                        Manga Populer
                    </Text>

                    {
                        popularManga.length == 0 ?
                        <View
                            style = {{
                                flexDirection: 'row'
                            }}
                        >
                            <View
                                style = {{
                                    width: ITEM_SIZE,
                                    height: ITEM_SIZE * 1.2,
                                    backgroundColor: Colors.silver,
                                    marginHorizontal: 10,
                                    borderRadius: 10,
                                    overflow: 'hidden'
                                }}
                            >
                                <LinearGradient
                                    colors = {['rgb(255,255,255)', 'rgba(1,1,1,0)']}
                                    angle = {180}
                                />
                            </View>
                            <View
                                style = {{
                                    width: ITEM_SIZE,
                                    height: ITEM_SIZE * 1.2,
                                    backgroundColor: Colors.silver,
                                    marginHorizontal: 10,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    transform: [{scaleY: 0.9}]
                                }}
                            >
                                <LinearGradient
                                    colors = {['rgb(255,255,255)', 'rgba(1,1,1,0)']}
                                    angle = {180}
                                />
                            </View>
                        </View>
                        :
                        <Animated.FlatList
                            data = {popularManga}
                            keyExtractor = {(item, index) => String(index)}
                            snapToInterval = {ITEM_SIZE}
                            horizontal
                            showsHorizontalScrollIndicator = {false}
                            decelerationRate = 'fast'
                            snapToAlignment = 'start'
                            onScroll = {Animated.event(
                                [{nativeEvent: {contentOffset: { x: scale }}}],
                                {useNativeDriver: true}
                            )}
                            renderItem = {({item, index}) => {
                                const inputRange = [
                                    (index - 1) * ITEM_SIZE,
                                    index * ITEM_SIZE,
                                    (index + 1) * ITEM_SIZE
                                ]
                                const newScale = scale.interpolate({
                                    inputRange,
                                    outputRange: [1,1.5,1]
                                })
                                const newScaleView = scale.interpolate({
                                    inputRange,
                                    outputRange: [0.9,1,0.9]
                                })
                                return (
                                    <View style = {{ width: ITEM_SIZE }} >
                                        <TouchableOpacity
                                            activeOpacity = {0.5}
                                            onPress = {() => {
                                                navigation.navigate('DetailManga', {
                                                    fromScreen: 'Home',
                                                    endPoint: item.endpoint
                                                })
                                            }}
                                        >
                                            <Animated.View
                                                style = {{
                                                    marginHorizontal: 10,
                                                    alignItems: 'center',
                                                    backgroundColor: '#2d3436',
                                                    borderRadius: 10,
                                                    overflow: 'hidden',
                                                    height: ITEM_SIZE * 1.2,
                                                    transform: [{ scaleY: newScaleView }]
                                                }}
                                            >                                    
                                                <Animated.Image
                                                    source = {{ uri: item.thumb }}                                        
                                                    style = {{
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: 10,
                                                        transform: [{scale: newScale}]
                                                    }}
                                                />
                                                <LinearGradient
                                                    colors = {['rgba(0,0,0,0.5)', 'rgba(0,0,0,0)','rgba(0,0,0,0.5)']}
                                                    style = {{
                                                        position: 'absolute',
                                                        top: 0, left: 0, bottom: 0, right: 0
                                                    }}
                                                />
                                                <Animated.Text
                                                    style = {{
                                                        position: 'absolute',
                                                        fontSize: 16,
                                                        top: 5,
                                                        left: 5,
                                                        color: Colors.base_white,
                                                        padding: 10,
                                                        fontWeight: 'bold',
                                                        fontFamily: OpenSans.Regular,                                                
                                                        transform: [{scale: newScaleView}],                                                
                                                    }}
                                                >
                                                    {item.title}
                                                </Animated.Text>

                                                <Text
                                                    style = {{
                                                        position: 'absolute',
                                                        fontSize: 16,
                                                        bottom: 10,
                                                        left: 10,
                                                        color: Colors.base_white,
                                                        padding: 10,
                                                        fontWeight: 'bold',
                                                        fontFamily: OpenSans.Regular,
                                                        backgroundColor: item.type == 'Manga' ? '#2980b9' : (item.type == 'Manhua' ? '#c0392b' : '#27ae60'),
                                                        borderRadius: 30,
                                                    }}
                                                >
                                                    {item.type}
                                                </Text>
                                            </Animated.View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                        />
                    }
                    <Text
                        style = {{
                            color: Colors.dark_color,
                            fontFamily: OpenSans.Regular,
                            fontSize: 14,
                            paddingVertical: SPACING,
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}
                    >
                        Manga Terbaru
                    </Text>
                    {
                        allManga.length == 0 ?
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
                        :
                        <>
                            <Animated.FlatList
                                data = {allManga}
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
                                                    height: 280,
                                                    overflow: 'hidden',
                                                    borderRadius: 10,
                                                }}
                                                onPress = {() => {
                                                    let chapter = item.chapter?.replace(/[^0-9]/g,'')
                                                    navigation.navigate('ReadManga', {
                                                        fromScreen: 'DetailManga',
                                                        chapter,
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
                                                    style = {{
                                                        color: item.type == 'Manga' ? '#2ecc71' : ( item.type == 'Manhua' ? '#3498db' : '#e74c3c' ),
                                                        fontFamily: OpenSans.SemiBold,
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {item.type}
                                                </Text>
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
                                                <Text
                                                    numberOfLines = {1}
                                                    style = {{
                                                        color: Colors.title_color,
                                                        fontFamily: OpenSans.SemiBold,
                                                        fontSize: 11,
                                                    }}
                                                >
                                                    {item.chapter}
                                                </Text>
                                                <Text
                                                    numberOfLines = {1}
                                                    style = {{
                                                        color: Colors.dark_silver,
                                                        fontFamily: OpenSans.SemiBold,
                                                        fontSize: 9,
                                                    }}
                                                >
                                                    {item.updated_on?.replace('Berwarna', '')}
                                                </Text>
                                            
                                            </TouchableOpacity>
                                        </Animated.View>
                                    )
                                }}
                            />
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

                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


export default Home