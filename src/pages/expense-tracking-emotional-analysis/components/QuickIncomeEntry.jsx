import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickIncomeEntry = ({ 
  onAddIncome, 
  culturalContext = 'default',
  emotionalState = 'calm',
  className = '' 
}) => {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSourceOptions = () => {
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

  const handleAmountChange = (e) => {
    const value = e?.target?.value?.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!amount || !source || !selectedEmotion) return;

    setIsSubmitting(true);
    
    const incomeData = {
      id: Date.now(),
      amount: parseFloat(amount),
      source,
      description,
      emotion: selectedEmotion,
      timestamp: new Date(),
      culturalContext
    };

    try {
      await onAddIncome(incomeData);
      
      // Reset form
      setAmount('');
      setSource('');
      setDescription('');
      setSelectedEmotion('');
    } catch (error) {
      console.error('Error adding income:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sourceOptions = getSourceOptions();
  const emotionOptions = getEmotionOptions();

  return (
    <div className={`bg-card rounded-xl border shadow-soft p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-lg font-heading text-foreground">
              {culturalContext === 'hindi' ? 'त्वरित आय जोड़ें' : 'Quick Income Entry'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' ? 'अपनी भावनाओं के साथ आय ट्रैक करें' : 'Track income with your emotions'}
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Input
              label={culturalContext === 'hindi' ? 'राशि (₹)' : 'Amount (₹)'}
              type="text"
              value={amount ? `₹${formatIndianNumber(amount)}` : ''}
              onChange={handleAmountChange}
              placeholder={culturalContext === 'hindi' ? '₹50,000' : '₹50,000'}
              required
              className="text-lg font-medium"
            />
            {amount && (
              <div className="absolute right-3 top-9 text-sm text-muted-foreground">
                {culturalContext === 'hindi' ? 'रुपये' : 'Rupees'}
              </div>
            )}
          </div>

          <Select
            label={culturalContext === 'hindi' ? 'स्रोत' : 'Source'}
            options={sourceOptions}
            value={source}
            onChange={setSource}
            placeholder={culturalContext === 'hindi' ? 'स्रोत चुनें' : 'Select source'}
            required
            searchable
          />
        </div>

        {/* Emotion and Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label={culturalContext === 'hindi' ? 'आपकी भावना' : 'Your Emotion'}
            options={emotionOptions}
            value={selectedEmotion}
            onChange={setSelectedEmotion}
            placeholder={culturalContext === 'hindi' ? 'भावना चुनें' : 'Select emotion'}
            required
          />

          <Input
            label={culturalContext === 'hindi' ? 'विवरण (वैकल्पिक)' : 'Description (Optional)'}
            type="text"
            value={description}
            onChange={(e) => setDescription(e?.target?.value)}
            placeholder={culturalContext === 'hindi' ? 'आय का विवरण...' : 'Income description...'}
          />
        </div>

        {/* Emotional Context Indicator */}
        {selectedEmotion && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {emotionOptions?.find(e => e?.value === selectedEmotion)?.label?.split(' ')?.[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {culturalContext === 'hindi' ? 'भावनात्मक संदर्भ' : 'Emotional Context'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {emotionOptions?.find(e => e?.value === selectedEmotion)?.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex space-x-3">
          <Button
            type="submit"
            variant="default"
            loading={isSubmitting}
            disabled={!amount || !source || !selectedEmotion}
            iconName="TrendingUp"
            iconPosition="left"
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting 
              ? (culturalContext === 'hindi' ? 'जोड़ा जा रहा है...' : 'Adding...')
              : (culturalContext === 'hindi' ? 'आय जोड़ें' : 'Add Income')
            }
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setAmount('');
              setSource('');
              setDescription('');
              setSelectedEmotion('');
            }}
            iconName="RotateCcw"
            iconPosition="left"
          >
            {culturalContext === 'hindi' ? 'रीसेट' : 'Reset'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuickIncomeEntry;
