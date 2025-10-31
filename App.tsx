// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// --- IMPORT THE ICONS ---
import { Ionicons } from '@expo/vector-icons'; 

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

// --- UPDATED MainTabs function ---
function MainTabs() {
  return (
    <Tab.Navigator
      // This 'screenOptions' block is new.
      // It applies to all screens in the tab bar.
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'];

          if (route.name === 'Home') {
            // Use 'home' if focused, 'home-outline' if not
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Expenses') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            // A fallback in case you add a new tab and forget an icon
            iconName = 'alert-circle'; 
          }

          // This returns the icon component!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // We can also set the 'active' and 'inactive' colors here
        tabBarActiveTintColor: '#007AFF', // Color for the active tab
        tabBarInactiveTintColor: 'gray',  // Color for inactive tabs
      })}
    >
      {/* The screens are the same, but their options (like title) 
        will be combined with the screenOptions above.
      */}
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Dashboard' }} // This title overrides the 'Home' route name
      />
      <Tab.Screen 
        name="Expenses" 
        component={ExpenseListScreen} 
        options={{ title: 'Expenses' }} // Explicitly set title
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }} // Explicitly set title
      />
    </Tab.Navigator>
  );
}

// Root navigator (This part is unchanged)
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