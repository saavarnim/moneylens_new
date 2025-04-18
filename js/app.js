
/**
 * Main application logic for MoneyLens
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize storage
  Storage.initialize();
  
  // Initialize UI
  UI.initialize();
  
  // Initialize active tab
  setActiveTab('transactions');
  
  // Tab navigation
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      setActiveTab(tabName);
    });
  });
  
  // Transaction filter tabs
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Update active state
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Filter transactions
      const filter = this.getAttribute('data-filter');
      UI.displayTransactions(filter);
    });
  });
  
  // Insight tabs
  const insightTabs = document.querySelectorAll('.insight-tab');
  insightTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Update active state
      insightTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Show selected insight
      const insight = this.getAttribute('data-insight');
      document.getElementById('expense-insight').style.display = insight === 'expense' ? 'block' : 'none';
      document.getElementById('income-insight').style.display = insight === 'income' ? 'block' : 'none';
    });
  });
  
  // Transaction type change
  const transactionTypeInputs = document.querySelectorAll('input[name="transaction-type"]');
  transactionTypeInputs.forEach(input => {
    input.addEventListener('change', function() {
      UI.loadCategories(this.value);
    });
  });
  
  // Add transaction form
  const transactionForm = document.getElementById('transaction-form');
  transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const type = document.querySelector('input[name="transaction-type"]:checked').value;
    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    
    // Validate
    if (!category) {
      Utils.showToast('Error', 'Please select a category', 'error');
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Utils.showToast('Error', 'Please enter a valid positive amount', 'error');
      return;
    }
    
    // Create transaction object
    const transaction = {
      type,
      category,
      amount: Number(amount),
      description,
      date: new Date(`${date}T${time}`).toISOString(),
    };
    
    // Save transaction
    Storage.addTransaction(transaction);
    
    // Reset form
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    
    // Update UI
    UI.displayTransactions();
    UI.updateStats();
    UI.displayBudgets();
    UI.updateCharts();
    
    // Show toast
    Utils.showToast('Success', `${type === 'income' ? 'Income' : 'Expense'} added successfully`);
  });
  
  // Add budget form
  const budgetForm = document.getElementById('budget-form');
  budgetForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const category = document.getElementById('budget-category').value;
    const amount = document.getElementById('budget-amount').value;
    
    // Validate
    if (!category) {
      Utils.showToast('Error', 'Please select a category', 'error');
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Utils.showToast('Error', 'Please enter a valid positive amount', 'error');
      return;
    }
    
    // Save budget
    Storage.saveBudget({
      category,
      amount: Number(amount)
    });
    
    // Reset form
    document.getElementById('budget-amount').value = '';
    
    // Update UI
    UI.displayBudgets();
    
    // Show toast
    Utils.showToast('Success', `Budget set for ${category}`);
  });
  
  // Add category button
  const addCategoryBtn = document.getElementById('add-category-btn');
  const categoryModal = document.getElementById('category-modal');
  const closeBtn = categoryModal.querySelector('.close');
  
  addCategoryBtn.addEventListener('click', function() {
    // Set default category type to match transaction form
    const transactionType = document.querySelector('input[name="transaction-type"]:checked').value;
    document.querySelector(`input[name="category-type"][value="${transactionType}"]`).checked = true;
    
    // Show modal
    categoryModal.style.display = 'block';
  });
  
  closeBtn.addEventListener('click', function() {
    categoryModal.style.display = 'none';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === categoryModal) {
      categoryModal.style.display = 'none';
    }
  });
  
  // Add category form
  const categoryForm = document.getElementById('category-form');
  categoryForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const type = document.querySelector('input[name="category-type"]:checked').value;
    const name = document.getElementById('category-name').value.trim();
    const icon = document.getElementById('category-icon').value;
    
    // Validate
    if (!name) {
      Utils.showToast('Error', 'Please enter a category name', 'error');
      return;
    }
    
    try {
      // Save category
      Storage.addCategory({
        name,
        type,
        icon
      });
      
      // Reset form
      document.getElementById('category-name').value = '';
      
      // Update UI
      UI.loadCategories(document.querySelector('input[name="transaction-type"]:checked').value);
      UI.loadBudgetCategories();
      
      // Close modal
      categoryModal.style.display = 'none';
      
      // Show toast
      Utils.showToast('Success', `${name} category added successfully`);
    } catch (error) {
      // Error is already handled in Storage.addCategory
      if (error.message !== 'Category already exists') {
        Utils.showToast('Error', 'Failed to add category', 'error');
      }
    }
  });
  
  // Set active tab function
  function setActiveTab(tabName) {
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => {
      if (tab.getAttribute('data-tab') === tabName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Show active tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
      if (pane.id === `${tabName}-tab`) {
        pane.classList.add('active');
        pane.style.display = 'block';
      } else {
        pane.classList.remove('active');
        pane.style.display = 'none';
      }
    });
  }
});
