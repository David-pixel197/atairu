import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function historias (){
    const router = useRouter();
    const { tempUserData } = useAuth();
    const formatarData = (date: Date) => {
        let dia = date.getDate().toString().padStart(2, '0');
        let mes = (date.getMonth() + 1).toString().padStart(2, '0');
        let ano = date.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };
    const dataExibicao = (tempUserData.dataNasc as any) instanceof Date 
    ? formatarData(tempUserData.dataNasc as any) 
    : tempUserData.dataNasc;
    return(
        <View style={styles.container}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#008f13'}}>Logado com sucesso!</Text>
            <Text style={{fontSize: 16, fontWeight: 'bold', paddingTop: 20}}>Email: {tempUserData.email}</Text>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Senha: {tempUserData.senha}</Text>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Nome Completo: {tempUserData.nomeCompleto}</Text>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Nickname: {tempUserData.nickname}</Text>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>CPF: {tempUserData.cpf}</Text>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Data de Nascimento: {dataExibicao}</Text>
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