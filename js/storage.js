
/**
 * Storage utilities for MoneyLens
 */

const Storage = {
  // Storage keys
  KEYS: {
    TRANSACTIONS: 'moneylens_transactions',
    BUDGETS: 'moneylens_budgets',
    INCOME_CATEGORIES: 'moneylens_income_categories',
    EXPENSE_CATEGORIES: 'moneylens_expense_categories',
  },
  
  // Default categories
  DEFAULT_INCOME_CATEGORIES: [
    { id: 'salary', name: 'Salary', type: 'income', icon: 'fa-rupee-sign' },
    { id: 'freelance', name: 'Freelance', type: 'income', icon: 'fa-laptop' },
    { id: 'investments', name: 'Investments', type: 'income', icon: 'fa-chart-line' },
    { id: 'gifts', name: 'Gifts', type: 'income', icon: 'fa-gift' },
  ],
  
  DEFAULT_EXPENSE_CATEGORIES: [
    { id: 'food', name: 'Food & Dining', type: 'expense', icon: 'fa-utensils' },
    { id: 'transport', name: 'Transportation', type: 'expense', icon: 'fa-car' },
    { id: 'utilities', name: 'Utilities', type: 'expense', icon: 'fa-lightbulb' },
    { id: 'entertainment', name: 'Entertainment', type: 'expense', icon: 'fa-film' },
    { id: 'shopping', name: 'Shopping', type: 'expense', icon: 'fa-shopping-bag' },
    { id: 'health', name: 'Healthcare', type: 'expense', icon: 'fa-heartbeat' },
    { id: 'education', name: 'Education', type: 'expense', icon: 'fa-graduation-cap' },
  ],
  
  /**
   * Initialize storage with default data if empty
   */
  initialize: function() {
    // Initialize income categories
    if (!localStorage.getItem(this.KEYS.INCOME_CATEGORIES)) {
      localStorage.setItem(
        this.KEYS.INCOME_CATEGORIES,
        JSON.stringify(this.DEFAULT_INCOME_CATEGORIES)
      );
    }
    
    // Initialize expense categories
    if (!localStorage.getItem(this.KEYS.EXPENSE_CATEGORIES)) {
      localStorage.setItem(
        this.KEYS.EXPENSE_CATEGORIES,
        JSON.stringify(this.DEFAULT_EXPENSE_CATEGORIES)
      );
    }
    
    // Initialize transactions
    if (!localStorage.getItem(this.KEYS.TRANSACTIONS)) {
      localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify([]));
    }
    
    // Initialize budgets
    if (!localStorage.getItem(this.KEYS.BUDGETS)) {
      localStorage.setItem(this.KEYS.BUDGETS, JSON.stringify([]));
    }
  },
  
  /**
   * Get all transactions
   * @returns {Array} Transactions
   */
  getTransactions: function() {
    try {
      const data = localStorage.getItem(this.KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Utils.showToast('Error', 'Failed to load transactions', 'error');
      return [];
    }
  },
  
  /**
   * Add a new transaction
   * @param {Object} transaction - The transaction object
   * @returns {Object} The new transaction with ID
   */
  addTransaction: function(transaction) {
    try {
      const transactions = this.getTransactions();
      const newTransaction = {
        ...transaction,
        id: Utils.generateId(),
      };
      
      localStorage.setItem(
        this.KEYS.TRANSACTIONS,
        JSON.stringify([...transactions, newTransaction])
      );
      
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      Utils.showToast('Error', 'Failed to add transaction', 'error');
      throw error;
    }
  },
  
  /**
   * Delete a transaction
   * @param {string} id - Transaction ID
   */
  deleteTransaction: function(id) {
    try {
      const transactions = this.getTransactions();
      const updatedTransactions = transactions.filter(t => t.id !== id);
      
      localStorage.setItem(
        this.KEYS.TRANSACTIONS,
        JSON.stringify(updatedTransactions)
      );
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Utils.showToast('Error', 'Failed to delete transaction', 'error');
      throw error;
    }
  },
  
  /**
   * Get all budgets
   * @returns {Array} Budgets
   */
  getBudgets: function() {
    try {
      const data = localStorage.getItem(this.KEYS.BUDGETS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error fetching budgets:', error);
      Utils.showToast('Error', 'Failed to load budgets', 'error');
      return [];
    }
  },
  
  /**
   * Add or update a budget
   * @param {Object} budget - The budget object
   * @returns {Object} The new or updated budget with ID
   */
  saveBudget: function(budget) {
    try {
      const budgets = this.getBudgets();
      const existingBudgetIndex = budgets.findIndex(b => b.category === budget.category);
      
      let updatedBudget;
      
      if (existingBudgetIndex >= 0) {
        // Update existing budget
        updatedBudget = {
          ...budgets[existingBudgetIndex],
          amount: budget.amount
        };
        budgets[existingBudgetIndex] = updatedBudget;
      } else {
        // Add new budget
        updatedBudget = {
          ...budget,
          id: Utils.generateId(),
        };
        budgets.push(updatedBudget);
      }
      
      localStorage.setItem(this.KEYS.BUDGETS, JSON.stringify(budgets));
      return updatedBudget;
    } catch (error) {
      console.error('Error saving budget:', error);
      Utils.showToast('Error', 'Failed to save budget', 'error');
      throw error;
    }
  },
  
  /**
   * Delete a budget
   * @param {string} id - Budget ID
   */
  deleteBudget: function(id) {
    try {
      const budgets = this.getBudgets();
      const updatedBudgets = budgets.filter(b => b.id !== id);
      
      localStorage.setItem(
        this.KEYS.BUDGETS,
        JSON.stringify(updatedBudgets)
      );
    } catch (error) {
      console.error('Error deleting budget:', error);
      Utils.showToast('Error', 'Failed to delete budget', 'error');
      throw error;
    }
  },
  
  /**
   * Get categories by type
   * @param {string} type - Category type (income or expense)
   * @returns {Array} Categories
   */
  getCategories: function(type) {
    try {
      const storageKey = type === 'income' 
        ? this.KEYS.INCOME_CATEGORIES 
        : this.KEYS.EXPENSE_CATEGORIES;
      
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error fetching ${type} categories:`, error);
      Utils.showToast('Error', `Failed to load ${type} categories`, 'error');
      return [];
    }
  },
  
  /**
   * Add a new category
   * @param {Object} category - The category object
   * @returns {Object} The new category with ID
   */
  addCategory: function(category) {
    try {
      const storageKey = category.type === 'income' 
        ? this.KEYS.INCOME_CATEGORIES 
        : this.KEYS.EXPENSE_CATEGORIES;
      
      const categories = this.getCategories(category.type);
      
      // Check if category already exists
      if (categories.some(c => c.name.toLowerCase() === category.name.toLowerCase())) {
        Utils.showToast('Error', `A ${category.type} category with this name already exists`, 'error');
        throw new Error('Category already exists');
      }
      
      const newCategory = {
        ...category,
        id: Utils.generateId(),
      };
      
      localStorage.setItem(
        storageKey,
        JSON.stringify([...categories, newCategory])
      );
      
      return newCategory;
    } catch (error) {
      console.error('Error adding category:', error);
      if (error.message !== 'Category already exists') {
        Utils.showToast('Error', 'Failed to add category', 'error');
      }
      throw error;
    }
  },
  
  /**
   * Calculate financial statistics
   * @returns {Object} Statistics object
   */
  calculateStats: function() {
    const transactions = this.getTransactions();
    const budgets = this.getBudgets();
    
    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter transactions for current month
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    // Calculate totals
    const totalIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const totalExpense = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    // Calculate balance
    const balance = totalIncome - totalExpense;
    
    // Group by category
    const incomeByCategory = {};
    const expenseByCategory = {};
    
    currentMonthTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        incomeByCategory[transaction.category] = (incomeByCategory[transaction.category] || 0) + Number(transaction.amount);
      } else {
        expenseByCategory[transaction.category] = (expenseByCategory[transaction.category] || 0) + Number(transaction.amount);
      }
    });
    
    // Calculate budget progress
    const budgetProgress = budgets.map(budget => {
      const spent = expenseByCategory[budget.category] || 0;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      
      let status = 'safe';
      if (percentage >= 90) {
        status = 'danger';
      } else if (percentage >= 70) {
        status = 'warning';
      }
      
      return {
        id: budget.id,
        category: budget.category,
        amount: Number(budget.amount),
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
};
