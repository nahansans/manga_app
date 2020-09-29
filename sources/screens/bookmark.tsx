import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

type bookmarkType = {
    title: string,
    thumb: string,
    endpoint: string
}

const Bookmark = () => {
    useEffect(() => {
        getBookmark()
    }, [])

    const [bookmarkData, setbookmarkData] = useState<bookmarkType[]>([])

    const getBookmark = async() => {
        const data = await AsyncStorage.getAllKeys()
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const newData = await AsyncStorage.getItem(element)
            // setbookmarkData(JSON.parse(JSON.stringify(newData)))
            const coba = JSON.parse(JSON.stringify(newData))
            console.log(typeof coba)
            
        }
        // const items = await AsyncStorage.multiGet(data)


        // if (items != undefined) {
            const newData = JSON.parse(JSON.stringify(data))
            console.log(newData[0])
            setbookmarkData(newData)
        // }
            
    }
    return (
        <View
            style = {{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Text
                style = {{
                    color: 'black'
                }}
            >
                Halaman Masih Development
            </Text>
        </View>
    )
}

export default Bookmark