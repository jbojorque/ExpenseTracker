// screens/AddExpenseModal.tsx
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { useExpenses } from '../contexts/ExpenseContext';
import { RootStackScreenProps } from '../navigation/types'; // Import the correct prop type

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];

// Use the RootStackScreenProps for this modal screen
export default function AddExpenseModal({ navigation, route }: RootStackScreenProps<'AddExpenseModal'>) {
  const { addExpense, editExpense } = useExpenses();
  
  // Type-safe route params!
  const expenseToEdit = route.params?.expenseToEdit;
  const isEditing = !!expenseToEdit;

  const [amount, setAmount] = useState(expenseToEdit?.amount.toString() || '');
  const [category, setCategory] = useState(expenseToEdit?.category || CATEGORIES[0]);
  const [note, setNote] = useState(expenseToEdit?.note || '');

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Expense' : 'Add Expense',
    });
  }, [navigation, isEditing]);

  const handleSubmit = () => {
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const expenseData = {
      amount: parsedAmount,
      category,
      note,
    };

    if (isEditing) {
      editExpense({ ...expenseToEdit, ...expenseData });
    } else {
      addExpense(expenseData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Food"
        value={category}
        onChangeText={setCategory}
      />
      
      <Text style={styles.label}>Note (Optional)</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="e.g., Lunch with colleagues"
        value={note}
        onChangeText={setNote}
        multiline
      />
      
      <Button
        title={isEditing ? 'Update Expense' : 'Add Expense'}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
}

// ... Add the styles from the previous JS example ...
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  }
});