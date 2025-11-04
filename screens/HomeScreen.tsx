// screens/HomeScreen.tsx
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useExpenses } from '../contexts/ExpenseContext';
import { HomeTabScreenProps } from '../navigation/types';
import { getCurrencySymbol } from '../utils/currency';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
// --- 1. Import Reanimated and navigation hook ---
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withDelay } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
// ----------------------------------------------

const screenWidth = Dimensions.get("window").width;
const chartContainerWidth = screenWidth - 40;

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export default function HomeScreen({ navigation }: HomeTabScreenProps<'Home'>) {
  const { expenses, getExpensesByCategory, currency } = useExpenses();

  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryData = getExpensesByCategory();
  const currencySymbol = getCurrencySymbol(currency);

  const categoryColors = ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0', '#00BCD4'];

  const chartData = Object.keys(categoryData)
    .sort((a, b) => categoryData[b] - categoryData[a])
    .map((key, index) => ({
      name: key,
      amount: categoryData[key],
      color: categoryColors[index % categoryColors.length],
      population: categoryData[key], 
    }));

  // --- 2. Set up animated values ---
  // We'll animate opacity (from 0 to 1)
  const opacity = useSharedValue(0);
  // And Y-position (from 20 (down) to 0 (neutral))
  const translateY = useSharedValue(20);

  // --- 3. Trigger animation on screen focus ---
  useFocusEffect(
    useCallback(() => {
      // Set initial values (hidden)
      opacity.value = 0;
      translateY.value = 20;
      
      // Start animations
      // withTiming is a smooth animation, withDelay staggers them
      opacity.value = withTiming(1, { duration: 500 });
      translateY.value = withTiming(0, { duration: 500 });
      
      // Return a cleanup function to reset on blur (optional)
      return () => {
        opacity.value = 0;
        translateY.value = 20;
      };
    }, [])
  );
  // ------------------------------------------

  // --- 4. Create animated styles ---
  // Style for the first card
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  // Staggered style for the button
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      // Start this animation 100ms after the first
      opacity: withDelay(100, withTiming(opacity.value)),
      transform: [{ translateY: withDelay(100, withTiming(translateY.value)) }],
    };
  });

  // Staggered style for the chart
  const chartAnimatedStyle = useAnimatedStyle(() => {
    return {
      // Start this 200ms after the first
      opacity: withDelay(200, withTiming(opacity.value)),
      transform: [{ translateY: withDelay(200, withTiming(translateY.value)) }],
    };
  });
  // ---------------------------------

  return (
    <ScrollView style={styles.container}>
      {/* We can animate the logo too */}
      <Animated.Image 
        source={require('../assets/images/logo.png')} 
        style={[styles.logo, cardAnimatedStyle]} // Use the first animation
      />
      
      {/* --- 5. Apply styles to Animated.View --- */}
      <Animated.View style={[styles.totalCard, cardAnimatedStyle]}>
        <Text style={styles.totalText}>Total Spending</Text>
        <Text style={styles.totalAmount}>
          {currencySymbol}{formatNumber(totalSpending)}
        </Text>
      </Animated.View>
      
      <Animated.View style={buttonAnimatedStyle}>
        <TouchableOpacity 
          style={styles.addExpenseButton} 
          onPress={() => navigation.navigate('AddExpenseModal', {})} 
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addExpenseButtonText}>ADD NEW EXPENSE</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View style={[styles.chartContainer, chartAnimatedStyle]}>
        <Text style={styles.subHeader}>Spending by Category</Text>
        
        {chartData.length === 0 ? (
          <View style={styles.chartPlaceholder}>
            <Text>No data to display in chart</Text>
          </View>
        ) : (
          <>
            <PieChart
              data={chartData}
              width={chartContainerWidth} 
              height={220}
              chartConfig={chartConfig}
              accessor={"amount"}
              backgroundColor={"transparent"}
              paddingLeft="75" 
              hasLegend={false} 
            />

            <View style={styles.legendContainer}>
              {chartData.map((item) => {
                const percentage = totalSpending > 0 ? (item.amount / totalSpending * 100) : 0;
                return (
                  <View key={item.name} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.name}</Text>
                    <View style={styles.legendAmountContainer}>
                       <Text style={styles.legendPercentage}>{percentage.toFixed(0)}%</Text>
                       <Text style={styles.legendAmount}>
                         {currencySymbol}{formatNumber(item.amount)}
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
      </Animated.View>
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
  logo: {
    width: 150,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
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
  totalAmount: { 
    fontSize: 40, 
    fontWeight: 'bold', 
    marginTop: 10,
    includeFontPadding: false, 
  },
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
    alignItems: 'center'
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
