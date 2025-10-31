// screens/HomeScreen.tsx
import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useExpenses } from '../contexts/ExpenseContext';
import { HomeTabScreenProps } from '../navigation/types'; // Import the typed props

// --- Placeholder for Chart ---
const PieChartPlaceholder = ({ data }: { data: { [key: string]: number } }) => (
  <View style={styles.chartPlaceholder}>
    <Text style={styles.placeholderText}>Chart Area</Text>
    {Object.entries(data).map(([key, value]) => (
       <Text key={key}>{key}: ${value.toFixed(2)}</Text>
    ))}
  </View>
);
// -----------------------------

// Use the HomeTabScreenProps to type the component's props
export default function HomeScreen({ navigation }: HomeTabScreenProps<'Home'>) {
  const { expenses, getExpensesByCategory } = useExpenses();

  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryData = getExpensesByCategory();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Expense Dashboard</Text>
      
      <View style={styles.totalCard}>
        <Text style={styles.totalText}>Total Spending</Text>
        <Text style={styles.totalAmount}>${totalSpending.toFixed(2)}</Text>
      </View>
      
      <Button 
        title="Add New Expense" 
        // Navigation is now type-safe!
        onPress={() => navigation.navigate('AddExpenseModal', {})} 
      />
      
      <View style={styles.chartContainer}>
        <Text style={styles.subHeader}>Spending by Category</Text>
        <PieChartPlaceholder data={categoryData} />
      </View>
    </ScrollView>
  );
}

// ... Add the styles from the previous JS example ...
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  totalCard: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalText: { fontSize: 18, color: '#555' },
  totalAmount: { fontSize: 40, fontWeight: 'bold', marginTop: 10 },
  chartContainer: { marginTop: 30 },
  subHeader: { fontSize: 22, fontWeight: '600', marginBottom: 15 },
  chartPlaceholder: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  placeholderText: { fontSize: 18, color: '#aaa', fontWeight: 'bold' }
});