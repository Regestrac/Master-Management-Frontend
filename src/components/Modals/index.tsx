import useModalStore from 'stores/modalStore';

import SwitchTaskModal from 'components/Modals/SwitchTaskModal';
import ConfirmDeleteModal from 'components/Modals/ConfirmDeleteModal';

const Modals = () => {
  const { switchTaskModal, confirmDeleteModal } = useModalStore((state) => state.modals);

  return (
    <>
      {switchTaskModal.isVisible && <SwitchTaskModal />}
      {confirmDeleteModal.isVisible && <ConfirmDeleteModal /> }
    </>
  );
};

export default Modals;