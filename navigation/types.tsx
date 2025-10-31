// types.ts
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// The core data structure for an expense
export type Expense = {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO string
};

// --- Navigation Types ---

// The params list for the root stack navigator
export type RootStackParamList = {
  Main: undefined; // Refers to the BottomTabNavigator
  AddExpenseModal: { expenseToEdit?: Expense }; // Optional param for editing
};

// The params list for the bottom tab navigator
export type BottomTabParamList = {
  Home: undefined;
  Expenses: undefined;
  Settings: undefined;
};

// --- Screen Prop Types ---
// This makes it easy to type your screens

// Props for screens in the Root Stack
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Props for screens in the Bottom Tab
// We use CompositeScreenProps to combine (nest) the types
// This gives "Home", "Expenses", and "Settings" screens access to the root stack's `navigation.navigate()`
// (e.g., so HomeScreen can call `navigation.navigate('AddExpenseModal')`)

export type HomeTabScreenProps<T extends keyof BottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// --- Context Type ---
export type ExpenseContextType = {
  expenses: Expense[];
  isLoading: boolean;
  addExpense: (data: Omit<Expense, 'id' | 'date'>) => void;
  editExpense: (updatedExpense: Expense) => void;
  deleteExpense: (id: string) => void;
  getExpensesByCategory: () => { [key: string]: number };
};