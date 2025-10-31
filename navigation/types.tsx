// navigation/types.ts
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Currency } from '../utils/currency';

// The core data structure for an expense
export type Expense = {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO string
};

// --- NEW TYPE ---
// This is a snapshot of all expenses for a given period
export type HistoryItem = {
  id: string;
  date: string; // The date the reset was performed
  total: number;
  expenses: Expense[]; // A copy of all expenses from that period
};
// --------------

// The params list for the root stack navigator
export type RootStackParamList = {
  Main: undefined; 
  AddExpenseModal: { expenseToEdit?: Expense };
};

// --- UPDATED ---
// The params list for the bottom tab navigator
export type BottomTabParamList = {
  Home: undefined;
  Expenses: undefined;
  History: undefined; // <-- Add History screen
  Settings: undefined;
};
// -------------

// --- Screen Prop Types ---
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type HomeTabScreenProps<T extends keyof BottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// --- UPDATED ---
// --- Context Type ---
export type ExpenseContextType = {
  expenses: Expense[];
  isLoading: boolean;
  addExpense: (data: Omit<Expense, 'id' | 'date'>) => void;
  editExpense: (updatedExpense: Expense) => void;
  deleteExpense: (id: string) => void;
  getExpensesByCategory: () => { [key: string]: number };
  
  currency: Currency;
  setCurrency: (currency: Currency) => void;

  // --- ADD THESE ---
  history: HistoryItem[];
  resetExpenses: () => void;
  // -----------------
};