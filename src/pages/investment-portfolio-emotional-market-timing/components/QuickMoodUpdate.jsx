import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickMoodUpdate = ({ currentMood, culturalContext, onUpdate, onClose }) => {
  const [moodData, setMoodData] = useState({
    mood: currentMood?.currentMood || 5,
    stress: currentMood?.stressLevel || 5,
    confidence: currentMood?.investmentConfidence || 5
  });

  const handleSubmit = () => {
    onUpdate(moodData);
  };

  const getMoodEmoji = (value) => {
    if (value >= 9) return '😊';
    if (value >= 7) return '🙂';
    if (value >= 5) return '😐';
    if (value >= 3) return '😔';
    return '😟';
  };

  const getStressColor = (value) => {
    if (value <= 3) return 'text-green-600';
    if (value <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceColor = (value) => {
    if (value >= 7) return 'text-green-600';
    if (value >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading text-foreground">
            {culturalContext === 'hindi' ? 'मूड अपडेट' : 'Mood Update'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>

        <div className="space-y-6">
          {/* Current Mood */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">
                {culturalContext === 'hindi' ? 'वर्तमान मूड' : 'Current Mood'}
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getMoodEmoji(moodData.mood)}</span>
                <span className="text-sm font-medium">{moodData.mood}/10</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={moodData.mood}
              onChange={(e) => setMoodData(prev => ({ ...prev, mood: Number(e.target.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{culturalContext === 'hindi' ? 'बहुत उदास' : 'Very Sad'}</span>
              <span>{culturalContext === 'hindi' ? 'बहुत खुश' : 'Very Happy'}</span>
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">
                {culturalContext === 'hindi' ? 'तनाव स्तर' : 'Stress Level'}
              </label>
              <span className={`text-sm font-medium ${getStressColor(moodData.stress)}`}>
                {moodData.stress}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={moodData.stress}
              onChange={(e) => setMoodData(prev => ({ ...prev, stress: Number(e.target.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{culturalContext === 'hindi' ? 'बहुत शांत' : 'Very Calm'}</span>
              <span>{culturalContext === 'hindi' ? 'बहुत तनावग्रस्त' : 'Very Stressed'}</span>
            </div>
          </div>

          {/* Investment Confidence */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">
                {culturalContext === 'hindi' ? 'निवेश आत्मविश्वास' : 'Investment Confidence'}
              </label>
              <span className={`text-sm font-medium ${getConfidenceColor(moodData.confidence)}`}>
                {moodData.confidence}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={moodData.confidence}
              onChange={(e) => setMoodData(prev => ({ ...prev, confidence: Number(e.target.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{culturalContext === 'hindi' ? 'बिल्कुल आत्मविश्वास नहीं' : 'Not Confident'}</span>
              <span>{culturalContext === 'hindi' ? 'बहुत आत्मविश्वास' : 'Very Confident'}</span>
            </div>
          </div>

          {/* Mood Insights */}
          <div className="p-4 bg-primary/10 rounded-lg">
            <h4 className="text-sm font-medium text-primary mb-2">
              {culturalContext === 'hindi' ? 'मूड इनसाइट' : 'Mood Insights'}
            </h4>
            <p className="text-sm text-primary/80">
              {moodData.mood >= 7 && moodData.stress <= 4 && moodData.confidence >= 6
                ? (culturalContext === 'hindi' 
                    ? 'आपकी भावनात्मक स्थिति निवेश के लिए अच्छी है।'
                    : 'Your emotional state is good for investing.')
                : moodData.stress >= 7 || moodData.mood <= 3
                ? (culturalContext === 'hindi' 
                    ? 'उच्च तनाव के कारण निवेश निर्णय से बचें।'
                    : 'Avoid investment decisions due to high stress.')
                : (culturalContext === 'hindi' 
                    ? 'सावधानी से निवेश निर्णय लें।'
                    : 'Make investment decisions carefully.')
              }
            </p>
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
          >
            {culturalContext === 'hindi' ? 'अपडेट करें' : 'Update'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickMoodUpdate;
