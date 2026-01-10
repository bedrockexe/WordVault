import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, Easing } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * A single animated floating shape
 */
const FloatingShape = ({ color, size, initialX, initialY }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const duration = 4000 + Math.random() * 2000;

        const animateX = Animated.loop(
            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: Math.random() * 50 - 25,
                    duration,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: Math.random() * 50 - 25,
                    duration,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: 0,
                    duration,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        const animateY = Animated.loop(
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: Math.random() * 50 - 25,
                    duration,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: Math.random() * 50 - 25,
                    duration,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        const animateScale = Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.1,
                    duration,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 0.9,
                    duration,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        animateX.start();
        animateY.start();
        animateScale.start();

        return () => {
            animateX.stop();
            animateY.stop();
            animateScale.stop();
        };
    }, []);

    return (
        <Animated.View
            pointerEvents="none"
            style={{
                position: 'absolute',
                left: initialX,
                top: initialY,
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                opacity: 0.15,
                zIndex: 0,
                transform: [
                    { translateX },
                    { translateY },
                    { scale },
                ],
            }}
        />
    );
};

/**
 * Container for multiple floating shapes
 * Use this as a background layer in any screen
 */
export default function FloatingShapes() {
    return (
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
            <FloatingShape color="#818CF8" size={300} initialX={-100} initialY={-50} />
            <FloatingShape color="#F472B6" size={250} initialX={SCREEN_WIDTH - 150} initialY={100} />
            <FloatingShape color="#34D399" size={200} initialX={-50} initialY={SCREEN_HEIGHT - 300} />
            <FloatingShape color="#A78BFA" size={180} initialX={SCREEN_WIDTH - 100} initialY={SCREEN_HEIGHT - 150} />
        </View>
    );
}
