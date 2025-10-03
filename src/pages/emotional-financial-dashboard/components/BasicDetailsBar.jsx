import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BasicDetailsBar = ({
  culturalContext = 'default',
  defaultValues = {},
  onSave,
  className = ''
}) => {
  const [form, setForm] = useState({
    name: defaultValues?.name || '',
    salary: defaultValues?.salary || '',
    monthlyExpenses: defaultValues?.monthlyExpenses || '',
    riskTolerance: defaultValues?.riskTolerance || 'moderate'
  });
  const [saving, setSaving] = useState(false);

  const riskOptions = [
    { value: 'conservative', label: culturalContext === 'hindi' ? 'रूढ़िवादी' : 'Conservative' },
    { value: 'moderate', label: culturalContext === 'hindi' ? 'मध्यम' : 'Moderate' },
    { value: 'aggressive', label: culturalContext === 'hindi' ? 'आक्रामक' : 'Aggressive' }
  ];

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form?.name?.trim() || Number(form?.salary) <= 0 || Number(form?.monthlyExpenses) <= 0) {
      alert(culturalContext === 'hindi' ? 'कृपया नाम, वेतन और खर्च दर्ज करें' : 'Please enter name, salary and monthly expenses');
      return;
    }
    setSaving(true);
    try {
      await onSave?.({
        name: form.name.trim(),
        salary: Number(form.salary),
        monthlyExpenses: Number(form.monthlyExpenses),
        riskTolerance: form.riskTolerance
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`glass-card rounded-xl p-4 border border-border/30 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-end gap-3">
        <div className="md:w-48">
          <Input
            label={culturalContext === 'hindi' ? 'नाम' : 'Name'}
            value={form.name}
            onChange={(e) => handleChange('name', e?.target?.value)}
            placeholder={culturalContext === 'hindi' ? 'अपना नाम' : 'Your name'}
          />
        </div>
        <div className="md:w-48">
          <Input
            label={culturalContext === 'hindi' ? 'मासिक वेतन (₹)' : 'Monthly Salary (₹)'}
            type="number"
            value={form.salary}
            onChange={(e) => handleChange('salary', e?.target?.value)}
            placeholder="50000"
          />
        </div>
        <div className="md:w-56">
          <Input
            label={culturalContext === 'hindi' ? 'मासिक खर्च (₹)' : 'Monthly Expenses (₹)'}
            type="number"
            value={form.monthlyExpenses}
            onChange={(e) => handleChange('monthlyExpenses', e?.target?.value)}
            placeholder="30000"
          />
        </div>
        <div className="md:w-48">
          <Select
            label={culturalContext === 'hindi' ? 'जोखिम सहनशीलता' : 'Risk Tolerance'}
            value={form.riskTolerance}
            onChange={(value) => handleChange('riskTolerance', value)}
            options={riskOptions}
          />
        </div>
        <div className="md:w-auto">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (culturalContext === 'hindi' ? 'सहेजा जा रहा है...' : 'Saving...') : (culturalContext === 'hindi' ? 'जल्दी सहेजें' : 'Quick Save')}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {culturalContext === 'hindi'
          ? 'ये मूल विवरण तुरंत डैशबोर्ड में लागू होंगे। आप बाद में और अपडेट कर सकते हैं।'
          : 'These basics apply instantly across the dashboard. You can refine later.'}
      </p>
    </div>
  );
};

export default BasicDetailsBar;


