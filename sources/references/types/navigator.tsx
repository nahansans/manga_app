type FromScreen = (
    'Home'
    | 'Search'
    | 'Menu'
    | 'Bookmark'
    | 'DetailManga'
    | 'ReadManga'
    | 'SplashScreen'
    | 'GenreMangaList'
)
export type StackParamsList = {
    MainBottomTab: undefined,
    Home: undefined,
    Search: undefined,    
    Menu: undefined,
    SplashScreen: undefined,
    Bookmark: undefined,
    DetailManga: {
        fromScreen: FromScreen,
        endPoint: any
    },
    ReadManga: {
        fromScreen: FromScreen,
        endPoint?: any,
        chapter?: any
    },
    GenreMangaList: {
        fromScreen?: FromScreen,
        endpoint?: any,
        genreTitle?: any,
    }
}