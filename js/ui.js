
/**
 * UI utilities for MoneyLens
 */

const UI = {
  // Store charts so they can be destroyed/updated
  charts: {
    income: null,
    expense: null
  },
  
  /**
   * Initialize UI elements
   */
  initialize: function() {
    this.updateStats();
    this.loadCategories('expense'); // Default to expense for transaction form
    this.loadBudgetCategories();
    this.displayTransactions();
    this.displayBudgets();
    this.updateCharts();
    
    // Set default date and time
    const { date, time } = Utils.getCurrentDateTime();
    document.getElementById('date').value = date;
    document.getElementById('time').value = time;
  },
  
  /**
   * Update financial statistics on the dashboard
   */
  updateStats: function() {
    const stats = Storage.calculateStats();
    
    // Update counters
    document.getElementById('total-income').textContent = Utils.formatRupee(stats.totalIncome);
    document.getElementById('total-expense').textContent = Utils.formatRupee(stats.totalExpense);
    document.getElementById('net-balance').textContent = Utils.formatRupee(Math.abs(stats.balance));
    
    // Update balance card appearance
    const balanceCard = document.getElementById('balance-card');
    if (stats.balance < 0) {
      balanceCard.classList.add('negative');
      balanceCard.classList.remove('income-card');
      balanceCard.classList.add('expense-card');
      document.getElementById('net-balance').className = 'stat-value expense-text';
    } else {
      balanceCard.classList.remove('negative');
      balanceCard.classList.remove('expense-card');
      balanceCard.classList.add('income-card');
      document.getElementById('net-balance').className = 'stat-value income-text';
    }
  },
  
  /**
   * Load categories into a select element
   * @param {string} type - Category type (income or expense)
   */
  loadCategories: function(type) {
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '<option value="" disabled selected>Select a category</option>';
    
    const categories = Storage.getCategories(type);
    
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.name;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  },
  
  /**
   * Load expense categories into budget form
   */
  loadBudgetCategories: function() {
    const budgetCategorySelect = document.getElementById('budget-category');
    budgetCategorySelect.innerHTML = '<option value="" disabled selected>Select a category</option>';
    
    const categories = Storage.getCategories('expense');
    
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.name;
      option.textContent = category.name;
      budgetCategorySelect.appendChild(option);
    });
  },
  
  /**
   * Display transactions in the transaction list
   * @param {string} filter - Filter transactions by type (all, income, expense)
   */
  displayTransactions: function(filter = 'all') {
    const transactionList = document.getElementById('transaction-list');
    let transactions = Storage.getTransactions();
    
    // Sort by date, most recent first
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Apply filter
    if (filter !== 'all') {
      transactions = transactions.filter(t => t.type === filter);
    }
    
    // Clear current list
    transactionList.innerHTML = '';
    
    if (transactions.length === 0) {
      transactionList.innerHTML = '<div class="empty-state"><p>No transactions found.</p></div>';
      return;
    }
    
    // Create transaction items
    transactions.forEach(transaction => {
      const transactionItem = document.createElement('div');
      transactionItem.className = `transaction-item ${transaction.type === 'income' ? 'income-transaction' : 'expense-transaction'}`;
      
      // Find category to get icon
      const categories = Storage.getCategories(transaction.type);
      const category = categories.find(c => c.name === transaction.category) || {};
      const iconClass = category.icon || (transaction.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down');
      
      transactionItem.innerHTML = `
        <div class="transaction-info">
          <h3>
            <i class="fa-solid ${iconClass}"></i>
            ${transaction.category}
          </h3>
          <div class="transaction-desc">${transaction.description || 'No description'}</div>
          <div class="transaction-date">${Utils.formatDateTime(new Date(transaction.date))}</div>
        </div>
        <div class="transaction-actions">
          <div class="transaction-amount ${transaction.type === 'income' ? 'income-text' : 'expense-text'}">
            ${transaction.type === 'income' ? '+' : '-'}${Utils.formatRupee(transaction.amount)}
            <button class="delete-btn" data-id="${transaction.id}"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
      `;
      
      // Add delete event listener
      transactionItem.querySelector('.delete-btn').addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        Storage.deleteTransaction(id);
        UI.displayTransactions(filter);
        UI.updateStats();
        UI.displayBudgets();
        UI.updateCharts();
        Utils.showToast('Success', 'Transaction deleted successfully');
      });
      
      transactionList.appendChild(transactionItem);
    });
  },
  
  /**
   * Display budgets in the budget list
   */
  displayBudgets: function() {
    const budgetList = document.getElementById('budget-list');
    const stats = Storage.calculateStats();
    const budgetProgress = stats.budgetProgress;
    
    // Clear current list
    budgetList.innerHTML = '';
    
    if (budgetProgress.length === 0) {
      budgetList.innerHTML = '<div class="empty-state"><p>No budgets set. Add a budget to track your spending.</p></div>';
      return;
    }
    
    // Create budget items
    budgetProgress.forEach(budget => {
      const budgetItem = document.createElement('div');
      budgetItem.className = 'budget-item';
      
      // Find category to get icon
      const categories = Storage.getCategories('expense');
      const category = categories.find(c => c.name === budget.category) || {};
      const iconClass = category.icon || 'fa-wallet';
      
      budgetItem.innerHTML = `
        <div class="budget-header">
          <div>
            <div class="budget-title">
              <i class="fa-solid ${iconClass}"></i> ${budget.category}
            </div>
            <div class="budget-spent">
              Spent ${Utils.formatRupee(budget.spent)} of ${Utils.formatRupee(budget.amount)}
            </div>
          </div>
          <button class="delete-btn" data-id="${budget.id}"><i class="fa-solid fa-trash-can"></i></button>
        </div>
        
        <div class="budget-progress">
          <div class="budget-progress-bar budget-${budget.status}" style="width: ${budget.percentage}%"></div>
        </div>
        
        <div class="budget-footer">
          <div class="budget-percentage ${budget.status === 'danger' ? 'budget-danger-text' : ''}">
            ${Math.round(budget.percentage)}%
          </div>
          <div class="budget-remaining">
            ${Utils.formatRupee(budget.remaining)} remaining
          </div>
        </div>
      `;
      
      // Add delete event listener
      budgetItem.querySelector('.delete-btn').addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        Storage.deleteBudget(id);
        UI.displayBudgets();
        Utils.showToast('Success', 'Budget deleted successfully');
      });
      
      budgetList.appendChild(budgetItem);
    });
  },
  
  /**
   * Update charts with current data
   */
  updateCharts: function() {
    const stats = Storage.calculateStats();
    
    // Prepare data for expense chart
    this.updateCategoryChart('expense', stats.expenseByCategory, stats.totalExpense);
    
    // Prepare data for income chart
    this.updateCategoryChart('income', stats.incomeByCategory, stats.totalIncome);
  },
  
  /**
   * Update a category chart (income or expense)
   * @param {string} type - Chart type (income or expense)
   * @param {Object} data - Category data
   * @param {number} total - Total amount
   */
  updateCategoryChart: function(type, categoryData, total) {
    const chartCanvas = document.getElementById(`${type}-chart`);
    const breakdownEl = document.getElementById(`${type}-breakdown`);
    
    // Prepare chart data
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    
    if (labels.length === 0) {
      breakdownEl.innerHTML = `<div class="empty-state"><p>No ${type} data to display.</p></div>`;
      return;
    }
    
    // Destroy existing chart if it exists
    if (this.charts[type]) {
      this.charts[type].destroy();
    }
    
    // Create colors array
    const baseColor = type === 'income' ? 'rgba(56, 161, 105, ' : 'rgba(229, 62, 62, ';
    const colors = labels.map((_, index) => {
      const opacity = 0.4 + (index * 0.5 / labels.length);
      return baseColor + opacity + ')';
    });
    
    // Create new chart
    this.charts[type] = new Chart(chartCanvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace(', 0.', ', 1.')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 15
            }
          }
        }
      }
    });
    
    // Update breakdown list
    breakdownEl.innerHTML = '';
    
    // Find categories to get icons
    const categories = Storage.getCategories(type);
    
    // Create breakdown items
    labels.forEach((category, index) => {
      const amount = data[index];
      const percentage = Utils.calculatePercentage(amount, total);
      
      // Find category icon
      const categoryObj = categories.find(c => c.name === category) || {};
      const iconClass = categoryObj.icon || (type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down');
      
      const breakdownItem = document.createElement('div');
      breakdownItem.className = 'breakdown-item';
      
      breakdownItem.innerHTML = `
        <div class="breakdown-icon ${type === 'income' ? 'income-icon' : 'expense-icon'}">
          <i class="fa-solid ${iconClass}"></i>
        </div>
        <div class="breakdown-info">
          <div class="breakdown-category">${category}</div>
          <div class="breakdown-amount">${Utils.formatRupee(amount)}</div>
        </div>
        <div class="breakdown-percentage ${type === 'income' ? 'income-percentage' : 'expense-percentage'}">
          ${percentage}%
        </div>
      `;
      
      breakdownEl.appendChild(breakdownItem);
    });
  }
};
