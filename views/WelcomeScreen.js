import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const navigation = useNavigation();

    const onGetStarted = () => {
        navigation.replace('Search');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#4F46E5', '#7C3AED', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.background}
            />

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={{ width: 80, height: 80, resizeMode: 'contain' }}
                        />
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>WordVault</Text>
                    <Text style={styles.subtitle}>
                        Master your vocabulary. {"\n"}
                        Unlock the power of words.
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={onGetStarted}
                    activeOpacity={0.8}
                    style={styles.buttonWrapper}
                >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Get Started</Text>
                        <Ionicons name="arrow-forward" size={20} color="#4F46E5" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.footerText}>Version 1.0.0</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4F46E5',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        marginBottom: 40,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: 'white',
        marginBottom: 16,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: 28,
        maxWidth: 280,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 48,
        width: '100%',
        alignItems: 'center',
    },
    buttonWrapper: {
        width: '100%',
        marginBottom: 24,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    button: {
        backgroundColor: 'white',
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4F46E5',
        marginRight: 8,
    },
    footerText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
    },
});
