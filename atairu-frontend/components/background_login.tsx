import React, {ReactNode} from "react";
import { View, StyleSheet, ImageBackground, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface BackgroundLoginProps {
    children: ReactNode;
}

export default function BackgroundLoginCadastro({ children }: BackgroundLoginProps) {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/background.png')}
                resizeMode="cover"
                style={styles.headerImage}
            >
                <SafeAreaView style={styles.logoWrapper}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/images/atairu.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                </SafeAreaView>
            </ImageBackground>
            <View style={styles.painel}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    headerImage: {
        flex: 1,
        width: '100%',
    },
    logoWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: { 
        width: 220, 
        height: 120 
    },
    painel: {
        flex: 2.5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        paddingVertical: 10,
    },
});