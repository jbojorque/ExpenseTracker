// contexts/ExpenseContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, ExpenseContextType, HistoryItem } from '../navigation/types';
import { Currency, CURRENCIES } from '../utils/currency';

const ExpenseContext = createContext<ExpenseContextType | null>(null);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]); // <-- Add history state
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses, currency, and history
  useEffect(() => {
    const loadData = async () => {
      try {
        const expenseJson = await AsyncStorage.getItem('@expenses');
        if (expenseJson !== null) setExpenses(JSON.parse(expenseJson));
        
        const currencyJson = await AsyncStorage.getItem('@currency');
        if (currencyJson !== null && CURRENCIES.includes(currencyJson as Currency)) {
          setCurrency(currencyJson as Currency);
        }

        const historyJson = await AsyncStorage.getItem('@history'); // <-- Load history
        if (historyJson !== null) setHistory(JSON.parse(historyJson));

      } catch (e) {
        console.error('Failed to load data.', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save expenses
  useEffect(() => {
    if (isLoading) return;
    const saveExpenses = async () => {
      try {
        await AsyncStorage.setItem('@expenses', JSON.stringify(expenses));
      } catch (e) { console.error('Failed to save expenses.', e); }
    };
    saveExpenses();
  }, [expenses, isLoading]);

  // Save currency
  useEffect(() => {
    if (isLoading) return;
    const saveCurrency = async () => {
      try {
        await AsyncStorage.setItem('@currency', currency);
      } catch (e) { console.error('Failed to save currency.', e); }
    };
    saveCurrency();
  }, [currency, isLoading]);

  // --- NEW ---
  // Save history
  useEffect(() => {
    if (isLoading) return;
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem('@history', JSON.stringify(history));
      } catch (e) { console.error('Failed to save history.', e); }
    };
    saveHistory();
  }, [history, isLoading]);
  // -----------

  const addExpense = (data: Omit<Expense, 'id' | 'date'>) => {
    // ... (same as before)
    const newExpense: Expense = {
      ...data,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
  };

  const editExpense = (updatedExpense: Expense) => {
    // ... (same as before)
    setExpenses(prevExpenses =>
      prevExpenses.map(exp =>
        exp.id === updatedExpense.id ? updatedExpense : exp
      )
    );
  };

  const deleteExpense = (id: string) => {
    // ... (same as before)
    setExpenses(prevExpenses =>
      prevExpenses.filter(exp => exp.id !== id)
    );
  };

  const getExpensesByCategory = (): { [key: string]: number } => {
    // ... (same as before)
    return expenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as { [key: string]: number });
  };

  // --- NEW FUNCTION ---
  const resetExpenses = () => {
    // 1. Check if there's anything to reset
    if (expenses.length === 0) {
      console.log("No expenses to reset.");
      return;
    }

    // 2. Calculate total spending for this period
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // 3. Create a new history item
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      total: total,
      expenses: [...expenses], // Create a copy of the expenses array
    };

    // 4. Add new item to history (at the top) and clear current expenses
    setHistory(prevHistory => [newHistoryItem, ...prevHistory]);
    setExpenses([]); // Reset current expenses
  };
  // --------------------

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        isLoading,
        addExpense,
        editExpense,
        deleteExpense,
        getExpensesByCategory,
        currency,
        setCurrency,
        history, // <-- Expose history
        resetExpenses, // <-- Expose reset function
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  // ... (same as before)
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};