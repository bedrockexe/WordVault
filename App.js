import "./global.css"
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initializeDatabaseConnection } from './src/database/initializeConnection';
import SearchBar from './src/views/SearchBar';
import WordScreen from './src/views/WordScreen';
import LoadingScreen from './src/views/LoadingScreen';
import FavoritesScreen from './src/views/FavoritesScreen';
import HistoryScreen from './src/views/HistoryScreen';
import QuizScreen from './src/views/QuizGameScreen'; // Renamed
import QuizWelcomeScreen from './src/views/QuizWelcomeScreen';
import QuizHistoryScreen from './src/views/QuizHistoryScreen';
import SearchScreen from './src/views/SearchScreen';
import WelcomeScreen from './src/views/WelcomeScreen';

import { setupNotifications } from './src/utils/notifications';

const Stack = createNativeStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await initializeDatabaseConnection();
      setupNotifications();
      setReady(true);
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {!ready ? (
          <Stack.Navigator>
            <Stack.Screen
              name="LoadingScreen"
              component={LoadingScreen}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Quiz" component={QuizWelcomeScreen} />
            <Stack.Screen name="QuizGame" component={QuizScreen} />
            <Stack.Screen name="QuizHistory" component={QuizHistoryScreen} />
            <Stack.Screen name="WordScreen" component={WordScreen} />
          </Stack.Navigator>)}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

