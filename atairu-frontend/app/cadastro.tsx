import { Ionicons } from '@expo/vector-icons';
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
    const [vendoSenha1, changeVerSenha1] = useState(false);
    const [textNotify, changeNotify] = useState('Aviso: Teste!');
    const [podeVerNotify, changePodeVerNotify] = useState(false);
    const [email, setEmail] = useState('');
    const [senha1, setSenha1] = useState('');
    const [senha2, setSenha2] = useState('');
    const {updateTempUserData} = useAuth();
    const verSenha1 = () => {
        changeVerSenha1(!vendoSenha1);
    }
    const [vendoSenha2, changeVerSenha2] = useState(false);
    const verSenha2 = () => {
        changeVerSenha2(!vendoSenha2);
    }
    const avancarEtapaCadastro = () => {
        if(email.length < 1) return showNotify('Aviso: Digite um email!');
        if(senha1.length < 1) return showNotify('Aviso: Digite uma senha!');
        if(senha2.length < 1) return showNotify('Aviso: Digite uma senha!');
        if(!email.includes('@') || email.includes(' ')) return showNotify('Aviso: Digite um email valido!');
        if(senha1 !== senha2) return showNotify('Aviso: As senha precisam ser iguais!');
        updateTempUserData({email: email, senha: senha1})
        router.push('/cadastro2')
    }
    const showNotify = (texto: any) => {
        changeNotify(texto);
        if(podeVerNotify === true) return;
        changePodeVerNotify(true);
        setTimeout(() => {
            changePodeVerNotify(false);
        }, 3000)
    }
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
                            <Text style={{marginBottom: 4, fontWeight: '700'}}>Email</Text>
                            <TextInput style={{padding: 4}} keyboardType="email-address"
                            value={email} onChangeText={(valor) => setEmail(valor)} autoCapitalize='none'/>
                        </View>
                        <View style={[styles.inputs, styles.sombra]}>
                            <Text style={{fontWeight: '700'}}>Senha</Text>
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TextInput style={{flex: 1, padding: 4}} secureTextEntry={!vendoSenha1}
                                value={senha1} onChangeText={(valor) => setSenha1(valor)} autoCapitalize='none'/>
                                <TouchableOpacity style={{top: '-20%'}} onPress={verSenha1}>
                                    <Ionicons name={vendoSenha1 ? "eye-outline" : "eye-off-outline"} size={20} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.inputs, styles.sombra]}>
                            <Text style={{fontWeight: '700'}}>Confirmar Senha</Text>
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TextInput style={{flex: 1, padding: 4}} secureTextEntry={!vendoSenha2}
                                value={senha2} onChangeText={(valor) => setSenha2(valor)} autoCapitalize='none'/>
                                <TouchableOpacity style={{top: '-20%'}} onPress={verSenha2}>
                                    <Ionicons name={vendoSenha2 ? "eye-outline" : "eye-off-outline"} size={20} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.btn_entrar} onPress={avancarEtapaCadastro}>
                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Avançar</Text>
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
        marginTop: 40,
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
        bottom: -95
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