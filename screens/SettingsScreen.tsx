// screens/SettingsScreen.tsx
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import React from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';
import { useExpenses } from '../contexts/ExpenseContext';

// This screen doesn't need navigation props, but you could add them
// using HomeTabScreenProps<'Settings'> if needed.
export default function SettingsScreen() {
  const { expenses } = useExpenses();

  const exportToCSV = async () => {
    if (expenses.length === 0) {
      Alert.alert("No Data", "There are no expenses to export.");
      return;
    }

    const header = "ID,Date,Category,Amount,Note\n";
    const rows = expenses.map(exp => 
      // Ensure quotes in notes are escaped
      `${exp.id},${exp.date},${exp.category},${exp.amount},"_NOTE_${exp.note.replace(/"/g, '""')}"`
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
      <Button 
        title="Export Expenses to CSV" 
        onPress={exportToCSV} 
      />
      
      <View style={styles.placeholder}>
        <Button title="Setup Reminders (TODO)" onPress={() => {}} disabled />
        <Button title="Change Theme (TODO)" onPress={() => {}} disabled />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  placeholder: { marginTop: 40, gap: 15 }
});