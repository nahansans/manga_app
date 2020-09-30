import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, Image, TextInput, SafeAreaView, Animated, TouchableOpacity, Dimensions, ActivityIndicator, Modal, Easing} from 'react-native'

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { StackParamsList } from '../references/types/navigator'
import { Colors } from './../references/colors';
import { BASE_URL } from './../references/base_url';
import { Fonts } from './../references/fonts';
import RNFetchBlob from 'rn-fetch-blob';

type PropsList = {
    navigation: StackNavigationProp<StackParamsList, 'Search'>
    route: StackNavigationProp<StackParamsList, 'Search'>
}

type recomendedType = {
    title?: string,
    thumb?: string,
    endpoint?: string
}

type genresType = {
    title?: string,
    endpoint?: string
}

const Search = (props: PropsList) => {
    const {navigation} = props
    const [search, setSearch] = useState('')
    const [scale, setscale] = useState(new Animated.Value(1))
    const [recomended, setRecomended] = useState<recomendedType[]>([])
    const { width, height } = Dimensions.get('window')
    const [isSearch, setIsSearch] = useState(false)
    const [isLoadingSearch, setIsLoadingSearch] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const [isFocusTextInput, setisFocusTextInput] = useState(new Animated.Value(1))
    const { OpenSans } = Fonts
    const [genres, setGenres] = useState<genresType[]>([])
    const [modalVisible, setmodalVisible] = useState(false)

    const [translateY, settranslateY] = useState(new Animated.Value(height))
    const [scaleTextInput, setScaleTextInput] = useState(new Animated.Value(1))
    const [searchData, setsearchData] = useState<recomendedType[]>([])

    useEffect(() => {
        getRecomended()
        getGenres()
    }, [])

    const getRecomended = async() => {        
        setIsLoadingSearch(true)
        RNFetchBlob.config({
            trusty: true
        })
        .fetch('GET' ,`${BASE_URL}/recommended`)
        .then(res => res.json())
        .then(resJSON => {
            setRecomended(resJSON.manga_list)
            setIsLoadingSearch(false)
        })
    }

    const getGenres = async() => {
        RNFetchBlob.config({
            trusty: true
        })
        .fetch('GET' ,`${BASE_URL}/genres`)
        .then(res => res.json())
        .then(resJSON => {
            setGenres(resJSON.list_genre)
        })
    }

    const getSearch = async() => {        
        setIsSearch(true)
        setIsEmpty(false)
        setIsLoadingSearch(true)
        RNFetchBlob.config({
            trusty: true
        })
        .fetch('GET' ,`${BASE_URL}/cari/${search}`)
        .then(res => res.json())
        .then(resJSON => {                
            setsearchData(resJSON)
            setIsLoadingSearch(false)
            if (resJSON.length == 0) {
                setIsEmpty(true)
            }
        })
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
                        Search
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
                    <TouchableOpacity
                        onPress = {() => setmodalVisible(true)}
                        activeOpacity = {0.7}
                        style = {{
                            flexDirection: 'row',
                            marginHorizontal: 20,
                            marginTop: 27,
                            backgroundColor: '#DDDDDD',
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 10
                        }}
                    >
                        <Image
                            source = {require('../images/search.png')}
                            style = {{
                                width: 20,
                                height: 20,
                                marginHorizontal: 10
                            }}
                        />
                        <Text
                            style = {{
                                fontSize: 14,
                                fontFamily: OpenSans.Regular,
                                color: Colors.dark_color
                            }}
                        >
                            Manga, Manhua, Manhwa
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text
                    style = {{
                        marginHorizontal: 20,
                        marginVertical: 20,
                        fontSize: 14,
                        color: Colors.dark_color,
                        fontFamily: OpenSans.SemiBold
                    }}
                >
                    Rekomendasi
                </Text>

                <Animated.FlatList
                    data = {recomended}
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
            </ScrollView>
            <Modal
                animationType = 'fade'
                transparent = {true}
                visible = {modalVisible}
            >
                <View style = {{flex: 1, justifyContent: 'flex-end'}} >
                    <TouchableOpacity
                        onPress = {() => {
                            setmodalVisible(false)
                            Animated.timing(isFocusTextInput, {
                                toValue: 1,
                                duration: 100,
                                useNativeDriver: true
                            }).start()
                            setIsSearch(false)
                        }}
                        style = {{
                            backgroundColor:'rgba(0,0,0,0.8)',
                            position: 'absolute',
                            top: 0, left: 0, bottom: 0, right: 0
                        }}
                    />
                    <View
                        style = {{
                            backgroundColor: Colors.base_white,
                            height: height * 0.9,
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30
                        }}
                    >
                        <Animated.View
                            style = {{
                                backgroundColor: '#DDDDDD',
                                borderRadius: 10,
                                marginHorizontal: 10,
                                marginVertical: 26,
                                paddingHorizontal: 10,
                                paddingVertical: 2,
                                flexDirection: 'row',
                                transform: [{scale: scaleTextInput}]
                            }}
                        >
                            <TextInput
                                placeholder = 'Search...'
                                style = {{
                                    fontFamily: OpenSans.Regular,
                                    fontSize: 14,
                                    color: Colors.dark_color
                                }}
                                onFocus = {() => {
                                    Animated.timing(scaleTextInput, {
                                        toValue: 0.9,
                                        duration: 200,
                                        useNativeDriver: true
                                    }).start()
                                    Animated.timing(isFocusTextInput, {
                                        toValue: 0,
                                        duration: 100,
                                        useNativeDriver: true
                                    }).start()
                                }}
                                onBlur = {() => {
                                    Animated.timing(scaleTextInput, {
                                        toValue: 1,
                                        duration: 200,
                                        useNativeDriver: true
                                    }).start()
                                    Animated.timing(isFocusTextInput, {
                                        toValue: 1,
                                        duration: 100,
                                        useNativeDriver: true
                                    }).start()
                                }}
                                onChangeText = {(value) => {
                                    setSearch(value)
                                }}
                                onSubmitEditing = {() => getSearch()}
                                returnKeyType = 'search'
                            />
                        </Animated.View>
                        <ScrollView>
                            {
                                isSearch ?
                                <>
                                    <Text
                                        style = {{
                                            fontSize: 14,
                                            fontFamily: OpenSans.SemiBold,
                                            color: Colors.dark_color,
                                            marginBottom: 10,
                                            marginHorizontal: 10
                                        }}
                                    >
                                        Hasil Pencarian
                                    </Text>
                                    <Animated.FlatList
                                        data = {searchData}
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
                                                            setmodalVisible(false)
                                                            setIsSearch(false)
                                                            Animated.timing(isFocusTextInput, {
                                                                toValue: 1,
                                                                duration: 100,
                                                                useNativeDriver: true
                                                            }).start()
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
                                        isEmpty ?
                                        <Text
                                            style = {{
                                                fontSize: 14,
                                                fontFamily: OpenSans.Regular,
                                                marginHorizontal: 10,
                                                color: Colors.dark_silver
                                            }}
                                        >
                                            Tidak Ditemukan
                                        </Text>
                                        : null
                                    }
                                </>
                                :
                                <Animated.View
                                    style = {{
                                        opacity: isFocusTextInput
                                    }}
                                >
                                    <Text
                                        style = {{
                                            fontFamily: OpenSans.SemiBold,
                                            fontSize: 14,
                                            color: Colors.dark_color,
                                            marginHorizontal: 10
                                        }}
                                    >
                                        Daftar Genre
                                    </Text>
                                    <View
                                        style = {{
                                            margin: 10,
                                            flexWrap: 'wrap',
                                            flexDirection: 'row'
                                        }}
                                    >
                                        {
                                            genres.map((item, index) => {
                                                return (
                                                    <TouchableOpacity
                                                        activeOpacity = {0.7}
                                                        onPress = {() => {
                                                            setmodalVisible(false)
                                                            setIsSearch(false)
                                                            Animated.timing(isFocusTextInput, {
                                                                toValue: 1,
                                                                duration: 100,
                                                                useNativeDriver: true
                                                            }).start()
                                                            navigation.navigate('GenreMangaList', {
                                                                endpoint: item.endpoint,
                                                                genreTitle: item.title
                                                            })
                                                        }}
                                                        style = {{
                                                            marginRight: 8,
                                                            paddingVertical: 2,
                                                            paddingHorizontal: 10,
                                                            backgroundColor: '#DDDDDD',
                                                            marginBottom: 14,
                                                            borderRadius: 14
                                                        }}
                                                    >
                                                        <Text
                                                            style = {{
                                                                fontSize: 14,
                                                                fontFamily: OpenSans.Regular,
                                                                color: Colors.dark_color
                                                            }}
                                                        >
                                                            {item.title}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                </Animated.View>
                            }
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
    
}


export default Search