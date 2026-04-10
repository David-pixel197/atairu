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
import { useAuth } from '@/context/AuthContext';

export default function cadastro() {
    const router = useRouter();
    const [data, setData] = useState(new Date());
    const [vendoCalendario, showCalendario] = useState(false);
    const [textNotify, changeNotify] = useState('Aviso: Teste!');
    const [podeVerNotify, changePodeVerNotify] = useState(false);
    const [nickname, setNickname] = useState('');
    const [nome, setNome] = useState('');
    const [CPF, setCPF] = useState('');
    const {updateTempUserData} = useAuth();
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
    const showNotify = (texto: any) => {
        changeNotify(texto);
        if(podeVerNotify === true) return;
        changePodeVerNotify(true);
        setTimeout(() => {
            changePodeVerNotify(false);
        }, 3000)
    }
    const finalizarCadastro = () => {
        const nomeTratado = nome.trim();
        if(!data) return showNotify('Aviso: Selecione sua data de nascimento!');
        if(nomeTratado.length < 1) return showNotify('Aviso: Digite seu nome!');
        if(nickname.length < 1) return showNotify('Aviso: Digite um nickname!');
        if(CPF.length < 1) return showNotify('Aviso: Digite seu CPF!');
        if(!nomeTratado.includes(' ')) return showNotify('Aviso: Digite seu nome completo!');
        updateTempUserData({dataNasc: data, nomeCompleto: nomeTratado, nickname: nickname, cpf: CPF})
        router.push('/historias')
    }
    const mascaraCPF = (valor: string) => {
        const apenasNumeros = valor.replace(/\D/g, '');
        return apenasNumeros
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2') 
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            .substring(0, 14);
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
                            <TextInput style={{padding: 4}} keyboardType="email-address"
                            value={nickname} onChangeText={(valor) => setNickname(valor.replace(/\s/g, ''))}/>
                        </View>
                        <View style={[styles.inputs, styles.sombra]}>
                            <Text style={{marginBottom: 4, fontWeight: '700'}}>Nome Completo</Text>
                            <TextInput style={{padding: 4}} keyboardType="email-address"
                            value={nome} onChangeText={(valor) => setNome(valor)}/>
                        </View>
                        <View style={[styles.inputs, styles.sombra]}>
                            <Text style={{marginBottom: 4, fontWeight: '700'}}>CPF</Text>
                            <TextInput style={{padding: 4}} keyboardType='numeric' maxLength={14}
                            value={CPF} onChangeText={(valor) => setCPF(mascaraCPF(valor))}/>
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
                        
                        <TouchableOpacity style={styles.btn_entrar} onPress={finalizarCadastro}>
                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Inscrever-se</Text>
                        </TouchableOpacity>
                        <View style={styles.registrar}>
                            <Text>Já tem uma conta? </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text style={{color:'#0B6586', fontWeight: 'bold'}}>Entrar aqui.</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {podeVerNotify && (
                        <View style={styles.warningOverlay}>
                            <Text style={{fontWeight: 'bold', color: '#D24141'}}>{textNotify}</Text>
                        </View>
                    )}
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
    },
    warningOverlay:{
        position:'absolute',
        top: 50,
        backgroundColor: '#FDEAEA',
        borderColor: '#D24141',
        borderWidth: 2,
        borderStyle: 'solid',
        padding: 8,
        width: '80%',
        borderRadius: 5,
        alignItems: 'center',
        right: 35,
        left: 35,
    }
});