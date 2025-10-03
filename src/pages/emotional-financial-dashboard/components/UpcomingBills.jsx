import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import billService from '../../../services/BillService';
import BillEntryModal from '../../../components/ui/BillEntryModal';
import BillList from '../../../components/ui/BillList';

const UpcomingBills = ({ 
  emotionalState = 'calm',
  culturalContext = 'default',
  refreshTrigger = 0,
  className = '' 
}) => {
  const [bills, setBills] = useState([]);
  const [totalUpcoming, setTotalUpcoming] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  useEffect(() => {
    loadBills();
  }, [refreshTrigger]);

  const loadBills = () => {
    try {
      const upcomingBills = billService.getUpcomingBills();
      setBills(upcomingBills);
      
      const total = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
      setTotalUpcoming(total);
    } catch (error) {
      console.error('Error loading bills:', error);
      setBills([]);
      setTotalUpcoming(0);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAddBill = () => {
    setEditingBill(null);
    setShowAddModal(true);
  };

  const handleEditBill = (bill) => {
    setEditingBill(bill);
    setShowAddModal(true);
  };

  const handleSaveBill = () => {
    loadBills();
    setShowAddModal(false);
    setEditingBill(null);
  };

  const handleMarkPaid = () => {
    loadBills();
  };

  const handleDeleteBill = () => {
    loadBills();
  };

  if (isLoading) {
    return (
      <div className={`glass-card rounded-2xl p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/2" />
          <div className="h-8 bg-muted rounded w-3/4" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
              <div className="h-4 bg-muted rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {culturalContext === 'hindi' ? 'आगामी बिल' : 'Upcoming Bills'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {culturalContext === 'hindi' ? 'अपने आगामी बिलों का प्रबंधन करें' : 'Manage your upcoming bills'}
          </p>
        </div>
        
        <Button
          onClick={handleAddBill}
          size="sm"
          className="flex items-center space-x-2"
        >
          <Icon name="Plus" size={16} />
          <span>{culturalContext === 'hindi' ? 'बिल जोड़ें' : 'Add Bill'}</span>
        </Button>
      </div>

      {/* Total Amount Summary */}
      {bills.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' ? 'कुल आगामी राशि' : 'Total Upcoming Amount'}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalUpcoming)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {bills.length} {culturalContext === 'hindi' ? 'बिल' : 'bills'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {culturalContext === 'hindi' ? 'भुगतान के लिए तैयार' : 'Ready for payment'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bills List */}
      <BillList
        bills={bills}
        onEdit={handleEditBill}
        onMarkPaid={handleMarkPaid}
        onDelete={handleDeleteBill}
        culturalContext={culturalContext}
      />

      {/* Bill Entry Modal */}
      <BillEntryModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingBill(null);
        }}
        onSave={handleSaveBill}
        bill={editingBill}
        culturalContext={culturalContext}
      />
    </div>
  );
};

export default UpcomingBills;