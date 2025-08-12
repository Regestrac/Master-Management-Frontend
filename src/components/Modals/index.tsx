import useModalStore from 'stores/modalStore';

import SwitchTaskModal from 'components/Modals/SwitchTaskModal';
import ConfirmDeleteModal from 'components/Modals/ConfirmDeleteModal';
import WorkspaceModal from 'components/Modals/WorkspaceModal';

const Modals = () => {
  const { switchTaskModal, confirmDeleteModal, workspaceModal } = useModalStore((state) => state.modals);

  return (
    <>
      {switchTaskModal.isVisible && <SwitchTaskModal />}
      {confirmDeleteModal.isVisible && <ConfirmDeleteModal /> }
      {workspaceModal.isVisible && <WorkspaceModal /> }
    </>
  );
};

export default Modals;