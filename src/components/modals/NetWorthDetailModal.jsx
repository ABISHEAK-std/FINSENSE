import React from 'react';
import Icon from '../AppIcon';

const NetWorthDetailModal = ({ 
  isOpen, 
  onClose, 
  data, 
  culturalContext = 'default' 
}) => {
  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Add percentage calculation helper
  const calculateShare = (amount, total) => {
    if (!total) return 0;
    return Math.abs((amount / Math.abs(total)) * 100);
  };

  // Enhance breakdown data with percentages
  const enhancedBreakdown = data.breakdown?.map(item => ({
    ...item,
    share: calculateShare(
      item.amount,
      item.amount > 0 ? data.assets : data.liabilities
    )
  }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {culturalContext === 'hindi' ? 'नेट वर्थ विस्तार' : 'Net Worth Breakdown'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' ? 'आपकी वित्तीय स्थिति का विस्तृत विवरण' : 'Detailed breakdown of your financial position'}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <p className="text-sm text-green-600 font-medium">
              {culturalContext === 'hindi' ? 'कुल संपत्ति' : 'Total Assets'}
            </p>
            <p className="text-lg font-bold text-green-700">{formatCurrency(data.assets)}</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-sm text-red-600 font-medium">
              {culturalContext === 'hindi' ? 'कुल देनदारियां' : 'Total Liabilities'}
            </p>
            <p className="text-lg font-bold text-red-700">{formatCurrency(data.liabilities)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-600 font-medium">
              {culturalContext === 'hindi' ? 'नेट वर्थ' : 'Net Worth'}
            </p>
            <p className="text-lg font-bold text-blue-700">{formatCurrency(data.current)}</p>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="border rounded-xl overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  {culturalContext === 'hindi' ? 'श्रेणी' : 'Category'}
                </th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                  {culturalContext === 'hindi' ? 'राशि' : 'Amount'}
                </th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                  {culturalContext === 'hindi' ? 'हिस्सा (%)' : 'Share (%)'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Assets Section */}
              <tr className="bg-muted/20">
                <td colSpan={3} className="p-4 text-sm font-medium">
                  {culturalContext === 'hindi' ? 'संपत्तियां' : 'Assets'}
                </td>
              </tr>
              {enhancedBreakdown
                ?.filter(item => item.amount > 0)
                .map((item, index) => (
                  <tr key={`asset-${index}`}>
                    <td className="p-4 text-sm">{item.category}</td>
                    <td className="p-4 text-sm text-right font-medium text-green-600">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="p-4 text-sm text-right font-medium">
                      {item.share.toFixed(1)}%
                    </td>
                  </tr>
                ))}

              {/* Liabilities Section */}
              <tr className="bg-muted/20">
                <td colSpan={3} className="p-4 text-sm font-medium">
                  {culturalContext === 'hindi' ? 'देनदारियां' : 'Liabilities'}
                </td>
              </tr>
              {enhancedBreakdown
                ?.filter(item => item.amount < 0)
                .map((item, index) => (
                  <tr key={`liability-${index}`}>
                    <td className="p-4 text-sm">{item.category}</td>
                    <td className="p-4 text-sm text-right font-medium text-red-600">
                      {formatCurrency(Math.abs(item.amount))}
                    </td>
                    <td className="p-4 text-sm text-right font-medium">
                      {item.share.toFixed(1)}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            {culturalContext === 'hindi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetWorthDetailModal;
