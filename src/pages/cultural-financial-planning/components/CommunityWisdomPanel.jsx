import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CommunityWisdomPanel = ({ 
  culturalContext = 'default',
  userRegion = 'north-indian',
  className = '',
}) => {
  const STORAGE_KEY = "community_posts";

  const [activeTab, setActiveTab] = useState('wisdom');
  const [showTipForm, setShowTipForm] = useState(false);
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save posts persistently
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const handleAddPost = (newPost) => {
    setPosts((prev) => [
      {
        id: Date.now(),
        ...newPost,
        category: activeTab, // 🔑 save in current tab category
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: new Date().toLocaleString(),
      },
      ...prev, // newest first
    ]);
  };

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const getTabs = () => {
    if (culturalContext === 'hindi') {
      return [
        { id: 'wisdom', label: 'ज्ञान', icon: 'BookOpen' },
        { id: 'community', label: 'समुदाय', icon: 'Users' },
        { id: 'success', label: 'सफलता', icon: 'Trophy' },
        { id: 'support', label: 'सहायता', icon: 'Heart' }
      ];
    }
    return [
      { id: 'wisdom', label: 'Wisdom', icon: 'BookOpen' },
      { id: 'community', label: 'Community', icon: 'Users' },
      { id: 'success', label: 'Success', icon: 'Trophy' },
      { id: 'support', label: 'Support', icon: 'Heart' }
    ];
  };

  // Sample default posts categorized
  const defaultPosts = [
    {
      id: 'sample1',
      category: 'wisdom',
      author: culturalContext === 'hindi' ? 'राजेश शर्मा' : 'Rajesh Sharma',
      title: culturalContext === 'hindi'
        ? 'दिवाली की खरीदारी के लिए स्मार्ट बजटिंग'
        : 'Smart Budgeting for Diwali Shopping',
      content: culturalContext === 'hindi'
        ? 'दिवाली से 3 महीने पहले से ही अलग खाते में पैसे जमा करना शुरू कर देता हूं।'
        : 'I start saving in a separate account before Diwali to avoid stress.',
      tags: ['diwali', 'budgeting'],
      likes: 12, comments: 3, shares: 1,
      timestamp: 'Sep 15, 2025'
    },
    {
      id: 'sample2',
      category: 'success',
      author: 'Meena Patel',
      title: 'Saved ₹5000 this Navratri 🎉',
      content: 'By planning outfits early, I cut costs and still enjoyed fully!',
      tags: ['navratri', 'success'],
      likes: 7, comments: 2, shares: 0,
      timestamp: 'Sep 20, 2025'
    },
    {
      id: 'sample3',
      category: 'community',
      author: 'Amit Verma',
      title: 'Let’s share food hacks 🍲',
      content: 'During Holi, I buy dry fruits in bulk with neighbors to save 20%.',
      tags: ['holi', 'food', 'community'],
      likes: 5, comments: 1, shares: 0,
      timestamp: 'Sep 10, 2025'
    },
    {
      id: 'sample4',
      category: 'support',
      author: 'Priya Nair',
      title: 'Struggling with festive pressure?',
      content: 'It’s okay to keep celebrations small. Emotional balance matters most ❤️',
      tags: ['mentalhealth', 'festivals'],
      likes: 9, comments: 4, shares: 2,
      timestamp: 'Sep 5, 2025'
    }
  ];

  const allPosts = [...posts, ...defaultPosts];
  const filteredPosts = allPosts.filter((p) => p.category === activeTab);

  const renderPosts = () => (
    <div className="space-y-4">
      {filteredPosts.map((post) => (
        <div key={post.id} className="glass-card rounded-lg p-4">
          <h3 className="text-base font-medium mb-2">{post.title}</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{post.content}</p>
          <div className="flex flex-wrap gap-1 my-2">
            {post.tags?.map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border/20">
            <div className="flex items-center space-x-4">
              <button
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary"
                onClick={() => handleLike(post.id)}
              >
                <Icon name="Heart" size={16} />
                <span className="text-sm">{post.likes}</span>
              </button>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Icon name="MessageCircle" size={16} />
                <span className="text-sm">{post.comments}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Icon name="Share" size={16} />
                <span className="text-sm">{post.shares}</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{post.author} • {post.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`glass-card rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading">
            {culturalContext === 'hindi' ? 'सामुदायिक ज्ञान' : 'Community Wisdom'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {culturalContext === 'hindi' 
              ? 'समुदाय से सीखें और अपना अनुभव साझा करें' 
              : 'Learn from community and share your experience'}
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          onClick={() => setShowTipForm(true)}
        >
          {culturalContext === 'hindi' ? 'पोस्ट करें' : 'Create Post'}
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted/30 rounded-lg p-1">
        {getTabs().map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md flex-1 justify-center
              ${activeTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'}
            `}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderPosts()}
      </div>

      {/* Add Post Modal */}
      {showTipForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading">
                {culturalContext === 'hindi' ? 'नई पोस्ट जोड़ें' : 'Add New Post'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTipForm(false)}
                iconName="X"
              />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newPost = {
                  author: formData.get("author") || "Anonymous",
                  title: formData.get("title"),
                  content: formData.get("content"),
                  tags: formData.get("tags")?.split(",").map(t => t.trim()) || [],
                };
                handleAddPost(newPost);
                setShowTipForm(false);
              }}
              className="space-y-4"
            >
              <input
                name="author"
                placeholder={culturalContext === 'hindi' ? 'आपका नाम' : 'Your Name'}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                name="title"
                placeholder={culturalContext === 'hindi' ? 'शीर्षक' : 'Title'}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <textarea
                name="content"
                placeholder={culturalContext === 'hindi' ? 'आपका संदेश...' : 'Your Message...'}
                className="w-full px-3 py-2 border rounded-lg h-24 resize-none"
                required
              />
              <input
                name="tags"
                placeholder={culturalContext === 'hindi' ? 'टैग (कॉमा से अलग)' : 'Tags (comma separated)'}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  type="button"
                  onClick={() => setShowTipForm(false)}
                >
                  {culturalContext === 'hindi' ? 'रद्द करें' : 'Cancel'}
                </Button>
                <Button className="flex-1" type="submit">
                  {culturalContext === 'hindi' ? 'पोस्ट करें' : 'Post'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityWisdomPanel;
