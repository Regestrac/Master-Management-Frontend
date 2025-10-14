import { useState, useEffect } from 'react';

import { Lightbulb, AlertCircle, Send, Star, Users, Target, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useSettingsStore } from 'stores/settingsStore';

interface FeatureRequestForm {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  useCase: string;
  targetUsers: string;
  businessValue: string;
  acceptanceCriteria: string;
  additionalNotes: string;
}

const FeatureRequest = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FeatureRequestForm>({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    useCase: '',
    targetUsers: '',
    businessValue: '',
    acceptanceCriteria: '',
    additionalNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (field: keyof FeatureRequestForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Feature request submitted:', formData);
      window.alert('Feature request submitted successfully!');
      setIsSubmitting(false);
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        useCase: '',
        targetUsers: '',
        businessValue: '',
        acceptanceCriteria: '',
        additionalNotes: '',
      });
    }, 1000);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'low': return <Star className='h-4 w-4 text-green-500' />;
      case 'medium': return <Star className='h-4 w-4 text-yellow-500' />;
      case 'high': return <Star className='h-4 w-4 text-orange-500' />;
      case 'critical': return <Star className='h-4 w-4 text-red-500' />;
      default: return <Star className='h-4 w-4 text-gray-500' />;
    }
  };

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
                <Lightbulb className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-xl font-bold'>Feature Request</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Master Management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className='max-w-4xl mx-auto px-6 pt-24 pb-8'>
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-8 border shadow-sm`}>
          <div className='mb-6'>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              Share your ideas to help us improve the product. Provide detailed information about your feature request.
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Title */}
            <div>
              <label htmlFor='title' className='block text-sm font-medium mb-2'>
                Feature Title *
              </label>
              <input
                type='text'
                id='title'
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                placeholder='Brief title for the feature request'
              />
            </div>

            {/* Priority and Category */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='priority' className='block text-sm font-medium mb-2'>
                  Priority *
                </label>
                <div className='relative'>
                  <select
                    id='priority'
                    required
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className={`w-full px-4 py-2.5 pl-10 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                  >
                    <option value='low'>Low Priority</option>
                    <option value='medium'>Medium Priority</option>
                    <option value='high'>High Priority</option>
                    <option value='critical'>Critical Priority</option>
                  </select>
                  <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                    {getPriorityIcon(formData.priority)}
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor='category' className='block text-sm font-medium mb-2'>
                  Category
                </label>
                <input
                  type='text'
                  id='category'
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                  placeholder='e.g., UI/UX, Performance, Integration'
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor='description' className='block text-sm font-medium mb-2'>
                Feature Description *
              </label>
              <textarea
                id='description'
                required
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none`}
                placeholder='Detailed description of the requested feature'
              />
            </div>

            {/* Use Case */}
            <div>
              <label htmlFor='useCase' className='block text-sm font-medium mb-2'>
                <div className='flex items-center gap-2'>
                  <Target className='h-4 w-4' />
                  Use Case / Problem Statement *
                </div>
              </label>
              <textarea
                id='useCase'
                required
                rows={3}
                value={formData.useCase}
                onChange={(e) => handleInputChange('useCase', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none`}
                placeholder='What problem does this feature solve? How would it be used?'
              />
            </div>

            {/* Target Users and Business Value */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='targetUsers' className='block text-sm font-medium mb-2'>
                  <div className='flex items-center gap-2'>
                    <Users className='h-4 w-4' />
                    Target Users
                  </div>
                </label>
                <textarea
                  id='targetUsers'
                  rows={3}
                  value={formData.targetUsers}
                  onChange={(e) => handleInputChange('targetUsers', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none`}
                  placeholder='Who would benefit from this feature?'
                />
              </div>
              <div>
                <label htmlFor='businessValue' className='block text-sm font-medium mb-2'>
                  Business Value
                </label>
                <textarea
                  id='businessValue'
                  rows={3}
                  value={formData.businessValue}
                  onChange={(e) => handleInputChange('businessValue', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none`}
                  placeholder='What business value would this feature provide?'
                />
              </div>
            </div>

            {/* Acceptance Criteria */}
            <div>
              <label htmlFor='acceptanceCriteria' className='block text-sm font-medium mb-2'>
                Acceptance Criteria
              </label>
              <textarea
                id='acceptanceCriteria'
                rows={4}
                value={formData.acceptanceCriteria}
                onChange={(e) => handleInputChange('acceptanceCriteria', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none`}
                placeholder='What conditions must be met for this feature to be considered complete?'
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor='additionalNotes' className='block text-sm font-medium mb-2'>
                Additional Notes
              </label>
              <textarea
                id='additionalNotes'
                rows={3}
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none`}
                placeholder='Any additional information, mockups, or references'
              />
            </div>

            {/* Submit Button */}
            <div className='flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700'>
              <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <AlertCircle className='h-4 w-4' />
                <span>Fields marked with * are required</span>
              </div>
              <button
                type='submit'
                disabled={isSubmitting}
                className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
              >
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className='h-4 w-4' />
                    Submit Feature Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default FeatureRequest;