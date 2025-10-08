import { useState } from 'react';

import { Bug, AlertCircle, Send, Upload } from 'lucide-react';

import { useSettingsStore } from 'stores/settingsStore';

interface BugReportForm {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  environment: string;
  attachments: File[];
}

const BugReport = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const [formData, setFormData] = useState<BugReportForm>({
    title: '',
    description: '',
    severity: 'medium',
    category: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    environment: '',
    attachments: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof BugReportForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Bug report submitted:', formData);
      window.alert('Bug report submitted successfully!');
      setIsSubmitting(false);
      // Reset form
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        category: '',
        stepsToReproduce: '',
        expectedBehavior: '',
        actualBehavior: '',
        environment: '',
        attachments: [],
      });
    }, 1000);
  };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <div className='mb-6'>
          <div className='flex items-center gap-3 mb-2'>
            <Bug className='h-6 w-6 text-red-500' />
            <h1 className='text-2xl font-bold'>Report a Bug</h1>
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Help us improve by reporting any issues you encounter. Please provide as much detail as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Title */}
          <div>
            <label htmlFor='title' className='block text-sm font-medium mb-2'>
              Bug Title *
            </label>
            <input
              type='text'
              id='title'
              required
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
              placeholder='Brief description of the bug'
            />
          </div>

          {/* Severity and Category */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='severity' className='block text-sm font-medium mb-2'>
                Severity *
              </label>
              <select
                id='severity'
                required
                value={formData.severity}
                onChange={(e) => handleInputChange('severity', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
              >
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
                <option value='critical'>Critical</option>
              </select>
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
                placeholder='e.g., UI, Performance, Authentication'
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor='description' className='block text-sm font-medium mb-2'>
              Description *
            </label>
            <textarea
              id='description'
              required
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none`}
              placeholder='Detailed description of the bug'
            />
          </div>

          {/* Steps to Reproduce */}
          <div>
            <label htmlFor='stepsToReproduce' className='block text-sm font-medium mb-2'>
              Steps to Reproduce *
            </label>
            <textarea
              id='stepsToReproduce'
              required
              rows={4}
              value={formData.stepsToReproduce}
              onChange={(e) => handleInputChange('stepsToReproduce', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none`}
              placeholder='1. Go to...&#10;2. Click on...&#10;3. Enter...'
            />
          </div>

          {/* Expected vs Actual Behavior */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='expectedBehavior' className='block text-sm font-medium mb-2'>
                Expected Behavior *
              </label>
              <textarea
                id='expectedBehavior'
                required
                rows={3}
                value={formData.expectedBehavior}
                onChange={(e) => handleInputChange('expectedBehavior', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none`}
                placeholder='What should happen?'
              />
            </div>
            <div>
              <label htmlFor='actualBehavior' className='block text-sm font-medium mb-2'>
                Actual Behavior *
              </label>
              <textarea
                id='actualBehavior'
                required
                rows={3}
                value={formData.actualBehavior}
                onChange={(e) => handleInputChange('actualBehavior', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none`}
                placeholder='What actually happens?'
              />
            </div>
          </div>

          {/* Environment */}
          <div>
            <label htmlFor='environment' className='block text-sm font-medium mb-2'>
              Environment
            </label>
            <textarea
              id='environment'
              rows={2}
              value={formData.environment}
              onChange={(e) => handleInputChange('environment', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none`}
              placeholder='Browser, OS, Device, App version, etc.'
            />
          </div>

          {/* File Attachments */}
          <div>
            <label className='block text-sm font-medium mb-2'>
              Attachments
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50'} hover:border-purple-500 transition-colors`}>
              <div className='text-center'>
                <Upload className={`mx-auto h-10 w-10 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                <div className='mt-3'>
                  <label htmlFor='file-upload' className='cursor-pointer'>
                    <span className='text-purple-600 hover:text-purple-500 font-medium'>
                      Upload files
                    </span>
                    <input
                      id='file-upload'
                      type='file'
                      multiple
                      accept='image/*,.pdf,.doc,.docx,.txt'
                      onChange={handleFileUpload}
                      className='sr-only'
                    />
                  </label>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mt-1`}>
                    PNG, JPG, PDF, DOC up to 10MB each
                  </p>
                </div>
              </div>
            </div>

            {/* Display uploaded files */}
            {formData.attachments.length > 0 && (
              <div className='mt-3 space-y-2'>
                {formData.attachments.map((file, index) => (
                  <div key={index} className={`flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-2.5 rounded-lg`}>
                    <span className='text-sm'>{file.name}</span>
                    <button
                      type='button'
                      onClick={() => removeAttachment(index)}
                      className='text-red-500 hover:text-red-600 text-sm font-medium transition-colors'
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                  Submit Bug Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BugReport;