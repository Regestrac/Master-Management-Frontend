import { useEffect, useRef, useState } from 'react';

import { Tag, X, Plus } from 'lucide-react';

import { useSettingsStore } from 'stores/settingsStore';

type TaskCategoryPropsType = {
  value: string;
  categories: string[];
  onChange: (_category: string | null) => void;
  onCreateCategory?: (_category: string) => void;
  placeholder?: string;
  className?: string;
};

// Fuzzy matching algorithm - sorts by similarity score
const fuzzyMatch = (str: string, pattern: string): number => {
  if (!pattern) { return 1; }

  const strLower = str.toLowerCase();
  const patternLower = pattern.toLowerCase();

  // Exact match gets highest score
  if (strLower === patternLower) { return 1000; }

  // Starts with pattern gets high score
  if (strLower.startsWith(patternLower)) { return 500; }

  // Contains pattern gets medium score
  if (strLower.includes(patternLower)) { return 100; }

  // Calculate fuzzy score based on character matches
  let score = 0;
  let patternIndex = 0;

  for (let i = 0; i < strLower.length && patternIndex < patternLower.length; i++) {
    if (strLower[i] === patternLower[patternIndex]) {
      score += 10;
      patternIndex++;
    }
  }

  // Bonus if all pattern characters were found
  if (patternIndex === patternLower.length) {
    score += 50;
  }

  return score;
};

const TaskCategory = ({
  value,
  categories,
  onChange,
  onCreateCategory,
  placeholder = 'Select category',
  className = '',
}: TaskCategoryPropsType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<string[]>(categories);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter and sort categories based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const scored = categories.map((cat) => ({
      category: cat,
      score: fuzzyMatch(cat, searchTerm),
    }));

    // Filter out items with score 0 and sort by score descending
    const filtered = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.category);

    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleCategorySelect = (category: string) => {
    onChange(category);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const handleCreateNew = () => {
    if (searchTerm.trim() && onCreateCategory) {
      const newCategory = searchTerm.trim();
      onCreateCategory(newCategory);
      // onChange(newCategory);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      if (filteredCategories.length > 0) {
        // Select first filtered category
        handleCategorySelect(filteredCategories[0]);
      } else if (onCreateCategory) {
        // Create new category if no matches
        handleCreateNew();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${value
          ? darkMode
            ? 'bg-primary-800/30 text-primary-200 border border-primary-600/50 hover:bg-primary-800/50'
            : 'bg-primary-100 text-primary-600 border border-primary-200 hover:bg-primary-200/70'
          : darkMode
            ? 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600'
            : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'}`}
      >
        <Tag className='w-3 h-3' />
        <span>{value || placeholder}</span>
        {value && (
          <X
            className='w-3 h-3 hover:text-red-500'
            onClick={handleClear}
          />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 mt-1 w-64 rounded-lg shadow-lg border z-50 ${darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'}`}
        >
          {/* Search Input */}
          <div className='p-2 border-b border-gray-700'>
            <input
              ref={inputRef}
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Search or create category...'
              className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-primary-500 ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
          </div>

          {/* Categories List */}
          <div className='max-h-60 overflow-y-auto'>
            {filteredCategories.length > 0 ? (
              <div className='py-1'>
                {filteredCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center space-x-2 ${category === value
                      ? darkMode
                        ? 'bg-primary-900/50 text-primary-300'
                        : 'bg-primary-50 text-primary-700'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Tag className='w-3.5 h-3.5' />
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className={`px-3 py-4 text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {searchTerm ? 'No matching categories found' : 'No categories available'}
              </div>
            )}

            {/* Create New Category Button */}
            {searchTerm.trim() && onCreateCategory && !categories.includes(searchTerm.trim()) && (
              <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  onClick={handleCreateNew}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center space-x-2 ${darkMode
                    ? 'text-primary-400 hover:bg-gray-700'
                    : 'text-primary-600 hover:bg-gray-100'}`}
                >
                  <Plus className='w-3.5 h-3.5' />
                  <span>
                    Create &quot;
                    <span className='font-medium'>{searchTerm.trim()}</span>
                    &quot;
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCategory;
