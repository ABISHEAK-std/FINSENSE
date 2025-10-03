import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import billService from '../../services/BillService';

const BillList = ({ 
  bills = [], 
  onEdit, 
  onMarkPaid, 
  onDelete,
  culturalContext = 'default',
  className = '' 
}) => {
  const [loadingBillId, setLoadingBillId] = useState(null);

  const formatIndianNumber = (num) => {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(1) + 'Cr';
    } else if (num >= 100000) {
      return (num / 100000).toFixed(1) + 'L';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString('en-IN');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateStatus = (dueDate) => {
    const days = getDaysUntilDue(dueDate);
    
    if (days < 0) {
      return {
        status: 'overdue',
        text: culturalContext === 'hindi' ? `${Math.abs(days)} दिन देर` : `${Math.abs(days)} days overdue`,
        color: 'text-red-600'
      };
    } else if (days === 0) {
      return {
        status: 'due-today',
        text: culturalContext === 'hindi' ? 'आज देय' : 'Due today',
        color: 'text-orange-600'
      };
    } else if (days <= 3) {
      return {
        status: 'due-soon',
        text: culturalContext === 'hindi' ? `${days} दिन बाकी` : `${days} days left`,
        color: 'text-yellow-600'
      };
    } else {
      return {
        status: 'upcoming',
        text: culturalContext === 'hindi' ? `${days} दिन बाकी` : `${days} days left`,
        color: 'text-green-600'
      };
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      rent: 'Home',
      utilities: 'Zap',
      insurance: 'Shield',
      subscription: 'CreditCard',
      emi: 'Calendar',
      credit_card: 'CreditCard',
      loan: 'Banknote',
      other: 'FileText'
    };
    return iconMap[category] || 'FileText';
  };

  const getEmotionIcon = (emotion) => {
    const emotionMap = {
      neutral: '😐',
      stressed: '😰',
      anxious: '😟',
      worried: '😟',
      calm: '😌',
      confident: '😊'
    };
    return emotionMap[emotion] || '😐';
  };

  const handleMarkPaid = async (billId) => {
    setLoadingBillId(billId);
    try {
      await billService.markBillAsPaid(billId);
      onMarkPaid && onMarkPaid();
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      alert(culturalContext === 'hindi' 
        ? 'बिल भुगतान में त्रुटि हुई' 
        : 'Error marking bill as paid');
    } finally {
      setLoadingBillId(null);
    }
  };

  const handleDelete = async (billId) => {
    if (window.confirm(culturalContext === 'hindi' 
      ? 'क्या आप इस बिल को हटाना चाहते हैं?' 
      : 'Are you sure you want to delete this bill?')) {
      try {
        await billService.deleteBill(billId);
        onDelete && onDelete();
      } catch (error) {
        console.error('Error deleting bill:', error);
        alert(culturalContext === 'hindi' 
          ? 'बिल हटाने में त्रुटि हुई' 
          : 'Error deleting bill');
      }
    }
  };

  if (bills.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="FileText" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? 'कोई आगामी बिल नहीं' : 'No Upcoming Bills'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {culturalContext === 'hindi' 
            ? 'अभी तक कोई बिल नहीं जोड़ा गया है। नया बिल जोड़ने के लिए + बटन पर क्लिक करें।'
            : 'No bills have been added yet. Click the + button to add a new bill.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {bills.map((bill) => {
        const dueStatus = getDueDateStatus(bill.dueDate);
        const isOverdue = dueStatus.status === 'overdue';
        
        return (
          <div
            key={bill.id}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              isOverdue 
                ? 'border-red-200 bg-red-50/50' 
                : 'border-border bg-card hover:bg-muted/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isOverdue ? 'bg-red-100' : 'bg-muted/50'
                    }`}>
                      <Icon 
                        name={getCategoryIcon(bill.category)} 
                        size={20} 
                        className={isOverdue ? 'text-red-600' : 'text-muted-foreground'} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground truncate">
                        {bill.billName}
                      </h4>
                      {bill.isRecurring && (
                        <div className="flex-shrink-0">
                          <Icon name="RotateCcw" size={14} className="text-blue-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>₹{formatIndianNumber(bill.amount)}</span>
                      <span>•</span>
                      <span>{formatDate(bill.dueDate)}</span>
                      <span>•</span>
                      <span className={dueStatus.color}>
                        {dueStatus.text}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="capitalize">{bill.category}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <span>{getEmotionIcon(bill.emotion)}</span>
                    <span className="capitalize">{bill.emotion}</span>
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit && onEdit(bill)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="Edit" size={16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMarkPaid(bill.id)}
                  disabled={loadingBillId === bill.id}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  {loadingBillId === bill.id ? (
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon name="Check" size={16} />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(bill.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BillList;
