
/**
 * Storage utilities for MoneyLens
 */
import { toast } from "@/components/ui/use-toast";

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string; // ISO string
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
}

// Default categories
const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', type: 'income', icon: 'IndianRupee' },
  { id: 'freelance', name: 'Freelance', type: 'income', icon: 'Laptop' },
  { id: 'investments', name: 'Investments', type: 'income', icon: 'LineChart' },
  { id: 'gifts', name: 'Gifts', type: 'income', icon: 'Gift' },
];

const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Dining', type: 'expense', icon: 'Utensils' },
  { id: 'transport', name: 'Transportation', type: 'expense', icon: 'Car' },
  { id: 'utilities', name: 'Utilities', type: 'expense', icon: 'Lightbulb' },
  { id: 'entertainment', name: 'Entertainment', type: 'expense', icon: 'Film' },
  { id: 'shopping', name: 'Shopping', type: 'expense', icon: 'ShoppingBag' },
  { id: 'health', name: 'Healthcare', type: 'expense', icon: 'Stethoscope' },
  { id: 'education', name: 'Education', type: 'expense', icon: 'GraduationCap' },
];

// Storage keys
const STORAGE_KEYS = {
  TRANSACTIONS: 'moneylens_transactions',
  BUDGETS: 'moneylens_budgets',
  INCOME_CATEGORIES: 'moneylens_income_categories',
  EXPENSE_CATEGORIES: 'moneylens_expense_categories',
};

// Initialize storage with default data if empty
export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.INCOME_CATEGORIES)) {
    localStorage.setItem(
      STORAGE_KEYS.INCOME_CATEGORIES,
      JSON.stringify(DEFAULT_INCOME_CATEGORIES)
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.EXPENSE_CATEGORIES)) {
    localStorage.setItem(
      STORAGE_KEYS.EXPENSE_CATEGORIES,
      JSON.stringify(DEFAULT_EXPENSE_CATEGORIES)
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.BUDGETS)) {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify([]));
  }
}

// Get all transactions
export function getTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    toast({
      title: "Error fetching transactions",
      description: "There was a problem retrieving your transaction data.",
      variant: "destructive",
    });
    return [];
  }
}

// Add a new transaction
export function addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
  try {
    const transactions = getTransactions();
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify([...transactions, newTransaction])
    );
    
    return newTransaction;
  } catch (error) {
    console.error('Error adding transaction:', error);
    toast({
      title: "Error adding transaction",
      description: "There was a problem saving your transaction.",
      variant: "destructive",
    });
    throw error;
  }
}

// Delete a transaction
export function deleteTransaction(id: string): void {
  try {
    const transactions = getTransactions();
    const updatedTransactions = transactions.filter(t => t.id !== id);
    
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(updatedTransactions)
    );
  } catch (error) {
    console.error('Error deleting transaction:', error);
    toast({
      title: "Error deleting transaction",
      description: "There was a problem removing your transaction.",
      variant: "destructive",
    });
    throw error;
  }
}

// Get all budgets
export function getBudgets(): Budget[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching budgets:', error);
    toast({
      title: "Error fetching budgets",
      description: "There was a problem retrieving your budget data.",
      variant: "destructive",
    });
    return [];
  }
}

// Add or update a budget
export function saveBudget(budget: Omit<Budget, 'id'>): Budget {
  try {
    const budgets = getBudgets();
    const existingBudgetIndex = budgets.findIndex(b => b.category === budget.category);
    
    let updatedBudget: Budget;
    
    if (existingBudgetIndex >= 0) {
      // Update existing budget
      updatedBudget = {
        ...budgets[existingBudgetIndex],
        ...budget,
      };
      budgets[existingBudgetIndex] = updatedBudget;
    } else {
      // Add new budget
      updatedBudget = {
        ...budget,
        id: Date.now().toString(),
      };
      budgets.push(updatedBudget);
    }
    
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    return updatedBudget;
  } catch (error) {
    console.error('Error saving budget:', error);
    toast({
      title: "Error saving budget",
      description: "There was a problem saving your budget.",
      variant: "destructive",
    });
    throw error;
  }
}

// Delete a budget
export function deleteBudget(id: string): void {
  try {
    const budgets = getBudgets();
    const updatedBudgets = budgets.filter(b => b.id !== id);
    
    localStorage.setItem(
      STORAGE_KEYS.BUDGETS,
      JSON.stringify(updatedBudgets)
    );
  } catch (error) {
    console.error('Error deleting budget:', error);
    toast({
      title: "Error deleting budget",
      description: "There was a problem removing your budget.",
      variant: "destructive",
    });
    throw error;
  }
}

// Get categories by type
export function getCategories(type: 'income' | 'expense'): Category[] {
  try {
    const storageKey = type === 'income' 
      ? STORAGE_KEYS.INCOME_CATEGORIES 
      : STORAGE_KEYS.EXPENSE_CATEGORIES;
    
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error fetching ${type} categories:`, error);
    toast({
      title: `Error fetching ${type} categories`,
      description: "There was a problem retrieving your category data.",
      variant: "destructive",
    });
    return [];
  }
}

// Add a new category
export function addCategory(category: Omit<Category, 'id'>): Category {
  try {
    const storageKey = category.type === 'income' 
      ? STORAGE_KEYS.INCOME_CATEGORIES 
      : STORAGE_KEYS.EXPENSE_CATEGORIES;
    
    const categories = getCategories(category.type);
    
    // Check if category already exists
    if (categories.some(c => c.name.toLowerCase() === category.name.toLowerCase())) {
      toast({
        title: "Category already exists",
        description: `A ${category.type} category with this name already exists.`,
        variant: "destructive",
      });
      throw new Error('Category already exists');
    }
    
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    };
    
    localStorage.setItem(
      storageKey,
      JSON.stringify([...categories, newCategory])
    );
    
    return newCategory;
  } catch (error) {
    console.error('Error adding category:', error);
    if (!(error instanceof Error) || error.message !== 'Category already exists') {
      toast({
        title: "Error adding category",
        description: "There was a problem saving your category.",
        variant: "destructive",
      });
    }
    throw error;
  }
}

// Delete a category
export function deleteCategory(id: string, type: 'income' | 'expense'): void {
  try {
    const storageKey = type === 'income' 
      ? STORAGE_KEYS.INCOME_CATEGORIES 
      : STORAGE_KEYS.EXPENSE_CATEGORIES;
    
    const categories = getCategories(type);
    const updatedCategories = categories.filter(c => c.id !== id);
    
    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedCategories)
    );
    
    // Check if there are budgets that use this category and delete them
    const budgets = getBudgets();
    const categoryToDelete = categories.find(c => c.id === id);
    
    if (categoryToDelete) {
      const affectedBudgets = budgets.filter(b => b.category === categoryToDelete.name);
      affectedBudgets.forEach(budget => deleteBudget(budget.id));
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    toast({
      title: "Error deleting category",
      description: "There was a problem removing your category.",
      variant: "destructive",
    });
    throw error;
  }
}

// Define the BudgetProgress interface
export interface BudgetProgress {
  id: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'safe' | 'warning' | 'danger';
}

// Calculate totals and statistics
export function calculateStats(): {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeByCategory: Record<string, number>;
  expenseByCategory: Record<string, number>;
  budgetProgress: BudgetProgress[];
} {
  const transactions = getTransactions();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });
  
  // Calculate totals
  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate balance
  const balance = totalIncome - totalExpense;
  
  // Group by category
  const incomeByCategory = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
  const expenseByCategory = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  
  // Get budget progress
  const budgets = getBudgets();
  const budgetProgress = budgets.map(budget => {
    const spent = expenseByCategory[budget.category] || 0;
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    
    let status: 'safe' | 'warning' | 'danger' = 'safe';
    if (percentage >= 90) {
      status = 'danger';
    } else if (percentage >= 70) {
      status = 'warning';
    }
    
    return {
      ...budget,
      spent,
      remaining: Math.max(0, budget.amount - spent),
      percentage: Math.min(100, percentage),
      status
    };
  });
  
  return {
    totalIncome,
    totalExpense,
    balance,
    incomeByCategory,
    expenseByCategory,
    budgetProgress
  };
}
