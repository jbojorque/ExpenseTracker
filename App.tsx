// App.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { ExpenseProvider } from './contexts/ExpenseContext';
import { BottomTabParamList, RootStackParamList } from './types'; // Import types

// Import screens
import AddExpenseModal from './screens/AddExpenseModal';
import ExpenseListScreen from './screens/ExpenseListScreen';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';

// Create typed navigators
const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Main app tabs
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }}/>
      <Tab.Screen name="Expenses" component={ExpenseListScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Root navigator that includes the modal
export default function App() {
  return (
    <ExpenseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddExpenseModal"
            component={AddExpenseModal}
            options={{ presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ExpenseProvider>
  );
}