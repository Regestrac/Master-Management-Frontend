import useModalStore from 'stores/modalStore';

import SwitchTaskModal from 'components/Modals/SwitchTaskModal';
import ConfirmDeleteModal from 'components/Modals/ConfirmDeleteModal';
import WorkspaceModal from 'components/Modals/WorkspaceModal';
import ManageMembersModal from 'components/Modals/ManageMembersModal';

const Modals = () => {
  const { switchTaskModal, confirmDeleteModal, workspaceModal, manageMembersModal } = useModalStore((state) => state.modals);

  return (
    <>
      {switchTaskModal.isVisible && <SwitchTaskModal />}
      {confirmDeleteModal.isVisible && <ConfirmDeleteModal /> }
      {workspaceModal.isVisible && <WorkspaceModal /> }
      {manageMembersModal.isVisible && <ManageMembersModal /> }
    </>
  );
};

export default Modals;