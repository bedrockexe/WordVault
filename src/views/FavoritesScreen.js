import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../viewmodels/useFavorites';
import { formatTerm } from '../utils/formatting';
import FloatingShapes from '../components/FloatingShapes';
import { LinearGradient } from 'expo-linear-gradient';

export default function FavoritesScreen({ navigation }) {
    const { favorites } = useFavorites();

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('WordScreen', { word: item })}
        >
            <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.term}>{formatTerm(item.term)}</Text>
                <Text style={styles.definition} numberOfLines={1}>{item.definition}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
    );

    return (
        <LinearGradient colors={["#F8F9FC", "#F0F2F8", "#EEF1F7"]} style={{ flex: 1 }}>
            <FloatingShapes />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <Ionicons name="chevron-back" size={28} color="#1A1D23" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Favorites</Text>
                    <View style={{ width: 44 }} />
                </View>

                {favorites.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="heart-outline" size={48} color="#9CA3AF" />
                        </View>
                        <Text style={styles.emptyText}>No favorites yet</Text>
                        <Text style={styles.emptySubtext}>Mark words as favorites to collect them here</Text>
                    </View>
                ) : (
                    <FlatList
                        data={favorites}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.wordId}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F8F9FA',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1D23',
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.03)',
    },
    list: {
        padding: 20,
    },
    item: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.02)",
    },
    term: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1D23',
        marginBottom: 4,
    },
    definition: {
        fontSize: 14,
        color: '#6B7280',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#6B7280',
    },
});
