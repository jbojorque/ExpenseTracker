// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Dimensions } from 'react-native';
import { useExpenses } from '../contexts/ExpenseContext';
import { HomeTabScreenProps } from '../navigation/types';
import { getCurrencySymbol } from '../utils/currency';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

// Config for the pie chart
const chartConfig = {
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2,
};

export default function HomeScreen({ navigation }: HomeTabScreenProps<'Home'>) {
  const { expenses, getExpensesByCategory, currency } = useExpenses();

  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryData = getExpensesByCategory();
  const currencySymbol = getCurrencySymbol(currency);

  // Format data for react-native-chart-kit
  const chartData = Object.keys(categoryData).map((key, index) => ({
      name: key,
      amount: categoryData[key],
      color: `rgba(${index * 40}, ${255 - index * 30}, ${index * 70}, 0.8)`, // Simple color logic
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Expense Dashboard</Text>
      
      <View style={styles.totalCard}>
        <Text style={styles.totalText}>Total Spending</Text>
        <Text style={styles.totalAmount}>
          {currencySymbol}{totalSpending.toFixed(2)}
        </Text>
      </View>
      
      <Button 
        title="Add New Expense" 
        onPress={() => navigation.navigate('AddExpenseModal', {})} 
      />
      
      <View style={styles.chartContainer}>
        <Text style={styles.subHeader}>Spending by Category</Text>
        {chartData.length === 0 ? (
          <View style={styles.chartPlaceholder}>
            <Text>No data to display in chart</Text>
          </View>
        ) : (
          <PieChart
            data={chartData}
            width={screenWidth - 40} // Adjust width to fit padding
            height={220}
            chartConfig={chartConfig}
            accessor={"amount"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
          />
        )}
      </View>
    </ScrollView>
  );
}

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
  chartContainer: { marginTop: 30, alignItems: 'center' },
  subHeader: { fontSize: 22, fontWeight: '600', marginBottom: 15, alignSelf: 'flex-start' },
  chartPlaceholder: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: '100%'
  },
});