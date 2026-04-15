import DateTimePicker from '@react-native-community/datetimepicker';
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
import { cadastrar, formatarDataParaApi } from '@/services/authService';

export default function Cadastro2() {
    const router = useRouter();
    const [data, setData] = useState(new Date());
    const [vendoCalendario, showCalendario] = useState(false);
    const [textNotify, changeNotify] = useState('');
    const [podeVerNotify, changePodeVerNotify] = useState(false);
    const [nickname, setNickname] = useState('');
    const [nome, setNome] = useState('');
    const [CPF, setCPF] = useState('');
    const [carregando, setCarregando] = useState(false);
    const { tempUserData, updateTempUserData } = useAuth();

    const onChange = (_event: any, selectedDate?: Date) => {
        showCalendario(false);
        if (selectedDate) setData(selectedDate);
    };

    const formatarData = (date: Date) => {
        const dia = date.getDate().toString().padStart(2, '0');
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${dia}/${mes}/${date.getFullYear()}`;
    };

    const showNotify = (texto: string) => {
        changeNotify(texto);
        if (podeVerNotify) return;
        changePodeVerNotify(true);
        setTimeout(() => changePodeVerNotify(false), 3000);
    };

    const mascaraCPF = (valor: string) =>
        valor
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            .substring(0, 14);

    const finalizarCadastro = async () => {
        const nomeTratado = nome.trim();
        if (!data)              return showNotify('Aviso: Selecione sua data de nascimento!');
        if (nomeTratado.length < 1) return showNotify('Aviso: Digite seu nome!');
        if (!nomeTratado.includes(' ')) return showNotify('Aviso: Digite seu nome completo!');
        if (nickname.length < 1) return showNotify('Aviso: Digite um nickname!');
        if (CPF.length < 14)    return showNotify('Aviso: Digite um CPF válido!');

        // Os campos de email e senha vêm da etapa anterior (cadastro.tsx)
        const { email, senha } = tempUserData as any;
        if (!email || !senha) {
            return showNotify('Aviso: Dados da etapa anterior não encontrados. Volte e tente novamente.');
        }

        setCarregando(true);
        try {
            const jogador = await cadastrar({
                email,
                senha,
                nickname,
                nome: nomeTratado,
                cpf: CPF.replace(/\D/g, ''), // envia somente dígitos para o backend
                dataNascimento: formatarDataParaApi(data), // "YYYY-MM-DD"
            });

            // Atualiza o contexto com os dados confirmados pelo backend
            updateTempUserData({
                email: jogador.email,
                nickname: jogador.nickname,
                nomeCompleto: jogador.nome,
                cpf: jogador.cpf,
                dataNasc: jogador.dataNascimento,
                jogadorId: jogador.id,
            });

            router.push('/home');
        } catch (error: any) {
            showNotify(`Erro: ${error.message}`);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/background.png')}
                resizeMode="cover"
                style={{ flex: 1, justifyContent: 'center' }}
            >
                <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/images/atairu.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.painel}>
                        <Text style={styles.titulo}>Criar Conta</Text>

                        <View style={[styles.inputs, styles.sombra]}>
                            <Text style={styles.label}>Nickname</Text>
                            <TextInput
                                style={{ padding: 4 }}
                                value={nickname}
                                onChangeText={(v) => setNickname(v.replace(/\s/g, ''))}
                            />
                        </View>

                        <View style={[styles.inputs, styles.sombra]}>
                            <Text style={styles.label}>Nome Completo</Text>
                            <TextInput
                                style={{ padding: 4 }}
                                value={nome}
                                onChangeText={setNome}
                            />
                        </View>

                        <View style={[styles.inputs, styles.sombra]}>
                            <Text style={styles.label}>CPF</Text>
                            <TextInput
                                style={{ padding: 4 }}
                                keyboardType="numeric"
                                maxLength={14}
                                value={CPF}
                                onChangeText={(v) => setCPF(mascaraCPF(v))}
                            />
                        </View>

                        <View style={styles.dataNascimento}>
                            <Text style={{ fontWeight: '700' }}>Data de Nascimento</Text>
                            <TouchableOpacity
                                onPress={() => showCalendario(true)}
                                style={{ backgroundColor: '#000', padding: 8, borderRadius: 5 }}
                            >
                                <Text style={{ color: '#fff' }}>{formatarData(data)}</Text>
                            </TouchableOpacity>
                            {vendoCalendario && (
                                <DateTimePicker
                                    value={data}
                                    mode="date"
                                    display="default"
                                    onChange={onChange}
                                    maximumDate={new Date()}
                                />
                            )}
                        </View>

                        <TouchableOpacity
                            style={[styles.btn_entrar, carregando && { opacity: 0.7 }]}
                            onPress={finalizarCadastro}
                            disabled={carregando}
                        >
                            {carregando ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                                    Inscrever-se
                                </Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.registrar}>
                            <Text>Já tem uma conta? </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text style={{ color: '#0B6586', fontWeight: 'bold' }}>Entrar aqui.</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {podeVerNotify && (
                        <View style={styles.warningOverlay}>
                            <Text style={{ fontWeight: 'bold', color: '#D24141' }}>{textNotify}</Text>
                        </View>
                    )}
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    titulo: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 32,
        paddingVertical: 20,
    },
    painel: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 600,
    },
    btn_entrar: {
        backgroundColor: '#000',
        alignItems: 'center',
        marginHorizontal: 25,
        paddingVertical: 20,
        borderRadius: 15,
        marginTop: 25,
    },
    inputs: {
        paddingVertical: 8,
        paddingHorizontal: 20,
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
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 70,
    },
    logo: { width: 220, height: 120 },
    registrar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
        bottom: -35,
    },
    dataNascimento: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 30,
        marginTop: 25,
    },
    warningOverlay: {
        position: 'absolute',
        top: 50,
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