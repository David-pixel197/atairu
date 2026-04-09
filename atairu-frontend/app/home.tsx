import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function home (){
    const router = useRouter();
    const { tempUserData } = useAuth();
    return(
        <View style={styles.container}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#008f13'}}>Logado com sucesso!</Text>
            <Text style={{fontSize: 16, fontWeight: 'bold', paddingTop: 20}}>Email: {tempUserData.email}</Text>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Senha: {tempUserData.senha}</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={{fontSize: 16, fontWeight: 'bold', color: '#003e8f', paddingTop: 20}}>Volta</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        height: '100%',
        width: '100%',
        alignItems: 'center',
        marginTop: '80%'
    }
})