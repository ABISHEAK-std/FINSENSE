import { financialDataService } from './FinancialDataService';

class BillService {
  constructor() {
    this.storageKey = 'finsense_bills';
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      const initialData = {
        bills: [],
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  // Get all bills
  getBills() {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      return data.bills || [];
    } catch (error) {
      console.error('Error getting bills:', error);
      return [];
    }
  }

  // Get upcoming bills (unpaid)
  getUpcomingBills() {
    const bills = this.getBills();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return bills.filter(bill => 
      !bill.isPaid && new Date(bill.dueDate) >= today
    ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  // Get paid bills (for recent transactions)
  getPaidBills() {
    const bills = this.getBills();
    return bills.filter(bill => bill.isPaid)
      .sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate));
  }

  // Add a new bill
  addBill(billData) {
    try {
      const bills = this.getBills();
      const newBill = {
        id: Date.now().toString(),
        billName: billData.billName || 'Untitled Bill',
        dueDate: billData.dueDate || new Date().toISOString().split('T')[0],
        amount: Number(billData.amount) || 0,
        category: billData.category || 'other',
        emotion: billData.emotion || 'neutral',
        isRecurring: billData.isRecurring || false,
        recurringInterval: billData.recurringInterval || 'monthly', // monthly, weekly, yearly
        isPaid: false,
        paidDate: null,
        createdAt: new Date().toISOString(),
        culturalContext: billData.culturalContext || 'default'
      };

      bills.push(newBill);
      this.saveBills(bills);
      
      console.log('Bill added successfully:', newBill);
      return newBill;
    } catch (error) {
      console.error('Error adding bill:', error);
      throw error;
    }
  }

  // Mark a bill as paid
  async markBillAsPaid(billId) {
    try {
      const bills = this.getBills();
      const billIndex = bills.findIndex(bill => bill.id === billId);
      
      if (billIndex === -1) {
        throw new Error('Bill not found');
      }

      const bill = bills[billIndex];
      const paidDate = new Date().toISOString();
      
      // Mark as paid
      bills[billIndex] = {
        ...bill,
        isPaid: true,
        paidDate: paidDate
      };

      // If it's a recurring bill, create the next occurrence
      if (bill.isRecurring) {
        const nextDueDate = this.calculateNextDueDate(bill.dueDate, bill.recurringInterval);
        const nextBill = {
          ...bill,
          id: Date.now().toString() + '_recurring',
          dueDate: nextDueDate,
          isPaid: false,
          paidDate: null,
          createdAt: new Date().toISOString()
        };
        bills.push(nextBill);
      }

      this.saveBills(bills);

      // Add to expense tracking and update net worth
      await this.processBillPayment(bill);

      console.log('Bill marked as paid:', bill);
      return bill;
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      throw error;
    }
  }

  // Process bill payment - integrate with expense tracking
  async processBillPayment(bill) {
    try {
      // Add to expense entries
      const expenseData = {
        amount: bill.amount,
        category: bill.category,
        description: `Bill Payment: ${bill.billName}`,
        emotion: bill.emotion,
        timestamp: new Date(bill.paidDate),
        culturalContext: bill.culturalContext
      };

      // Use FinancialDataService to add expense and update net worth
      financialDataService.addExpense(expenseData);

      // Dispatch event to notify dashboard of update
      const event = new CustomEvent('transaction-updated', {
        detail: { type: 'bill_payment', amount: bill.amount, billName: bill.billName }
      });
      document.dispatchEvent(event);

      console.log('Bill payment processed and added to expenses');
    } catch (error) {
      console.error('Error processing bill payment:', error);
      throw error;
    }
  }

  // Calculate next due date for recurring bills
  calculateNextDueDate(currentDueDate, interval) {
    const date = new Date(currentDueDate);
    
    switch (interval) {
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }
    
    return date.toISOString().split('T')[0];
  }

  // Update a bill
  updateBill(billId, updateData) {
    try {
      const bills = this.getBills();
      const billIndex = bills.findIndex(bill => bill.id === billId);
      
      if (billIndex === -1) {
        throw new Error('Bill not found');
      }

      bills[billIndex] = {
        ...bills[billIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      this.saveBills(bills);
      return bills[billIndex];
    } catch (error) {
      console.error('Error updating bill:', error);
      throw error;
    }
  }

  // Delete a bill
  deleteBill(billId) {
    try {
      const bills = this.getBills();
      const filteredBills = bills.filter(bill => bill.id !== billId);
      this.saveBills(filteredBills);
      return true;
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw error;
    }
  }

  // Save bills to localStorage
  saveBills(bills) {
    const data = {
      bills: bills,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Get bill categories
  getBillCategories() {
    return [
      { value: 'rent', label: 'Rent' },
      { value: 'utilities', label: 'Utilities' },
      { value: 'insurance', label: 'Insurance' },
      { value: 'subscription', label: 'Subscription' },
      { value: 'emi', label: 'EMI' },
      { value: 'credit_card', label: 'Credit Card' },
      { value: 'loan', label: 'Loan' },
      { value: 'other', label: 'Other' }
    ];
  }

  // Get recurring intervals
  getRecurringIntervals() {
    return [
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' }
    ];
  }

  // Get emotion options
  getEmotionOptions() {
    return [
      { value: 'neutral', label: 'Neutral' },
      { value: 'stressed', label: 'Stressed' },
      { value: 'anxious', label: 'Anxious' },
      { value: 'worried', label: 'Worried' },
      { value: 'calm', label: 'Calm' },
      { value: 'confident', label: 'Confident' }
    ];
  }

  // Get bills by category for analytics
  getBillsByCategory() {
    const bills = this.getBills();
    const categoryMap = {};
    
    bills.forEach(bill => {
      if (!categoryMap[bill.category]) {
        categoryMap[bill.category] = {
          total: 0,
          count: 0,
          paid: 0,
          unpaid: 0
        };
      }
      
      categoryMap[bill.category].total += bill.amount;
      categoryMap[bill.category].count += 1;
      
      if (bill.isPaid) {
        categoryMap[bill.category].paid += bill.amount;
      } else {
        categoryMap[bill.category].unpaid += bill.amount;
      }
    });
    
    return categoryMap;
  }

  // Get upcoming bills total amount
  getUpcomingBillsTotal() {
    const upcomingBills = this.getUpcomingBills();
    return upcomingBills.reduce((total, bill) => total + bill.amount, 0);
  }

  // Get overdue bills
  getOverdueBills() {
    const bills = this.getBills();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return bills.filter(bill => 
      !bill.isPaid && new Date(bill.dueDate) < today
    ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }
}

// Create singleton instance
const billService = new BillService();
export default billService;