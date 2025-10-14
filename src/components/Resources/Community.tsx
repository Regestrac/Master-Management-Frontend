import { useState, useEffect } from 'react';

import {
  Users,
  MessageSquare,
  TrendingUp,
  ThumbsUp,
  MessageCircle,
  Search,
  Plus,
  Star,
  Eye,
  User,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useSettingsStore } from 'stores/settingsStore';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: 'admin' | 'moderator' | 'member';
  };
  category: string;
  tags: string[];
  createdAt: string;
  replies: number;
  likes: number;
  views: number;
  isSticky?: boolean;
  isSolved?: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  postCount: number;
  color: string;
}

const Community = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const categories: Category[] = [
    {
      id: 'all',
      name: 'All Posts',
      description: 'View all community discussions',
      postCount: 156,
      color: 'bg-purple-500',
    },
    {
      id: 'general',
      name: 'General Discussion',
      description: 'General topics and conversations',
      postCount: 45,
      color: 'bg-blue-500',
    },
    {
      id: 'help',
      name: 'Help & Support',
      description: 'Get help with using the platform',
      postCount: 32,
      color: 'bg-green-500',
    },
    {
      id: 'features',
      name: 'Feature Requests',
      description: 'Suggest new features and improvements',
      postCount: 28,
      color: 'bg-orange-500',
    },
    {
      id: 'tips',
      name: 'Tips & Tricks',
      description: 'Share productivity tips and best practices',
      postCount: 41,
      color: 'bg-pink-500',
    },
    {
      id: 'announcements',
      name: 'Announcements',
      description: 'Official updates and news',
      postCount: 10,
      color: 'bg-red-500',
    },
  ];

  const forumPosts: ForumPost[] = [
    {
      id: '1',
      title: 'Welcome to the Master Management Community!',
      content: 'We\'re excited to launch our community forum where users can connect, share tips, and help each other succeed with productivity management.',
      author: {
        name: 'Admin Team',
        avatar: '👨‍💼',
        role: 'admin',
      },
      category: 'announcements',
      tags: ['welcome', 'community', 'announcement'],
      createdAt: '2024-10-08T10:00:00Z',
      replies: 24,
      likes: 89,
      views: 342,
      isSticky: true,
    },
    {
      id: '2',
      title: 'How to maximize productivity with focus sessions?',
      content: 'I\'ve been using the focus sessions feature for a month now, and I\'d love to share some tips that have really helped me stay productive...',
      author: {
        name: 'Sarah Johnson',
        avatar: '👩‍💻',
        role: 'member',
      },
      category: 'tips',
      tags: ['focus', 'productivity', 'tips'],
      createdAt: '2024-10-07T15:30:00Z',
      replies: 12,
      likes: 45,
      views: 156,
    },
    {
      id: '3',
      title: 'Calendar sync not working with Google Calendar',
      content: 'I\'m having trouble syncing my tasks with Google Calendar. The integration was working fine last week, but now it seems to have stopped...',
      author: {
        name: 'Mike Chen',
        avatar: '👨‍🔧',
        role: 'member',
      },
      category: 'help',
      tags: ['calendar', 'sync', 'google', 'bug'],
      createdAt: '2024-10-07T09:15:00Z',
      replies: 8,
      likes: 12,
      views: 89,
      isSolved: true,
    },
    {
      id: '4',
      title: 'Feature Request: Dark mode for mobile app',
      content: 'Would love to see dark mode support for the mobile version of the app. The web version looks great in dark mode!',
      author: {
        name: 'Alex Rivera',
        avatar: '🌙',
        role: 'member',
      },
      category: 'features',
      tags: ['mobile', 'dark-mode', 'ui'],
      createdAt: '2024-10-06T20:45:00Z',
      replies: 15,
      likes: 67,
      views: 203,
    },
    {
      id: '5',
      title: 'Best practices for goal setting and tracking',
      content: 'After using the platform for 6 months, here are my top recommendations for setting up effective goals and tracking progress...',
      author: {
        name: 'Emma Wilson',
        avatar: '🎯',
        role: 'moderator',
      },
      category: 'tips',
      tags: ['goals', 'tracking', 'best-practices'],
      createdAt: '2024-10-06T14:20:00Z',
      replies: 19,
      likes: 78,
      views: 234,
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'moderator': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || 'bg-gray-500';
  };

  const filteredPosts = forumPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.likes - a.likes;
      case 'trending':
        return b.views - a.views;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} sm:ml-70 border-b shadow-sm fixed top-0 left-0 right-0 z-50`}>
        <div className='max-w-4xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={handleBack}
                className={`flex items-center space-x-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                aria-label='Go back'
              >
                <ArrowLeft className='w-5 h-5' />
                <span>Back</span>
              </button>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                <Users className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-xl font-bold'>Community Forum</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Master Management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className='max-w-6xl mx-auto px-6 pt-24 pb-8'>
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-8 border shadow-sm`}>
          <div className='mb-6'>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              Connect with other users, share tips, get help, and discuss productivity strategies.
            </p>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-blue-50'} rounded-lg p-4`}>
              <div className='flex items-center gap-3'>
                <MessageSquare className='h-5 w-5 text-blue-500' />
                <div>
                  <p className='text-sm text-gray-500'>Total Posts</p>
                  <p className='text-xl font-semibold'>156</p>
                </div>
              </div>
            </div>
            <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-green-50'} rounded-lg p-4`}>
              <div className='flex items-center gap-3'>
                <Users className='h-5 w-5 text-green-500' />
                <div>
                  <p className='text-sm text-gray-500'>Active Members</p>
                  <p className='text-xl font-semibold'>1,234</p>
                </div>
              </div>
            </div>
            <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-purple-50'} rounded-lg p-4`}>
              <div className='flex items-center gap-3'>
                <TrendingUp className='h-5 w-5 text-purple-500' />
                <div>
                  <p className='text-sm text-gray-500'>This Week</p>
                  <p className='text-xl font-semibold'>23 new</p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className='mb-6'>
            <h3 className='text-lg font-semibold mb-3'>Categories</h3>
            <div className='flex flex-wrap gap-2'>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.id
                    ? 'bg-purple-500 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <div className='flex items-center gap-2'>
                    <div className={`w-2 h-2 rounded-full ${category.color}`} />
                    {category.name}
                    <span className='text-xs opacity-75'>
                      (
                      {category.postCount}
                      )
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className='flex flex-col sm:flex-row gap-4 mb-6'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <input
                type='text'
                placeholder='Search posts, tags, or content...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
              />
            </div>
            <div className='flex gap-2'>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular' | 'trending')}
                className={`px-4 py-2.5 rounded-lg border ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
              >
                <option value='latest'>Latest</option>
                <option value='popular'>Most Liked</option>
                <option value='trending'>Most Viewed</option>
              </select>
              <button className='inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200'>
                <Plus className='h-4 w-4' />
                New Post
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className='space-y-4'>
            {sortedPosts.map((post) => (
              <div
                key={post.id}
                className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg border p-4 hover:shadow-md transition-shadow ${post.isSticky ? 'ring-2 ring-purple-500/20' : ''}`}
              >
                <div className='flex items-start gap-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg'>
                      {post.author.avatar}
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                          {post.isSticky && (
                            <Star className='h-4 w-4 text-yellow-500' />
                          )}
                          <h3 className='font-semibold text-lg hover:text-purple-500 cursor-pointer'>
                            {post.title}
                          </h3>
                          {post.isSolved && (
                            <span className='px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs font-medium rounded'>
                              Solved
                            </span>
                          )}
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-500 mb-2'>
                          <User className='h-3 w-3' />
                          <span>{post.author.name}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(post.author.role)}`}>
                            {post.author.role}
                          </span>
                          <Calendar className='h-3 w-3 ml-2' />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <div className={`w-2 h-2 rounded-full ${getCategoryColor(post.category)} ml-2`} />
                          <span className='capitalize'>{post.category}</span>
                        </div>
                      </div>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3 line-clamp-2`}>
                      {post.content}
                    </p>
                    <div className='flex items-center justify-between'>
                      <div className='flex flex-wrap gap-1'>
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-1 text-xs rounded ${darkMode
                              ? 'bg-gray-600 text-gray-300'
                              : 'bg-gray-200 text-gray-700'}`}
                          >
                            #
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <div className='flex items-center gap-1'>
                          <Eye className='h-4 w-4' />
                          <span>{post.views}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <ThumbsUp className='h-4 w-4' />
                          <span>{post.likes}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <MessageCircle className='h-4 w-4' />
                          <span>{post.replies}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Community Guidelines */}
          <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-blue-50 border-blue-200'} border`}>
            <div className='flex items-start gap-3'>
              <MessageSquare className='h-5 w-5 text-blue-500 mt-0.5' />
              <div>
                <h3 className='font-medium text-sm mb-1'>Community Guidelines</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Be respectful, stay on topic, search before posting, and help create a positive environment for everyone.
                  Read our full community guidelines for more details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;