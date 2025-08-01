import React, { useEffect, useCallback } from 'react';

import { X } from 'lucide-react';
import clsx from 'clsx';

import { ModalNamesType } from 'helpers/sharedTypes';

import useModalStore from 'stores/modalStore';
import { useProfileStore } from 'stores/profileStore';

type ModalWrapperPropsType = {
  modalType: ModalNamesType;
  children: React.ReactNode;
  className?: string;
};

const ModalWrapper = ({ modalType, children, className }: ModalWrapperPropsType) => {
  const { updateVisibility } = useModalStore();

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const disableOutsideClick = useModalStore((state) => state.modals[modalType]?.extraProps?.disableOutsideClick);
  const hideCloseButton = useModalStore((state) => state.modals[modalType]?.extraProps?.hideCloseButton);

  const handleClose = useCallback(() => {
    updateVisibility({ modalType, isVisible: false });
  }, [modalType, updateVisibility]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && !disableOutsideClick) {
      e.preventDefault();
      handleClose();
    }
  }, [disableOutsideClick, handleClose]);

  const handleOutsideClick = useCallback((e: React.MouseEvent) => {
    if (!disableOutsideClick && e.target === e.currentTarget) {
      handleClose();
    }
  }, [disableOutsideClick, handleClose]);

  useEffect(() => {
    if (!disableOutsideClick) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [disableOutsideClick, handleKeyDown]);

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm',
        darkMode ? 'bg-black/50' : 'bg-white/50',
        className,
      )}
      onClick={!disableOutsideClick ? handleOutsideClick : undefined}
    >
      <div
        className={clsx(
          'relative rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all p-6',
          darkMode ? 'bg-gray-800' : 'bg-white',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideCloseButton && (
          <button
            onClick={handleClose}
            className={clsx(
              'absolute top-4 right-4 p-1 rounded-lg transition-colors z-10',
              darkMode ? 'text-gray-300 hover:text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100',
            )}
            aria-label='Close'
          >
            <X className='w-5 h-5' />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
