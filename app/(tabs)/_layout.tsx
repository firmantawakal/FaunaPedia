// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { FaunaPediaProvider } from '../../contexts/FaunaPediaContext';

// Debug: Test simple provider
const TestProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('🔧 TestProvider rendered');
  
  useEffect(() => {
    console.log('🔧 TestProvider mounted');
  }, []);
  
  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  );
};

export default function RootLayout() {
  console.log('🦎 RootLayout rendered');
  
  useEffect(() => {
    console.log('🦎 RootLayout mounted');
  }, []);
  
  return (
    <TestProvider>
      <FaunaPediaProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.surface,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="species" 
            options={{ 
              headerShown: false 
            }} 
          />
        </Stack>
      </FaunaPediaProvider>
    </TestProvider>
  );
}
