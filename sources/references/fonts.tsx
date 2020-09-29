import { Platform } from 'react-native'

export const Fonts = {
    Poppins: {
        Regular: Platform.OS == 'ios' ? 'Poppins-Regular' : 'PoppinsRegular',
        Thin: Platform.OS == 'ios' ? 'Poppins-Thin' : 'PoppinsThin',
        Bold: Platform.OS == 'ios' ? 'Poppins-Bold' : 'PoppinsBold',
        Light: Platform.OS == 'ios' ? 'Poppins-Light' : 'PoppinsLight',
        SemiBold: Platform.OS == 'ios' ? 'Poppins-SemiBold' : 'PoppinsSemiBold',
    },
    OpenSans: {
        Regular: Platform.OS == 'ios' ? 'OpenSans-Regular' : 'OpenSansRegular',
        SemiBold: Platform.OS == 'ios' ? 'OpenSans-SemiBold' : 'OpenSansSemiBold',
    },
    Montserrat: {
        Regular: Platform.OS == 'ios' ? 'Montserrat-Regular' : 'MontserratRegular',
        Bold: Platform.OS == 'ios' ? 'Montserrat-Bold' : 'MontserratBold',
    },
    PermanentMarker: {
        Regular: Platform.OS == 'ios' ? 'PermanentMarker-Regular' : 'PermanentMarkerRegular',
    }
}