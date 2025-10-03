import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickExpenseEntry = ({ 
  onAddExpense, 
  culturalContext = 'default',
  emotionalState = 'calm',
  className = '' 
}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCategoryOptions = () => {
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
        { value: 'stressed', label: '😰 तनावग्रस्त', description: 'चिंता और तनाव' },
        { value: 'excited', label: '🤩 उत्साहित', description: 'उत्साह और जोश' },
        { value: 'sad', label: '😢 उदास', description: 'दुख और निराशा' },
        { value: 'angry', label: '😠 गुस्सा', description: 'क्रोध और चिड़चिड़ाहट' },
        { value: 'calm', label: '😌 शांत', description: 'शांति और संयम' },
        { value: 'anxious', label: '😟 चिंतित', description: 'चिंता और बेचैनी' },
        { value: 'guilty', label: '😔 अपराधबोध', description: 'पछतावा और अपराधबोध' }
      ];
    }
    return [
      { value: 'happy', label: '😊 Happy', description: 'Joy and satisfaction' },
      { value: 'stressed', label: '😰 Stressed', description: 'Anxiety and tension' },
      { value: 'excited', label: '🤩 Excited', description: 'Enthusiasm and thrill' },
      { value: 'sad', label: '😢 Sad', description: 'Sadness and disappointment' },
      { value: 'angry', label: '😠 Angry', description: 'Anger and irritation' },
      { value: 'calm', label: '😌 Calm', description: 'Peace and composure' },
      { value: 'anxious', label: '😟 Anxious', description: 'Worry and restlessness' },
      { value: 'guilty', label: '😔 Guilty', description: 'Regret and guilt' }
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

  const handleVoiceRecording = () => {
    if (!isVoiceRecording) {
      setIsVoiceRecording(true);
      // Simulate voice recording
      setTimeout(() => {
        setIsVoiceRecording(false);
        setVoiceNote(culturalContext === 'hindi' ?'आवाज़ नोट रिकॉर्ड किया गया' :'Voice note recorded'
        );
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!amount || !category || !selectedEmotion) return;

    setIsSubmitting(true);
    
    const expenseData = {
      id: Date.now(),
      amount: parseFloat(amount),
      category,
      description,
      emotion: selectedEmotion,
      voiceNote,
      timestamp: new Date(),
      culturalContext
    };

    try {
      await onAddExpense(expenseData);
      
      // Reset form
      setAmount('');
      setCategory('');
      setDescription('');
      setSelectedEmotion('');
      setVoiceNote('');
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = getCategoryOptions();
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
              {culturalContext === 'hindi' ? 'त्वरित खर्च जोड़ें' : 'Quick Expense Entry'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' ?'अपनी भावनाओं के साथ खर्च ट्रैक करें' :'Track expenses with your emotions'
              }
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleVoiceRecording}
          disabled={isVoiceRecording}
          iconName={isVoiceRecording ? "MicIcon" : "Mic"}
          iconPosition="left"
          className={isVoiceRecording ? "voice-active" : ""}
        >
          {isVoiceRecording 
            ? (culturalContext === 'hindi' ? 'रिकॉर्डिंग...' : 'Recording...')
            : (culturalContext === 'hindi' ? 'आवाज़' : 'Voice')
          }
        </Button>
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
              placeholder={culturalContext === 'hindi' ? '₹1,00,000' : '₹1,00,000'}
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
            label={culturalContext === 'hindi' ? 'श्रेणी' : 'Category'}
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            placeholder={culturalContext === 'hindi' ? 'श्रेणी चुनें' : 'Select category'}
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
            placeholder={culturalContext === 'hindi' ?'खर्च का विवरण...' :'Expense description...'
            }
          />
        </div>

        {/* Voice Note Display */}
        {voiceNote && (
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2">
              <Icon name="Mic" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                {culturalContext === 'hindi' ? 'आवाज़ नोट:' : 'Voice Note:'}
              </span>
            </div>
            <p className="text-sm text-primary/80 mt-1">{voiceNote}</p>
          </div>
        )}

        {/* Emotional Context Indicator */}
        {selectedEmotion && (
          <div className="p-4 bg-muted/30 rounded-lg">
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
            disabled={!amount || !category || !selectedEmotion}
            iconName="Plus"
            iconPosition="left"
            className="flex-1"
          >
            {isSubmitting 
              ? (culturalContext === 'hindi' ? 'जोड़ा जा रहा है...' : 'Adding...')
              : (culturalContext === 'hindi' ? 'खर्च जोड़ें' : 'Add Expense')
            }
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setAmount('');
              setCategory('');
              setDescription('');
              setSelectedEmotion('');
              setVoiceNote('');
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

export default QuickExpenseEntry;