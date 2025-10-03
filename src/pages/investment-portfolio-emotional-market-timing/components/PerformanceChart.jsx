import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceChart = ({ 
  emotionalState = 'calm',
  culturalContext = 'default',
  className = '' 
}) => {
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('1M');
  const [chartType, setChartType] = useState('portfolio');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateChartData();
  }, [timeRange, chartType]);

  const generateChartData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const dataPoints = timeRange === '1D' ? 24 : timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : 365;
      const data = [];
      
      let baseValue = 1000000; // 10 Lakh base portfolio value
      let baseEmotion = 70; // Base emotional score
      
      for (let i = 0; i < dataPoints; i++) {
        const date = new Date();
        if (timeRange === '1D') {
          date?.setHours(date?.getHours() - (dataPoints - i));
        } else {
          date?.setDate(date?.getDate() - (dataPoints - i));
        }
        
        // Simulate portfolio performance with some volatility
        const volatility = Math.random() * 0.04 - 0.02; // -2% to +2%
        baseValue = baseValue * (1 + volatility);
        
        // Simulate emotional score with correlation to performance
        const performanceImpact = volatility * 500; // Emotional impact from performance
        baseEmotion = Math.max(20, Math.min(100, baseEmotion + performanceImpact + (Math.random() * 10 - 5)));
        
        // Add market events simulation
        if (i === Math.floor(dataPoints * 0.3)) {
          baseValue *= 0.95; // Market correction
          baseEmotion -= 15;
        }
        if (i === Math.floor(dataPoints * 0.7)) {
          baseValue *= 1.08; // Market rally
          baseEmotion += 10;
        }
        
        data?.push({
          date: date?.toISOString()?.split('T')?.[0],
          time: date?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          portfolioValue: Math.round(baseValue),
          emotionalScore: Math.round(baseEmotion),
          gainLoss: Math.round(baseValue - 1000000),
          gainLossPercent: ((baseValue - 1000000) / 1000000 * 100)?.toFixed(2)
        });
      }
      
      setChartData(data);
      setIsLoading(false);
    }, 1000);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatTooltipValue = (value, name) => {
    if (name === 'portfolioValue') {
      return [formatCurrency(value), culturalContext === 'hindi' ? 'पोर्टफोलियो मूल्य' : 'Portfolio Value'];
    }
    if (name === 'emotionalScore') {
      return [`${value}%`, culturalContext === 'hindi' ? 'भावनात्मक स्कोर' : 'Emotional Score'];
    }
    return [value, name];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass-card rounded-lg p-3 shadow-soft border">
          <p className="text-sm font-medium text-foreground mb-2">
            {timeRange === '1D' ? label : new Date(label)?.toLocaleDateString('en-IN')}
          </p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {formatTooltipValue(entry?.value, entry?.dataKey)?.[1]}: {formatTooltipValue(entry?.value, entry?.dataKey)?.[0]}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const timeRanges = [
    { value: '1D', label: culturalContext === 'hindi' ? '1 दिन' : '1D' },
    { value: '1W', label: culturalContext === 'hindi' ? '1 सप्ताह' : '1W' },
    { value: '1M', label: culturalContext === 'hindi' ? '1 महीना' : '1M' },
    { value: '3M', label: culturalContext === 'hindi' ? '3 महीने' : '3M' },
    { value: '1Y', label: culturalContext === 'hindi' ? '1 साल' : '1Y' }
  ];

  const chartTypes = [
    { value: 'portfolio', label: culturalContext === 'hindi' ? 'पोर्टफोलियो' : 'Portfolio', icon: 'TrendingUp' },
    { value: 'emotional', label: culturalContext === 'hindi' ? 'भावनात्मक' : 'Emotional', icon: 'Brain' },
    { value: 'combined', label: culturalContext === 'hindi' ? 'संयुक्त' : 'Combined', icon: 'BarChart3' }
  ];

  if (isLoading) {
    return (
      <div className={`glass-card rounded-xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-lg font-heading text-foreground mb-4 sm:mb-0">
          {culturalContext === 'hindi' ? 'प्रदर्शन विश्लेषण' : 'Performance Analysis'}
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Chart Type Selector */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {chartTypes?.map((type) => (
              <Button
                key={type?.value}
                variant={chartType === type?.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType(type?.value)}
                iconName={type?.icon}
                iconPosition="left"
                iconSize={14}
                className="rounded-none border-0"
              >
                <span className="hidden sm:inline">{type?.label}</span>
              </Button>
            ))}
          </div>
          
          {/* Time Range Selector */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {timeRanges?.map((range) => (
              <Button
                key={range?.value}
                variant={timeRange === range?.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range?.value)}
                className="rounded-none border-0 px-3"
              >
                {range?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Chart */}
      <div className="h-80 w-full" aria-label="Investment Performance Chart">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'portfolio' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey={timeRange === '1D' ? 'time' : 'date'} 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `₹${(value / 100000)?.toFixed(1)}L`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="portfolioValue"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#portfolioGradient)"
              />
            </AreaChart>
          ) : chartType === 'emotional' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey={timeRange === '1D' ? 'time' : 'date'} 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="emotionalScore"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-secondary)', strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey={timeRange === '1D' ? 'time' : 'date'} 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                yAxisId="portfolio"
                stroke="var(--color-primary)"
                fontSize={12}
                tickFormatter={(value) => `₹${(value / 100000)?.toFixed(1)}L`}
              />
              <YAxis 
                yAxisId="emotion"
                orientation="right"
                stroke="var(--color-secondary)"
                fontSize={12}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="portfolio"
                type="monotone"
                dataKey="portfolioValue"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="emotion"
                type="monotone"
                dataKey="emotionalScore"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Chart Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-muted-foreground">
              {culturalContext === 'hindi' ? 'सर्वोच्च मूल्य' : 'Peak Value'}
            </span>
          </div>
          <div className="text-lg font-bold text-foreground">
            {formatCurrency(Math.max(...chartData?.map(d => d?.portfolioValue)))}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Brain" size={16} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {culturalContext === 'hindi' ? 'औसत भावनात्मक स्कोर' : 'Avg Emotional Score'}
            </span>
          </div>
          <div className="text-lg font-bold text-foreground">
            {Math.round(chartData?.reduce((sum, d) => sum + d?.emotionalScore, 0) / chartData?.length)}%
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Activity" size={16} className="text-warning" />
            <span className="text-sm font-medium text-muted-foreground">
              {culturalContext === 'hindi' ? 'अस्थिरता' : 'Volatility'}
            </span>
          </div>
          <div className="text-lg font-bold text-foreground">
            {(Math.max(...chartData?.map(d => d?.portfolioValue)) - Math.min(...chartData?.map(d => d?.portfolioValue))) / Math.min(...chartData?.map(d => d?.portfolioValue)) * 100 > 0 ? '+' : ''}
            {((Math.max(...chartData?.map(d => d?.portfolioValue)) - Math.min(...chartData?.map(d => d?.portfolioValue))) / Math.min(...chartData?.map(d => d?.portfolioValue)) * 100)?.toFixed(1)}%
          </div>
        </div>
      </div>
      {/* Correlation Insight */}
      <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Lightbulb" size={16} className="text-primary" />
          <span className="text-sm font-medium text-primary">
            {culturalContext === 'hindi' ? 'अंतर्दृष्टि' : 'Insight'}
          </span>
        </div>
        <p className="text-sm text-primary/80">
          {culturalContext === 'hindi' ?'आपके भावनात्मक स्कोर और पोर्टफोलियो प्रदर्शन के बीच मजबूत संबंध दिखाई दे रहा है। तनाव के समय में निवेश निर्णय लेने से बचें।' :'Strong correlation observed between your emotional score and portfolio performance. Avoid making investment decisions during high stress periods.'
          }
        </p>
      </div>
    </div>
  );
};

export default PerformanceChart;