import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '@/context/AuthContext';
import { login } from '@/services/authService';
import BackgroundLoginCadastro from '@/components/background_login';

export default function Login() {
    const router = useRouter();
    const [vendoSenha, changeVerSenha] = useState(false);
    const [textNotify, changeNotify] = useState('');
    const [podeVerNotify, changePodeVerNotify] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);
    const { updateTempUserData } = useAuth();

    const verSenha = () => changeVerSenha(!vendoSenha);

    const showNotify = (texto: string) => {
        changeNotify(texto);
        if (podeVerNotify) return;
        changePodeVerNotify(true);
        setTimeout(() => changePodeVerNotify(false), 3000);
    };

    const entrar = async () => {
        if (email.length < 1) return showNotify('Aviso: Digite um email!');
        if (senha.length < 1) return showNotify('Aviso: Digite uma senha!');
        if (!email.includes('@')) return showNotify('Aviso: O email digitado é inválido!');

        setCarregando(true);
        try {
            const jogador = await login({ email, senha });

            // Salva os dados do jogador no contexto global
            updateTempUserData({
                email: jogador.email,
                senha: senha,          // senha em texto apenas para exibição temporária
                nickname: jogador.nickname,
                nomeCompleto: jogador.nome,
                cpf: jogador.cpf,
                dataNasc: jogador.dataNascimento,
                jogadorId: jogador.id,
            });

            router.push('/home');
        } catch (error: any) {
            showNotify(`Erro: ${error.message}`);
            console.log(`Erro: ${error.message}`);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <BackgroundLoginCadastro>
            <Text style={styles.titulo}>Login</Text>

            <View style={[styles.inputs, styles.sombra]}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={{ padding: 4 }}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
            </View>

            <View style={[styles.inputs, styles.sombra]}>
                <Text style={styles.label}>Senha</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextInput
                        style={{ flex: 1, padding: 4 }}
                        secureTextEntry={!vendoSenha}
                        value={senha}
                        onChangeText={setSenha}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={{ top: '-20%' }} onPress={verSenha}>
                        <Ionicons
                            name={vendoSenha ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#000"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.mudar_senha}>
                <Text>Não sabe sua senha? </Text>
                <TouchableOpacity>
                    <Text style={{ color: '#0B6586', fontWeight: 'bold' }}>Mude aqui.</Text>
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

            <TouchableOpacity
                style={[styles.btn_entrar, carregando && { opacity: 0.7 }]}
                onPress={entrar}
                disabled={carregando}
            >
                {carregando ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                        Entrar
                    </Text>
                )}
            </TouchableOpacity>

            <View style={styles.registrar}>
                <Text>Não tem uma conta? </Text>
                <TouchableOpacity onPress={() => router.push('/cadastro')}>
                    <Text style={{ color: '#0B6586', fontWeight: 'bold' }}>
                        Registre-se aqui.
                    </Text>
                </TouchableOpacity>
            </View>
            {podeVerNotify && (
                <View style={styles.warningOverlay}>
                    <Text style={{ fontWeight: 'bold', color: '#D24141' }}>{textNotify}</Text>
                </View>
            )}
        </BackgroundLoginCadastro>
    );
}

const styles = StyleSheet.create({
    titulo: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 32,
        paddingVertical: 20,
    },
    btn_entrar: {
        backgroundColor: '#000',
        alignItems: 'center',
        marginHorizontal: 25,
        paddingVertical: 20,
        borderRadius: 15,
    },
    inputs: {
        paddingVertical: '1.5%',
        paddingHorizontal: '5%',
        marginVertical: 10,
        marginHorizontal: 25,
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: '#00000025',
    },
    label: { marginBottom: 4, fontWeight: '700' },
    sombra: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    divisao_ou: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: '5%',
        marginHorizontal: 30,
    },
    linha: { flex: 1, height: 1.5, backgroundColor: '#333' },
    ou: { marginHorizontal: 15, fontSize: 16, color: '#000' },
    logar_social: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 80,
        marginBottom: 25,
    },
    mudar_senha: { flexDirection: 'row', marginHorizontal: 28 },
    registrar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
    },
    warningOverlay: {
        position: 'absolute',
        top: 340,
        backgroundColor: '#FDEAEA',
        borderColor: '#D24141',
        borderWidth: 2,
        padding: 8,
        width: '80%',
        borderRadius: 5,
        alignItems: 'center',
        right: 35,
        left: 35,
    },
});