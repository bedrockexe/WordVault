import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <ScrollView style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Something went wrong</Text>
                        <Text style={styles.subtitle}>{this.props.name || 'Component'} Component Error</Text>
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{this.state.error?.toString()}</Text>
                        </View>
                        {this.state.errorInfo && (
                            <View style={styles.stackBox}>
                                <Text style={styles.stackText}>
                                    {this.state.errorInfo.componentStack}
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF2F2',
    },
    content: {
        padding: 24,
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#991B1B',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#B91C1C',
        marginBottom: 16,
    },
    errorBox: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FAC7C7',
        marginBottom: 16,
    },
    errorText: {
        color: '#DC2626',
        fontFamily: 'monospace',
        fontSize: 14,
    },
    stackBox: {
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 8,
    },
    stackText: {
        color: '#374151',
        fontFamily: 'monospace',
        fontSize: 10,
    },
});
