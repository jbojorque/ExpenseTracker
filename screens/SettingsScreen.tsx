// screens/SettingsScreen.tsx
import React from 'react';
import { View, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useExpenses } from '../contexts/ExpenseContext';
// Use the 'legacy' import if that's what fixed it for you
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing/';
import { CURRENCIES, getCurrencySymbol } from '../utils/currency';

export default function SettingsScreen() {
  const { expenses, currency, setCurrency } = useExpenses();

  const exportToCSV = async () => {
    if (expenses.length === 0) {
      Alert.alert("No Data", "There are no expenses to export.");
      return;
    }

    const header = "ID,Date,Category,Amount,Note\n";
    const rows = expenses.map(exp => 
      // Ensure quotes in notes are escaped
      `${exp.id},${exp.date},${exp.category},${exp.amount},"${exp.note.replace(/"/g, '""')}"`
    ).join("\n");
    
    const csvString = header + rows;
    const fileUri = FileSystem.documentDirectory + 'expenses.csv';
    
    try {
      await FileSystem.writeAsStringAsync(fileUri, csvString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Expenses',
      });
      
    } catch (error) {
      console.error("Failed to export CSV", error);
      Alert.alert("Error", "Could not save or share the file.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* Currency Picker Section */}
      <Text style={styles.label}>Choose Currency</Text>
      <View style={styles.currencyContainer}>
        {CURRENCIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.currencyButton,
              currency === c && styles.currencyButtonActive
            ]}
            onPress={() => setCurrency(c)}
          >
            <Text style={[
                styles.currencyText,
                currency === c && styles.currencyTextActive
            ]}>
              {c} ({getCurrencySymbol(c)})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Export Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Export Data</Text>
        <Button 
          title="Export Expenses to CSV" 
          onPress={exportToCSV} 
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  currencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  currencyButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  currencyButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  currencyText: {
    fontSize: 16,
    color: '#333',
  },
  currencyTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  }
});