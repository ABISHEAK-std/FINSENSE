import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import billService from '../../services/BillService';

const BillEntryModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  bill = null, // For editing existing bill
  culturalContext = 'default',
  className = '' 
}) => {
  const [formData, setFormData] = useState({
    billName: '',
    dueDate: '',
    amount: '',
    category: 'other',
    emotion: 'neutral',
    isRecurring: false,
    recurringInterval: 'monthly'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data when modal opens or bill changes
  useEffect(() => {
    if (isOpen) {
      if (bill) {
        // Editing existing bill
        setFormData({
          billName: bill.billName || '',
          dueDate: bill.dueDate || '',
          amount: bill.amount || '',
          category: bill.category || 'other',
          emotion: bill.emotion || 'neutral',
          isRecurring: bill.isRecurring || false,
          recurringInterval: bill.recurringInterval || 'monthly'
        });
      } else {
        // Adding new bill - set default due date to next month
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setFormData({
          billName: '',
          dueDate: nextMonth.toISOString().split('T')[0],
          amount: '',
          category: 'other',
          emotion: 'neutral',
          isRecurring: false,
          recurringInterval: 'monthly'
        });
      }
      setErrors({});
    }
  }, [isOpen, bill]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.billName.trim()) {
      newErrors.billName = culturalContext === 'hindi' ? 'बिल का नाम आवश्यक है' : 'Bill name is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = culturalContext === 'hindi' ? 'देय तिथि आवश्यक है' : 'Due date is required';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = culturalContext === 'hindi' ? 'देय तिथि आज से पहले नहीं हो सकती' : 'Due date cannot be in the past';
      }
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = culturalContext === 'hindi' ? 'वैध राशि दर्ज करें' : 'Enter valid amount';
    }
    
    if (!formData.category) {
      newErrors.category = culturalContext === 'hindi' ? 'श्रेणी चुनें' : 'Select category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const billData = {
        ...formData,
        amount: Number(formData.amount),
        culturalContext
      };
      
      if (bill) {
        // Update existing bill
        await billService.updateBill(bill.id, billData);
        console.log('Bill updated successfully');
      } else {
        // Add new bill
        await billService.addBill(billData);
        console.log('Bill added successfully');
      }
      
      onSave && onSave();
      onClose();
    } catch (error) {
      console.error('Error saving bill:', error);
      alert(culturalContext === 'hindi' 
        ? 'बिल सेव करने में त्रुटि हुई' 
        : 'Error saving bill');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      billName: '',
      dueDate: '',
      amount: '',
      category: 'other',
      emotion: 'neutral',
      isRecurring: false,
      recurringInterval: 'monthly'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const categories = billService.getBillCategories();
  const recurringIntervals = billService.getRecurringIntervals();
  const emotions = billService.getEmotionOptions();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
      <div className={`bg-background rounded-2xl shadow-2xl w-full max-w-md max-h-[50vh] overflow-y-auto ${className}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {culturalContext === 'hindi' 
                ? (bill ? 'बिल संपादित करें' : 'नया बिल जोड़ें')
                : (bill ? 'Edit Bill' : 'Add New Bill')
              }
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Bill Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {culturalContext === 'hindi' ? 'बिल का नाम *' : 'Bill Name *'}
              </label>
              <Input
                type="text"
                value={formData.billName}
                onChange={(e) => handleInputChange('billName', e.target.value)}
                placeholder={culturalContext === 'hindi' ? 'उदाहरण: किराया, बिजली बिल' : 'e.g., Rent, Electricity Bill'}
                error={errors.billName}
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {culturalContext === 'hindi' ? 'राशि (₹) *' : 'Amount (₹) *'}
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                placeholder={culturalContext === 'hindi' ? '5000' : '5000'}
                error={errors.amount}
                min="0"
                step="0.01"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {culturalContext === 'hindi' ? 'देय तिथि *' : 'Due Date *'}
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                error={errors.dueDate}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {culturalContext === 'hindi' ? 'श्रेणी *' : 'Category *'}
              </label>
              <Select
                value={formData.category}
                onChange={(value) => handleInputChange('category', value)}
                options={categories}
                error={errors.category}
              />
            </div>

            {/* Emotion */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {culturalContext === 'hindi' ? 'भावना' : 'Emotion'}
              </label>
              <Select
                value={formData.emotion}
                onChange={(value) => handleInputChange('emotion', value)}
                options={emotions}
              />
            </div>

            {/* Recurring Bill */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                  className="rounded border-border"
                />
                <label htmlFor="isRecurring" className="text-sm font-medium text-foreground">
                  {culturalContext === 'hindi' ? 'आवर्ती बिल' : 'Recurring Bill'}
                </label>
              </div>

              {formData.isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {culturalContext === 'hindi' ? 'आवृत्ति' : 'Frequency'}
                  </label>
                  <Select
                    value={formData.recurringInterval}
                    onChange={(value) => handleInputChange('recurringInterval', value)}
                    options={recurringIntervals}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                {culturalContext === 'hindi' ? 'रद्द करें' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{culturalContext === 'hindi' ? 'सेव कर रहे हैं...' : 'Saving...'}</span>
                  </div>
                ) : (
                  culturalContext === 'hindi' ? 'सेव करें' : 'Save'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillEntryModal;
