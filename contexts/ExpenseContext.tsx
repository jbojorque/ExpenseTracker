// contexts/ExpenseContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Expense, ExpenseContextType } from '../navigation/types'; // Import from your types file

// Create context with a default value (or null)
const ExpenseContext = createContext<ExpenseContextType | null>(null);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@expenses');
        if (jsonValue !== null) {
          setExpenses(JSON.parse(jsonValue) as Expense[]);
        }
      } catch (e) {
        console.error('Failed to load expenses.', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadExpenses();
  }, []);

  // Save expenses
  useEffect(() => {
    const saveExpenses = async () => {
      try {
        const jsonValue = JSON.stringify(expenses);
        await AsyncStorage.setItem('@expenses', jsonValue);
      } catch (e) {
        console.error('Failed to save expenses.', e);
      }
    };
    if (!isLoading) {
      saveExpenses();
    }
  }, [expenses, isLoading]);

  const addExpense = (data: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...data,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
  };

  const editExpense = (updatedExpense: Expense) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(exp =>
        exp.id === updatedExpense.id ? updatedExpense : exp
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(prevExpenses =>
      prevExpenses.filter(exp => exp.id !== id)
    );
  };

  const getExpensesByCategory = (): { [key: string]: number } => {
    return expenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      acc[category] = (acc[category] || 0) + amount; // Amount is already a number
      return acc;
    }, {} as { [key: string]: number });
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        isLoading,
        addExpense,
        editExpense,
        deleteExpense,
        getExpensesByCategory,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook with type checking
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};