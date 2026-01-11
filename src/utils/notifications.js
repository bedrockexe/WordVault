import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';

// Attempt to set handler, but fail silently if in Expo Go (SDK 53+)
try {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });
} catch (e) {
    console.warn("Could not set notification handler. This is expected in Expo Go.");
}

export async function setupNotifications() {
    if (Platform.OS === 'web') return;

    // SDK 53+ on Android in Expo Go does not support remote notifications.
    // We explicitly check for this to avoid the error.
    if (Platform.OS === 'android' && Constants.appOwnership === 'expo') {
        console.warn("Skipping notification setup: Not available in Expo Go on Android (SDK 53+).");
        return;
    }

    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return;
        }

        // Check if we already have the daily notification scheduled
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        const hasDaily = scheduled.some(n => n.content.title === "Word of the Day");

        if (!hasDaily) {
            scheduleDailyNotification();
        }
    } catch (error) {
        console.warn("Notification setup failed:", error.message);
        // Silent failure for Expo Go users
    }
}

async function scheduleDailyNotification() {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Word of the Day",
                body: "Discover today's word and expand your vocabulary!",
                data: { screen: 'Search' },
            },
            trigger: {
                type: 'daily',
                hour: 9,
                minute: 0,
            },
        });
    } catch (error) {
        console.log("Failed to schedule notification:", error.message);
    }
}
