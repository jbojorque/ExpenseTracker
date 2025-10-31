// contexts/ExpenseContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, ExpenseContextType } from '../navigation/types';
import { Currency, CURRENCIES } from '../utils/currency';

const ExpenseContext = createContext<ExpenseContextType | null>(null);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]); // Default to USD
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses and currency from storage on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const expenseJson = await AsyncStorage.getItem('@expenses');
        if (expenseJson !== null) setExpenses(JSON.parse(expenseJson));
        
        const currencyJson = await AsyncStorage.getItem('@currency');
        if (currencyJson !== null && CURRENCIES.includes(currencyJson as Currency)) {
          setCurrency(currencyJson as Currency);
        }
      } catch (e) {
        console.error('Failed to load data.', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save expenses to storage whenever they change
  useEffect(() => {
    if (isLoading) return; // Don't save while loading
    const saveExpenses = async () => {
      try {
        await AsyncStorage.setItem('@expenses', JSON.stringify(expenses));
      } catch (e) { console.error('Failed to save expenses.', e); }
    };
    saveExpenses();
  }, [expenses, isLoading]);

  // Save currency to storage whenever it changes
  useEffect(() => {
    if (isLoading) return; // Don't save while loading
    const saveCurrency = async () => {
      try {
        await AsyncStorage.setItem('@currency', currency);
      } catch (e) { console.error('Failed to save currency.', e); }
    };
    saveCurrency();
  }, [currency, isLoading]);

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
      acc[category] = (acc[category] || 0) + amount;
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
        currency, // Expose currency
        setCurrency, // Expose setCurrency
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