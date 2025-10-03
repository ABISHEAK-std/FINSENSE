import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PortfolioUpdate = ({ culturalContext, onUpdate, onClose }) => {
  const [investmentData, setInvestmentData] = useState({
    type: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const investmentTypes = [
    { id: 'stocks', label: culturalContext === 'hindi' ? 'स्टॉक्स' : 'Stocks' },
    { id: 'mutual-funds', label: culturalContext === 'hindi' ? 'म्यूचुअल फंड' : 'Mutual Funds' },
    { id: 'etf', label: 'ETF' },
    { id: 'bonds', label: culturalContext === 'hindi' ? 'बॉन्ड्स' : 'Bonds' },
    { id: 'fd', label: culturalContext === 'hindi' ? 'फिक्स्ड डिपॉजिट' : 'Fixed Deposit' },
    { id: 'gold', label: culturalContext === 'hindi' ? 'सोना' : 'Gold' },
    { id: 'crypto', label: culturalContext === 'hindi' ? 'क्रिप्टो' : 'Crypto' },
    { id: 'real-estate', label: culturalContext === 'hindi' ? 'रियल एस्टेट' : 'Real Estate' }
  ];

  const handleSubmit = () => {
    if (!investmentData.type || !investmentData.amount) {
      alert(culturalContext === 'hindi' 
        ? 'कृपया सभी आवश्यक फील्ड भरें' 
        : 'Please fill all required fields');
      return;
    }

    if (Number(investmentData.amount) <= 0) {
      alert(culturalContext === 'hindi' 
        ? 'राशि शून्य से अधिक होनी चाहिए' 
        : 'Amount must be greater than zero');
      return;
    }

    const newInvestment = {
      id: Date.now(),
      type: investmentTypes.find(t => t.id === investmentData.type)?.label || investmentData.type,
      amount: Number(investmentData.amount),
      date: investmentData.date,
      note: investmentData.note,
      createdAt: new Date().toISOString()
    };

    onUpdate(newInvestment);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading text-foreground">
            {culturalContext === 'hindi' ? 'नया निवेश जोड़ें' : 'Add New Investment'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>

        <div className="space-y-4">
          {/* Investment Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {culturalContext === 'hindi' ? 'निवेश प्रकार *' : 'Investment Type *'}
            </label>
            <select
              value={investmentData.type}
              onChange={(e) => setInvestmentData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{culturalContext === 'hindi' ? 'प्रकार चुनें' : 'Select Type'}</option>
              {investmentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {culturalContext === 'hindi' ? 'राशि (₹) *' : 'Amount (₹) *'}
            </label>
            <input
              type="number"
              min="1"
              value={investmentData.amount}
              onChange={(e) => setInvestmentData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={culturalContext === 'hindi' ? 'राशि दर्ज करें' : 'Enter amount'}
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {culturalContext === 'hindi' ? 'निवेश तिथि' : 'Investment Date'}
            </label>
            <input
              type="date"
              value={investmentData.date}
              onChange={(e) => setInvestmentData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {culturalContext === 'hindi' ? 'नोट (वैकल्पिक)' : 'Note (Optional)'}
            </label>
            <textarea
              value={investmentData.note}
              onChange={(e) => setInvestmentData(prev => ({ ...prev, note: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none"
              placeholder={culturalContext === 'hindi' ? 'अतिरिक्त जानकारी...' : 'Additional details...'}
            />
          </div>

          {/* Investment Tip */}
          <div className="p-3 bg-primary/10 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-primary">
                  {culturalContext === 'hindi' ? 'निवेश टिप' : 'Investment Tip'}
                </h4>
                <p className="text-xs text-primary/80 mt-1">
                  {culturalContext === 'hindi' 
                    ? 'विविधीकरण महत्वपूर्ण है। अलग-अलग एसेट क्लास में निवेश करें।'
                    : 'Diversification is key. Invest across different asset classes.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            {culturalContext === 'hindi' ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={!investmentData.type || !investmentData.amount}
          >
            {culturalContext === 'hindi' ? 'जोड़ें' : 'Add Investment'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioUpdate;
