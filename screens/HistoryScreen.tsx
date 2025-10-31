// screens/HistoryScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useExpenses } from '../contexts/ExpenseContext';
import { HomeTabScreenProps, HistoryItem } from '../navigation/types';
import { getCurrencySymbol } from '../utils/currency';

// Helper function to format the number with commas
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export default function HistoryScreen({ navigation }: HomeTabScreenProps<'History'>) {
  const { history, currency } = useExpenses();
  const currencySymbol = getCurrencySymbol(currency);

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      // You could later navigate to a detail screen
      // onPress={() => navigation.navigate('HistoryDetail', { historyId: item.id })}
    >
      <View>
        <Text style={styles.itemDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={styles.itemCount}>
          {item.expenses.length} expenses
        </Text>
      </View>
      <Text style={styles.itemTotal}>
        {currencySymbol}{formatNumber(item.total)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No history yet.</Text>
          <Text style={styles.emptySubText}>
            When you "Reset Current Period" from the Settings tab,
            your expense summary will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemDate: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  itemTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
});