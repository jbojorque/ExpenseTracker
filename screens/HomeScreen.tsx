// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useExpenses } from '../contexts/ExpenseContext';
import { HomeTabScreenProps } from '../navigation/types';
import { getCurrencySymbol } from '../utils/currency';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;
const chartContainerWidth = screenWidth - 40;

// --- Chart Config for Pie Chart ---
const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
};

export default function HomeScreen({ navigation }: HomeTabScreenProps<'Home'>) {
  const { expenses, getExpensesByCategory, currency } = useExpenses();

  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryData = getExpensesByCategory();
  const currencySymbol = getCurrencySymbol(currency);

  const categoryColors = ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0', '#00BCD4'];

  // --- THIS IS THE FIX ---
  // The 'legendFontColor' and 'legendFontSize' props control the labels
  // INSIDE the pie chart slices. I've set them to visible values.
  const sortedCategories = Object.keys(categoryData)
    .sort((a, b) => categoryData[b] - categoryData[a])
    .map((key, index) => ({
      name: key,
      amount: categoryData[key],
      color: categoryColors[index % categoryColors.length],
      population: categoryData[key], // Required by the type
      legendFontColor: "#fff", // Use white text for the labels
      legendFontSize: 14,     // Use a 14px font size
    }));
  // -----------------------
  
  // Data for the PieChart
  const chartData = sortedCategories;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Expense Dashboard</Text>
      
      <View style={styles.totalCard}>
        <Text style={styles.totalText}>Total Spending</Text>
        <Text style={styles.totalAmount}>
          {currencySymbol}{totalSpending.toFixed(2)}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.addExpenseButton} 
        onPress={() => navigation.navigate('AddExpenseModal', {})} 
        activeOpacity={0.7}
      >
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.addExpenseButtonText}>ADD NEW EXPENSE</Text>
      </TouchableOpacity>
      
      <View style={styles.chartContainer}>
        <Text style={styles.subHeader}>Spending by Category</Text>
        
        {chartData.length === 0 ? (
          <View style={styles.chartPlaceholder}>
            <Text>No data to display in chart</Text>
          </View>
        ) : (
          <>
            {/* 1. PIE CHART - (Showing percentages) */}
            <PieChart
              data={chartData}
              width={chartContainerWidth} 
              height={220}
              chartConfig={chartConfig}
              accessor={"amount"}
              backgroundColor={"transparent"}
              paddingLeft="75" // This keeps it centered
              hasLegend={false} // Hides the ugly side-legend
              absolute={false} // 'false' shows percentages
            />

            {/* 2. CATEGORY BREAKDOWN LIST (Our good legend) */}
            <View style={styles.legendContainer}>
              {sortedCategories.map((item) => {
                const percentage = totalSpending > 0 ? (item.amount / totalSpending * 100) : 0;
                return (
                  <View key={item.name} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.name}</Text>
                    <View style={styles.legendAmountContainer}>
                       <Text style={styles.legendPercentage}>{percentage.toFixed(0)}%</Text>
                       <Text style={styles.legendAmount}>
                         {currencySymbol}{item.amount.toFixed(2)}
                       </Text>
                    </View>
                    <View style={styles.progressBarBackground}>
                      <View style={[styles.progressBarFill, { 
                          backgroundColor: item.color,
                          width: `${percentage}%` 
                        }]} 
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#f4f4f4',
    overflow: 'hidden', 
  },
  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20,
    textAlign: 'center' 
  },
  totalCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalText: { fontSize: 18, color: '#555' },
  totalAmount: { fontSize: 40, fontWeight: 'bold', marginTop: 10 },
  addExpenseButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  addExpenseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  chartContainer: { 
    marginTop: 10,
    alignItems: 'center' // This centers the PieChart
  },
  subHeader: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    alignSelf: 'flex-start' 
  },
  chartPlaceholder: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: '100%'
  },
  legendContainer: {
    width: '100%',
    marginTop: 20,
  },
  legendItem: {
    width: '100%',
    paddingVertical: 10,
    marginBottom: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: 13,
    left: 0,
  },
  legendText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 20,
  },
  legendAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 4,
  },
  legendPercentage: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  legendAmount: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginTop: 8,
    marginLeft: 20,
    overflow: 'hidden',
    width: '93%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});