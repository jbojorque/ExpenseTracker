// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ExpenseProvider } from './contexts/ExpenseContext';
import { RootStackParamList, BottomTabParamList } from './navigation/types';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ExpenseListScreen from './screens/ExpenseListScreen';
import SettingsScreen from './screens/SettingsScreen';
import AddExpenseModal from './screens/AddExpenseModal';

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