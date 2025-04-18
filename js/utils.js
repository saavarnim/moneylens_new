
/**
 * Utility functions for MoneyLens
 */

const Utils = {
  /**
   * Format a number as Indian Rupees
   * @param {number} amount - The amount to format
   * @returns {string} Formatted amount
   */
  formatRupee: function(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  },

  /**
   * Format a date to YYYY-MM-DD format for input fields
   * @param {Date} date - The date to format
   * @returns {string} Formatted date
   */
  formatDateForInput: function(date) {
    return date.toISOString().split('T')[0];
  },

  /**
   * Format a time to HH:MM format for input fields
   * @param {Date} date - The date to format
   * @returns {string} Formatted time
   */
  formatTimeForInput: function(date) {
    return date.toTimeString().slice(0, 5);
  },

  /**
   * Format a date and time for display
   * @param {Date} date - The date to format
   * @returns {string} Formatted date and time
   */
  formatDateTime: function(date) {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },

  /**
   * Calculate percentage and format it
   * @param {number} value - The value
   * @param {number} total - The total
   * @returns {string} Formatted percentage
   */
  calculatePercentage: function(value, total) {
    if (total === 0) return '0%';
    return Math.round((value / total) * 100);
  },

  /**
   * Generate a unique ID
   * @returns {string} Unique ID
   */
  generateId: function() {
    return Date.now().toString();
  },

  /**
   * Get current date and time
   * @returns {Object} Current date and time
   */
  getCurrentDateTime: function() {
    const now = new Date();
    return {
      date: this.formatDateForInput(now),
      time: this.formatTimeForInput(now)
    };
  },

  /**
   * Show toast notification
   * @param {string} title - Toast title
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error)
   */
  showToast: function(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastDescription = document.getElementById('toast-description');
    const toastIcon = document.querySelector('.toast-icon i');
    const toastProgress = document.querySelector('.toast-progress');
    
    // Set content
    toastTitle.textContent = title;
    toastDescription.textContent = message;
    
    // Set type
    if (type === 'success') {
      toastIcon.className = 'fa-solid fa-circle-check';
      toastProgress.style.backgroundColor = 'var(--success)';
      toastIcon.style.color = 'var(--success)';
    } else {
      toastIcon.className = 'fa-solid fa-circle-xmark';
      toastProgress.style.backgroundColor = 'var(--danger)';
      toastIcon.style.color = 'var(--danger)';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Reset animation
    toastProgress.style.animation = 'none';
    void toastProgress.offsetWidth; // Force reflow
    toastProgress.style.animation = 'progress 3s linear forwards';
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  },

  /**
   * Get a category icon element
   * @param {string} iconName - Font Awesome icon name
   * @param {string} type - Category type (income or expense)
   * @returns {HTMLElement} Icon element
   */
  getCategoryIconElement: function(iconName, type) {
    const iconDiv = document.createElement('div');
    iconDiv.className = `breakdown-icon ${type === 'income' ? 'income-icon' : 'expense-icon'}`;
    
    const iconElement = document.createElement('i');
    iconElement.className = `fa-solid ${iconName}`;
    
    iconDiv.appendChild(iconElement);
    return iconDiv;
  }
};
