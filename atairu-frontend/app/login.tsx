import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
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

export default function login() {
    const router = useRouter();
    const [vendoSenha, changeVerSenha] = useState(false);
    const [textNotify, changeNotify] = useState('Aviso: Teste!');
    const [podeVerNotify, changePodeVerNotify] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { updateTempUserData } = useAuth();
    const saveDados = () => {
        if(email.length < 1) return showNotify('Aviso: Digite um email!');
        if(senha.length < 1) return showNotify('Aviso: Digite uma senha!');
        if(!email.includes('@')) return showNotify('Aviso: O email digitado é invalido!');
        updateTempUserData({ email, senha });
        router.push('/home')
    }
    const verSenha = () => {
        changeVerSenha(!vendoSenha);
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
                        }}>Login</Text>
                        <View style={[styles.inputs, styles.sombra]}>
                            <Text style={{marginBottom: 4, fontWeight: '700'}}>Email</Text>
                            <TextInput style={{padding: 4}} keyboardType="email-address"
                            value={email} onChangeText={(valor) => setEmail(valor)}
                            autoCapitalize='none'/>
                        </View>
                        <View style={[styles.inputs, styles.sombra]}>
                            <Text style={{fontWeight: '700'}}>Senha</Text>
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TextInput style={{flex: 1, padding: 4}} secureTextEntry={!vendoSenha}
                                value={senha} onChangeText={(valor) => setSenha(valor)}
                                autoCapitalize='none'/>
                                <TouchableOpacity style={{top: '-20%'}} onPress={verSenha}>
                                    <Ionicons name={vendoSenha ? "eye-outline" : "eye-off-outline"} size={20} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.mudar_senha}>
                            <Text>Não sabe sua senha? </Text>
                            <TouchableOpacity>
                                <Text style={{color:'#0B6586', fontWeight: 'bold'}}>Mude aqui.</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.divisao_ou}>
                            <View style={styles.linha} />
                            <Text style={styles.ou}>ou</Text>
                            <View style={styles.linha} />
                        </View>
                        <View style={styles.logar_social}>
                            <TouchableOpacity>
                                <AntDesign name="google" size={40} color="#000" />
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <FontAwesome name="facebook" size={40} color="#000" />
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <FontAwesome name="apple" size={40} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.btn_entrar} onPress={saveDados}>
                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Entrar</Text>
                        </TouchableOpacity>
                        <View style={styles.registrar}>
                            <Text>Não tem uma conta? </Text>
                            <TouchableOpacity onPress={() => router.push('/cadastro')}>
                                <Text style={{color:'#0B6586', fontWeight: 'bold'}}>Registre-se aqui.</Text>
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
    divisao_ou:{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
        marginHorizontal: 30
    },
    linha:{
        flex: 1,
        height: 1.5,
        backgroundColor: '#333',
    },
    ou:{
        marginHorizontal: 15,
        fontSize: 16,
        color: '#000',
        fontWeight: 'normal',
    },
    logar_social:{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 80,
        marginBottom: 25
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
        bottom: -50
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