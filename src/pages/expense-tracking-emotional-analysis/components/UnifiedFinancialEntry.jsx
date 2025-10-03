import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UnifiedFinancialEntry = ({ 
  onAddIncome, 
  onAddExpense,
  culturalContext = 'default',
  emotionalState = 'calm',
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('income'); // 'income' or 'expense'
  
  // Income form state
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeSource, setIncomeSource] = useState('');
  const [incomeDescription, setIncomeDescription] = useState('');
  const [incomeEmotion, setIncomeEmotion] = useState('');
  const [isIncomeSubmitting, setIsIncomeSubmitting] = useState(false);

  // Expense form state
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseEmotion, setExpenseEmotion] = useState('');
  const [isExpenseSubmitting, setIsExpenseSubmitting] = useState(false);

  const getIncomeSourceOptions = () => {
    if (culturalContext === 'hindi') {
      return [
        { value: 'salary', label: '💰 वेतन', description: 'मासिक वेतन और बोनस' },
        { value: 'freelance', label: '💼 फ्रीलांस', description: 'प्रोजेक्ट और कंसल्टिंग' },
        { value: 'business', label: '🏢 व्यापार', description: 'व्यापारिक आय' },
        { value: 'investment', label: '📈 निवेश', description: 'निवेश रिटर्न और डिविडेंड' },
        { value: 'rental', label: '🏠 किराया', description: 'संपत्ति किराया' },
        { value: 'gift', label: '🎁 उपहार', description: 'पारिवारिक उपहार और सहायता' },
        { value: 'bonus', label: '🎯 बोनस', description: 'प्रदर्शन बोनस' },
        { value: 'other', label: '📋 अन्य', description: 'अन्य आय स्रोत' }
      ];
    }
    return [
      { value: 'salary', label: '💰 Salary', description: 'Monthly salary and bonuses' },
      { value: 'freelance', label: '💼 Freelance', description: 'Projects and consulting' },
      { value: 'business', label: '🏢 Business', description: 'Business income' },
      { value: 'investment', label: '📈 Investment', description: 'Investment returns and dividends' },
      { value: 'rental', label: '🏠 Rental', description: 'Property rental income' },
      { value: 'gift', label: '🎁 Gift', description: 'Family gifts and support' },
      { value: 'bonus', label: '🎯 Bonus', description: 'Performance bonus' },
      { value: 'other', label: '📋 Other', description: 'Other income sources' }
    ];
  };

  const getExpenseCategoryOptions = () => {
    if (culturalContext === 'hindi') {
      return [
        { value: 'food', label: '🍽️ भोजन', description: 'दैनिक भोजन और नाश्ता' },
        { value: 'transport', label: '🚗 परिवहन', description: 'यात्रा और वाहन खर्च' },
        { value: 'festival', label: '🎉 त्योहार', description: 'त्योहारी खरीदारी और उपहार' },
        { value: 'family', label: '👨‍👩‍👧‍👦 पारिवारिक', description: 'पारिवारिक जिम्मेदारियां' },
        { value: 'healthcare', label: '🏥 स्वास्थ्य', description: 'चिकित्सा और दवाइयां' },
        { value: 'education', label: '📚 शिक्षा', description: 'शिक्षा और कोर्स' },
        { value: 'traditional', label: '🕉️ पारंपरिक', description: 'धार्मिक और सांस्कृतिक' },
        { value: 'entertainment', label: '🎬 मनोरंजन', description: 'फिल्म और मनोरंजन' },
        { value: 'shopping', label: '🛍️ खरीदारी', description: 'कपड़े और सामान' },
        { value: 'utilities', label: '💡 उपयोगिताएं', description: 'बिजली, पानी, इंटरनेट' }
      ];
    }
    return [
      { value: 'food', label: '🍽️ Food & Dining', description: 'Meals, groceries, restaurants' },
      { value: 'transport', label: '🚗 Transportation', description: 'Travel, fuel, public transport' },
      { value: 'festival', label: '🎉 Festival Expenses', description: 'Festival shopping and gifts' },
      { value: 'family', label: '👨‍👩‍👧‍👦 Family Obligations', description: 'Family responsibilities' },
      { value: 'healthcare', label: '🏥 Healthcare', description: 'Medical and medicines' },
      { value: 'education', label: '📚 Education', description: 'Learning and courses' },
      { value: 'traditional', label: '🕉️ Traditional Purchases', description: 'Religious and cultural items' },
      { value: 'entertainment', label: '🎬 Entertainment', description: 'Movies and leisure' },
      { value: 'shopping', label: '🛍️ Shopping', description: 'Clothes and accessories' },
      { value: 'utilities', label: '💡 Utilities', description: 'Electricity, water, internet' }
    ];
  };

  const getEmotionOptions = () => {
    if (culturalContext === 'hindi') {
      return [
        { value: 'happy', label: '😊 खुश', description: 'खुशी और संतुष्टि' },
        { value: 'grateful', label: '🙏 आभारी', description: 'कृतज्ञता और आभार' },
        { value: 'proud', label: '🏆 गर्व', description: 'गर्व और उपलब्धि' },
        { value: 'relieved', label: '😌 राहत', description: 'राहत और शांति' },
        { value: 'excited', label: '🤩 उत्साहित', description: 'उत्साह और जोश' },
        { value: 'calm', label: '😌 शांत', description: 'शांति और संयम' },
        { value: 'motivated', label: '💪 प्रेरित', description: 'प्रेरणा और उत्साह' },
        { value: 'stressed', label: '😰 तनावग्रस्त', description: 'चिंता और तनाव' },
        { value: 'sad', label: '😢 उदास', description: 'दुख और निराशा' },
        { value: 'angry', label: '😠 गुस्सा', description: 'क्रोध और चिड़चिड़ाहट' },
        { value: 'anxious', label: '😟 चिंतित', description: 'चिंता और बेचैनी' },
        { value: 'guilty', label: '😔 अपराधबोध', description: 'पछतावा और अपराधबोध' },
        { value: 'neutral', label: '😐 तटस्थ', description: 'सामान्य और तटस्थ' }
      ];
    }
    return [
      { value: 'happy', label: '😊 Happy', description: 'Joy and satisfaction' },
      { value: 'grateful', label: '🙏 Grateful', description: 'Gratitude and appreciation' },
      { value: 'proud', label: '🏆 Proud', description: 'Pride and achievement' },
      { value: 'relieved', label: '😌 Relieved', description: 'Relief and peace' },
      { value: 'excited', label: '🤩 Excited', description: 'Enthusiasm and thrill' },
      { value: 'calm', label: '😌 Calm', description: 'Peace and composure' },
      { value: 'motivated', label: '💪 Motivated', description: 'Motivation and drive' },
      { value: 'stressed', label: '😰 Stressed', description: 'Anxiety and tension' },
      { value: 'sad', label: '😢 Sad', description: 'Sadness and disappointment' },
      { value: 'angry', label: '😠 Angry', description: 'Anger and irritation' },
      { value: 'anxious', label: '😟 Anxious', description: 'Worry and restlessness' },
      { value: 'guilty', label: '😔 Guilty', description: 'Regret and guilt' },
      { value: 'neutral', label: '😐 Neutral', description: 'Normal and neutral' }
    ];
  };

  const formatIndianNumber = (value) => {
    if (!value) return '';
    const numStr = value?.toString();
    const lastThree = numStr?.substring(numStr?.length - 3);
    const otherNumbers = numStr?.substring(0, numStr?.length - 3);
    if (otherNumbers !== '') {
      return otherNumbers?.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    } else {
      return lastThree;
    }
  };

  const handleAmountChange = (e, type) => {
    const value = e?.target?.value?.replace(/[^0-9]/g, '');
    if (type === 'income') {
      setIncomeAmount(value);
    } else {
      setExpenseAmount(value);
    }
  };

  const handleIncomeSubmit = async (e) => {
    e?.preventDefault();
    if (!incomeAmount || !incomeSource || !incomeEmotion) return;

    setIsIncomeSubmitting(true);
    
    const incomeData = {
      id: Date.now(),
      amount: parseFloat(incomeAmount),
      source: incomeSource,
      description: incomeDescription,
      emotion: incomeEmotion,
      timestamp: new Date(),
      culturalContext
    };

    try {
      await onAddIncome(incomeData);
      
      // Reset form
      setIncomeAmount('');
      setIncomeSource('');
      setIncomeDescription('');
      setIncomeEmotion('');
    } catch (error) {
      console.error('Error adding income:', error);
    } finally {
      setIsIncomeSubmitting(false);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e?.preventDefault();
    if (!expenseAmount || !expenseCategory || !expenseEmotion) return;

    setIsExpenseSubmitting(true);
    
    const expenseData = {
      id: Date.now(),
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      description: expenseDescription,
      emotion: expenseEmotion,
      timestamp: new Date(),
      culturalContext
    };

    try {
      await onAddExpense(expenseData);
      
      // Reset form
      setExpenseAmount('');
      setExpenseCategory('');
      setExpenseDescription('');
      setExpenseEmotion('');
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsExpenseSubmitting(false);
    }
  };

  const resetAllForms = () => {
    setIncomeAmount('');
    setIncomeSource('');
    setIncomeDescription('');
    setIncomeEmotion('');
    setExpenseAmount('');
    setExpenseCategory('');
    setExpenseDescription('');
    setExpenseEmotion('');
  };

  const incomeSourceOptions = getIncomeSourceOptions();
  const expenseCategoryOptions = getExpenseCategoryOptions();
  const emotionOptions = getEmotionOptions();

  return (
    <div className={`bg-card rounded-xl border shadow-soft p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Icon name="Plus" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-lg font-heading text-foreground">
              {culturalContext === 'hindi' ? 'वित्तीय प्रविष्टि' : 'Financial Entry'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' ? 'अपनी आय और खर्च को ट्रैक करें' : 'Track your income and expenses'}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted/30 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'income'
              ? 'bg-green-500 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="TrendingUp" size={16} />
            <span>{culturalContext === 'hindi' ? 'आय' : 'Income'}</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('expense')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'expense'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="TrendingDown" size={16} />
            <span>{culturalContext === 'hindi' ? 'खर्च' : 'Expense'}</span>
          </div>
        </button>
      </div>

      {/* Income Form */}
      {activeTab === 'income' && (
        <form onSubmit={handleIncomeSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label={culturalContext === 'hindi' ? 'राशि (₹)' : 'Amount (₹)'}
                type="text"
                value={incomeAmount ? `₹${formatIndianNumber(incomeAmount)}` : ''}
                onChange={(e) => handleAmountChange(e, 'income')}
                placeholder={culturalContext === 'hindi' ? '₹50,000' : '₹50,000'}
                required
                className="text-lg font-medium"
              />
            </div>

            <Select
              label={culturalContext === 'hindi' ? 'स्रोत' : 'Source'}
              options={incomeSourceOptions}
              value={incomeSource}
              onChange={setIncomeSource}
              placeholder={culturalContext === 'hindi' ? 'स्रोत चुनें' : 'Select source'}
              required
              searchable
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={culturalContext === 'hindi' ? 'आपकी भावना' : 'Your Emotion'}
              options={emotionOptions}
              value={incomeEmotion}
              onChange={setIncomeEmotion}
              placeholder={culturalContext === 'hindi' ? 'भावना चुनें' : 'Select emotion'}
              required
            />

            <Input
              label={culturalContext === 'hindi' ? 'विवरण (वैकल्पिक)' : 'Description (Optional)'}
              type="text"
              value={incomeDescription}
              onChange={(e) => setIncomeDescription(e?.target?.value)}
              placeholder={culturalContext === 'hindi' ? 'आय का विवरण...' : 'Income description...'}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              variant="default"
              loading={isIncomeSubmitting}
              disabled={!incomeAmount || !incomeSource || !incomeEmotion}
              iconName="TrendingUp"
              iconPosition="left"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isIncomeSubmitting 
                ? (culturalContext === 'hindi' ? 'जोड़ा जा रहा है...' : 'Adding...')
                : (culturalContext === 'hindi' ? 'आय जोड़ें' : 'Add Income')
              }
            </Button>
          </div>
        </form>
      )}

      {/* Expense Form */}
      {activeTab === 'expense' && (
        <form onSubmit={handleExpenseSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label={culturalContext === 'hindi' ? 'राशि (₹)' : 'Amount (₹)'}
                type="text"
                value={expenseAmount ? `₹${formatIndianNumber(expenseAmount)}` : ''}
                onChange={(e) => handleAmountChange(e, 'expense')}
                placeholder={culturalContext === 'hindi' ? '₹1,00,000' : '₹1,00,000'}
                required
                className="text-lg font-medium"
              />
            </div>

            <Select
              label={culturalContext === 'hindi' ? 'श्रेणी' : 'Category'}
              options={expenseCategoryOptions}
              value={expenseCategory}
              onChange={setExpenseCategory}
              placeholder={culturalContext === 'hindi' ? 'श्रेणी चुनें' : 'Select category'}
              required
              searchable
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={culturalContext === 'hindi' ? 'आपकी भावना' : 'Your Emotion'}
              options={emotionOptions}
              value={expenseEmotion}
              onChange={setExpenseEmotion}
              placeholder={culturalContext === 'hindi' ? 'भावना चुनें' : 'Select emotion'}
              required
            />

            <Input
              label={culturalContext === 'hindi' ? 'विवरण (वैकल्पिक)' : 'Description (Optional)'}
              type="text"
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e?.target?.value)}
              placeholder={culturalContext === 'hindi' ? 'खर्च का विवरण...' : 'Expense description...'}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              variant="default"
              loading={isExpenseSubmitting}
              disabled={!expenseAmount || !expenseCategory || !expenseEmotion}
              iconName="TrendingDown"
              iconPosition="left"
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isExpenseSubmitting 
                ? (culturalContext === 'hindi' ? 'जोड़ा जा रहा है...' : 'Adding...')
                : (culturalContext === 'hindi' ? 'खर्च जोड़ें' : 'Add Expense')
              }
            </Button>
          </div>
        </form>
      )}

      {/* Reset All Button */}
      <div className="mt-4 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={resetAllForms}
          iconName="RotateCcw"
          iconPosition="left"
          className="w-full"
        >
          {culturalContext === 'hindi' ? 'सभी रीसेट करें' : 'Reset All'}
        </Button>
      </div>
    </div>
  );
};

export default UnifiedFinancialEntry;
