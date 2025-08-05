import { create } from 'zustand';

import { ModalNamesType, ModalPropsType, ModalTypes } from 'helpers/sharedTypes';

type ModalInitialStateType = Record<ModalNamesType, ModalTypes>;

type Payload = { modalType: ModalNamesType; isVisible: boolean; extraProps?: ModalPropsType; };

type ModalStoreType = {
  modals: ModalInitialStateType;
  updateVisibility: (_payload: Payload) => void;
  clearModalData: (_modalType: ModalNamesType) => void;
  resetAllModals: () => void;
};

const emptyModal: ModalTypes = { isVisible: false, extraProps: {} };

const useModalStore = create<ModalStoreType>((set) => ({
  modals: {
    switchTaskModal: emptyModal,
    confirmDeleteModal: emptyModal,
  },

  updateVisibility: ({ modalType, isVisible, extraProps }) => set((state) => ({
    modals: {
      ...state.modals,
      [modalType]: {
        ...(state.modals[modalType] ?? emptyModal),
        isVisible,
        extraProps: extraProps ?? state.modals[modalType]?.extraProps ?? {},
      },
    },
  })),

  clearModalData: (modalType) => set((state) => {
    const current = state.modals[modalType] ?? emptyModal;
    return {
      modals: {
        ...state.modals,
        [modalType]: { ...current, extraProps: { ...current.extraProps, modalData: undefined } },
      },
    };
  }),

  resetAllModals: () => set((state) => {
    const reset = {} as ModalInitialStateType;
    Object.keys(state.modals).forEach((k) => {
      reset[k as ModalNamesType] = emptyModal;
    });
    return { modals: reset };
  }),
}));

export default useModalStore;