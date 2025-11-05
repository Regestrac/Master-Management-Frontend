import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Mail,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  Send,
  HelpCircle,
  Book,
  Users,
  Zap,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';

import { useSettingsStore } from 'stores/settingsStore';

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  category: 'general' | 'technical' | 'billing' | 'feature' | 'bug';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
};

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

const Support = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    priority: 'medium',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Support request submitted:', formData);
      window.alert('Support request submitted successfully! We\'ll get back to you within 24 hours.');
      setIsSubmitting(false);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        priority: 'medium',
        message: '',
      });
    }, 1000);
  };

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking the "Forgot Password" link on the login page. Enter your email address and we\'ll send you a reset link.',
      category: 'account',
    },
    {
      id: '2',
      question: 'How do I sync my calendar with external providers?',
      answer: 'Go to Settings > Integrations and select your calendar provider (Google Calendar, Outlook, etc.). Follow the authentication steps to connect your account.',
      category: 'integrations',
    },
    {
      id: '3',
      question: 'Can I collaborate with team members?',
      answer: 'Yes! You can create workspaces and invite team members. Go to your workspace settings and use the "Invite Members" feature to add collaborators.',
      category: 'collaboration',
    },
    {
      id: '4',
      question: 'How do focus sessions work?',
      answer: 'Focus sessions use the Pomodoro technique. Set a timer for focused work periods (default 25 minutes) followed by short breaks. You can customize the duration in Settings.',
      category: 'features',
    },
    {
      id: '5',
      question: 'Is my data secure and private?',
      answer: 'Absolutely. We use industry-standard encryption and security measures. Your data is never shared with third parties. Read our Privacy Policy for more details.',
      category: 'privacy',
    },
    {
      id: '6',
      question: 'How do I export my data?',
      answer: 'You can export your data from Settings > Data & Privacy > Export Data. Choose the format (CSV, JSON, PDF) and time range for your export.',
      category: 'data',
    },
  ];

  const supportChannels = [
    {
      icon: <Mail className='h-6 w-6' />,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@mastermanagement.com',
      responseTime: '24 hours',
      color: 'text-blue-500',
      bgColor: (isDark: boolean) => isDark ? 'bg-blue-900/20' : 'bg-blue-50',
      borderColor: (isDark: boolean) => isDark ? 'border-blue-800/50' : 'border-blue-200',
    },
    {
      icon: <MessageCircle className='h-6 w-6' />,
      title: 'Live Chat',
      description: 'Chat with our support team',
      contact: 'Available 9 AM - 6 PM EST',
      responseTime: 'Instant',
      color: 'text-green-500',
      bgColor: (isDark: boolean) => isDark ? 'bg-green-900/20' : 'bg-green-50',
      borderColor: (isDark: boolean) => isDark ? 'border-green-800/50' : 'border-green-200',
    },
    {
      icon: <Phone className='h-6 w-6' />,
      title: 'Phone Support',
      description: 'Call us directly',
      contact: '+1 (555) 123-4567',
      responseTime: 'Business hours',
      color: 'text-purple-500',
      bgColor: (isDark: boolean) => isDark ? 'bg-purple-900/20' : 'bg-purple-50',
      borderColor: (isDark: boolean) => isDark ? 'border-purple-800/50' : 'border-purple-200',
    },
  ];

  const quickLinks = [
    {
      icon: <Book className='h-5 w-5' />,
      title: 'Documentation',
      description: 'Comprehensive guides and tutorials',
      link: '/documentation',
    },
    {
      icon: <Users className='h-5 w-5' />,
      title: 'Community Forum',
      description: 'Connect with other users',
      link: '/community',
    },
    {
      icon: <Zap className='h-5 w-5' />,
      title: 'Feature Requests',
      description: 'Suggest new features',
      link: '/feature-request',
    },
  ];

  return (
    <div className={clsx('min-h-screen', darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900')}>
      {/* Header */}
      <header
        className={clsx(
          'sm:ml-70 border-b shadow-sm fixed top-0 left-0 right-0 z-50',
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
        )}
      >
        <div className='max-w-4xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={handleBack}
                className={clsx(
                  'flex items-center space-x-2 transition-colors',
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900',
                )}
                aria-label='Go back'
              >
                <ArrowLeft className='w-5 h-5' />
                <span>Back</span>
              </button>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                <HelpCircle className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-xl font-bold'>Help & Support</h1>
                <p className={clsx('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>Master Management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className='max-w-6xl mx-auto px-6 pt-24 pb-8'>
        <div
          className={clsx(
            'rounded-xl p-8 border shadow-sm',
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
          )}
        >
          <div className='mb-8'>
            <p className={clsx('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
              Get the help you need to make the most of Master Management. We're here to support you every step of the way.
            </p>
          </div>

          {/* Support Channels */}
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Contact Us</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {supportChannels.map((channel, index) => (
                <div
                  key={index}
                  className={clsx(
                    'rounded-lg p-4 border',
                    channel.bgColor(darkMode),
                    channel.borderColor(darkMode),
                  )}
                >
                  <div className={clsx(channel.color, 'mb-3')}>
                    {channel.icon}
                  </div>
                  <h3 className='font-semibold mb-1'>{channel.title}</h3>
                  <p className={clsx('text-sm mb-2', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                    {channel.description}
                  </p>
                  <p className='font-medium text-sm mb-1'>{channel.contact}</p>
                  <div className='flex items-center gap-1 text-xs text-gray-500'>
                    <Clock className='h-3 w-3' />
                    <span>
                      Response:
                      {' '}
                      {channel.responseTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Send us a Message</h2>
            <div className={clsx('rounded-lg p-6', darkMode ? 'bg-gray-700/50' : 'bg-gray-50')}>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='name' className='block text-sm font-medium mb-2'>
                      Full Name *
                    </label>
                    <input
                      type='text'
                      id='name'
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={clsx(
                        'w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors',
                        darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900',
                      )}
                      placeholder='Your full name'
                    />
                  </div>
                  <div>
                    <label htmlFor='email' className='block text-sm font-medium mb-2'>
                      Email Address *
                    </label>
                    <input
                      type='email'
                      id='email'
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={clsx(
                        'w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors',
                        darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900',
                      )}
                      placeholder='your.email@example.com'
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor='subject' className='block text-sm font-medium mb-2'>
                    Subject *
                  </label>
                  <input
                    type='text'
                    id='subject'
                    required
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                    placeholder='Brief description of your inquiry'
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='category' className='block text-sm font-medium mb-2'>
                      Category *
                    </label>
                    <select
                      id='category'
                      required
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={clsx(
                        'w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors',
                        darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900',
                      )}
                    >
                      <option value='general'>General Inquiry</option>
                      <option value='technical'>Technical Support</option>
                      <option value='billing'>Billing & Account</option>
                      <option value='feature'>Feature Request</option>
                      <option value='bug'>Bug Report</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor='priority' className='block text-sm font-medium mb-2'>
                      Priority
                    </label>
                    <select
                      id='priority'
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className={clsx(
                        'w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors',
                        darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900',
                      )}
                    >
                      <option value='low'>Low</option>
                      <option value='medium'>Medium</option>
                      <option value='high'>High</option>
                      <option value='urgent'>Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor='message' className='block text-sm font-medium mb-2'>
                    Message *
                  </label>
                  <textarea
                    id='message'
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={clsx(
                      'w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none',
                      darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900',
                    )}
                    placeholder='Please provide detailed information about your inquiry...'
                  />
                </div>

                <div className='flex items-center justify-between pt-4'>
                  <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <AlertCircle className='h-4 w-4' />
                    <span>We typically respond within 24 hours</span>
                  </div>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
                  >
                    {isSubmitting ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className='h-4 w-4' />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Quick Links</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.link}
                  className={clsx(
                    'rounded-lg p-4 border transition-colors group',
                    darkMode
                      ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100',
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <div className='text-purple-500'>
                      {link.icon}
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-medium group-hover:text-purple-500 transition-colors'>
                        {link.title}
                      </h3>
                      <p className={clsx('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                        {link.description}
                      </p>
                    </div>
                    <ExternalLink className='h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors' />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Frequently Asked Questions</h2>
            <div className='space-y-3'>
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className={clsx(
                    'rounded-lg border',
                    darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200',
                  )}
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className={clsx(
                      'w-full p-4 text-left transition-colors rounded-lg',
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
                    )}
                  >
                    <div className='flex items-center justify-between'>
                      <h3 className='font-medium'>{faq.question}</h3>
                      <div className={`transform transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''}`}>
                        <svg className='h-5 w-5 text-gray-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                        </svg>
                      </div>
                    </div>
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className='px-4 pb-4'>
                      <p className={clsx('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Office Hours */}
          <div
            className={clsx(
              'p-4 rounded-lg border',
              darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-blue-50 border-blue-200',
            )}
          >
            <div className='flex items-start gap-3'>
              <MapPin className='h-5 w-5 text-blue-500 mt-0.5' />
              <div>
                <h3 className='font-medium text-sm mb-1'>Support Hours</h3>
                <p className={clsx('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                  Monday - Friday: 9:00 AM - 6:00 PM EST
                  <br />
                  Saturday: 10:00 AM - 4:00 PM EST
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Support;