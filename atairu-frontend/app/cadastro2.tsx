import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function cadastro() {
    const router = useRouter();
    const [data, setData] = useState(new Date());
    const [vendoCalendario, showCalendario] = useState(false);

    const onChange = (event: any, selectedDate?: Date) => {
        showCalendario(false);
        if (selectedDate) {
            setData(selectedDate);
        }
    }
    const formatarData = (date: Date) => {
        let dia = date.getDate().toString().padStart(2, '0');
        let mes = (date.getMonth() + 1).toString().padStart(2, '0');
        let ano = date.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };
    return(
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/background.png')}
            resizeMode="cover" style={{flex: 1, justifyContent: 'center'}}>
            <SafeAreaView style={{flex: 1, justifyContent: 'flex-end'}}>
                    <View style={styles.logoContainer}>
                        <Image 
                            source={require('../assets/images/atairu.png')} 
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.painel}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 32, 
                            paddingVertical: 20
                        }}>Criar Conta</Text>
                        <View style={[styles.inputs, styles.sombra]}>
                            <Text style={{marginBottom: 4, fontWeight: '700'}}>Nickname</Text>
                            <TextInput style={{padding: 4}} keyboardType="email-address"/>
                        </View>
                        <View style={[styles.inputs, styles.sombra]}>
                            <Text style={{marginBottom: 4, fontWeight: '700'}}>Nome Completo</Text>
                            <TextInput style={{padding: 4}} keyboardType="email-address"/>
                        </View>
                        <View style={[styles.inputs, styles.sombra]}>
                            <Text style={{marginBottom: 4, fontWeight: '700'}}>CPF</Text>
                            <TextInput style={{padding: 4}} keyboardType="email-address"/>
                        </View>
                        <View style={styles.dataNascimento}>
                            <Text style={{fontWeight: '700'}}>Data de Nascimento</Text>
                            <TouchableOpacity onPress={() => showCalendario(true)} style={{backgroundColor: '#000', padding: 8, borderRadius: 5}}>
                                <Text style={{color: '#fff'}}>{formatarData(data)}</Text>
                            </TouchableOpacity>
                            {vendoCalendario && (
                                <DateTimePicker
                                    value={data}
                                    mode="date"
                                    display="default"
                                    onChange={onChange}
                                    maximumDate={new Date()}
                                    accentColor="#000000"
                                />
                            )}
                        </View>
                        
                        <TouchableOpacity style={styles.btn_entrar}>
                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Inscrever-se</Text>
                        </TouchableOpacity>
                        <View style={styles.registrar}>
                            <Text>Já tem uma conta? </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text style={{color:'#0B6586', fontWeight: 'bold'}}>Entrar aqui.</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#000'
    },
    painel:{
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 600,
    },
    btn_entrar:{
        backgroundColor: '#000',
        alignItems: 'center',
        marginHorizontal: 25,
        paddingVertical: 20,
        borderRadius: 15,
        marginTop: 25,
    },
    inputs:{
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginVertical: 10,
        marginHorizontal: 25,
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: '#00000025',
        borderStyle: 'solid'
        
    },
    sombra: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 70,
    },
    logo: {
        width: 220,
        height: 120,
    },
    mudar_senha:{
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal: 28,
    },
    registrar:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center', 
        marginVertical: 15,
        bottom: -35
    },
    dataNascimento:{
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent:'space-between', 
        marginHorizontal: 30, 
        marginTop: 25
    }
});