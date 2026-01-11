import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import FloatingShapes from '../components/FloatingShapes';

const { width } = Dimensions.get('window');

export default function QuizWelcomeScreen() {
    const navigation = useNavigation();

    return (
        <LinearGradient colors={["#F8F9FC", "#F0F2F8", "#EEF1F7"]} style={{ flex: 1 }}>
            <FloatingShapes />
            <SafeAreaView style={styles.container}>
                {/* Header with Back Button */}
                <View style={styles.headerBar}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chevron-back" size={28} color="#1A1D23" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={[styles.headerSection]}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="school" size={64} color="#4F46E5" />
                        </View>
                        <Text style={styles.title}>Vocabulary Quiz</Text>
                        <Text style={styles.subtitle}>
                            Test your knowledge and master the words you've learned.
                        </Text>
                    </View>

                    <View style={[styles.actionSection]}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate('QuizGame')}
                            style={styles.mainButtonWrapper}
                        >
                            <LinearGradient
                                colors={['#4F46E5', '#4338CA']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.mainButton}
                            >
                                <Ionicons name="play-circle" size={28} color="#FFF" style={styles.btnIcon} />
                                <View>
                                    <Text style={styles.mainButtonText}>Start New Quiz</Text>
                                    <Text style={styles.mainButtonSubtext}>10 questions from your favorites</Text>
                                </View>
                                <Ionicons name="arrow-forward" size={24} color="#A5B4FC" style={styles.arrowIcon} />
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('QuizHistory')}
                            style={styles.secondaryButton}
                        >
                            <View style={styles.secondaryBtnContent}>
                                <View style={styles.secondaryIconBox}>
                                    <Ionicons name="time" size={24} color="#4F46E5" />
                                </View>
                                <View style={styles.secondaryTextContainer}>
                                    <Text style={styles.secondaryButtonText}>View History</Text>
                                    <Text style={styles.secondaryButtonSubtext}>Check your past scores</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
        paddingVertical: 40,
    },
    headerSection: {
        alignItems: 'center',
        marginTop: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        backgroundColor: '#EEF2FF',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 280,
    },
    actionSection: {
        gap: 16,
        marginBottom: 20,
    },
    mainButtonWrapper: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    mainButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        borderRadius: 24,
    },
    btnIcon: {
        marginRight: 16,
    },
    mainButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    mainButtonSubtext: {
        fontSize: 13,
        color: '#E0E7FF',
        marginTop: 2,
    },
    arrowIcon: {
        marginLeft: 'auto',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    secondaryBtnContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    secondaryIconBox: {
        width: 48,
        height: 48,
        backgroundColor: '#F3F4F6',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    secondaryTextContainer: {
        gap: 2,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    secondaryButtonSubtext: {
        fontSize: 13,
        color: '#6B7280',
    },
});
