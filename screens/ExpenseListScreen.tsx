// screens/ExpenseListScreen.tsx
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useExpenses } from '../contexts/ExpenseContext';
import { Expense, HomeTabScreenProps } from '../navigation/types'; // Import types

export default function ExpenseListScreen({ navigation }: HomeTabScreenProps<'Expenses'>) {
  const { expenses, deleteExpense, isLoading } = useExpenses();

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteExpense(id) }
      ]
    );
  };
  
  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemCategory}>{item.category || 'General'}</Text>
        <Text style={styles.itemNote}>{item.note}</Text>
        <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.itemActions}>
        <Text style={styles.itemAmount}>${item.amount.toFixed(2)}</Text>
        <View style={styles.buttons}>
          <TouchableOpacity 
            style={[styles.button, styles.editButton]} 
            // Pass the item to the modal for editing
            onPress={() => navigation.navigate('AddExpenseModal', { expenseToEdit: item })}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.deleteButton]} 
            onPress={() => handleDelete(item.id)}
          >
             <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>
  }

  return (
    <View style={styles.container}>
      {expenses.length === 0 ? (
         <Text style={styles.emptyText}>No expenses yet. Add one!</Text>
      ) : (
        <FlatList
          data={expenses}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
}

// ... Add the styles from the previous JS example ...
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: { flex: 1 },
  itemCategory: { fontSize: 16, fontWeight: 'bold' },
  itemNote: { fontSize: 14, color: '#666' },
  itemDate: { fontSize: 12, color: '#999', marginTop: 5 },
  itemActions: { alignItems: 'flex-end' },
  itemAmount: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  buttons: { flexDirection: 'row', marginTop: 10 },
  button: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginLeft: 10 },
  editButton: { backgroundColor: '#FFC107' },
  deleteButton: { backgroundColor: '#DC3545' },
  buttonText: { color: 'white', fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#777' }
});