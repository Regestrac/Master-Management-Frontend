import useModalStore from 'stores/modalStore';

import SwitchTaskModal from 'components/Modals/SwitchTaskModal';
import ConfirmDeleteModal from 'components/Modals/ConfirmDeleteModal';
import WorkspaceModal from 'components/Modals/WorkspaceModal';
import ManageMembersModal from 'components/Modals/ManageMembersModal';
import LeaveWorkspaceModal from 'components/Modals/LeaveWorkspaceModal';
import SignOutModal from 'components/Modals/SignOutModal';

const Modals = () => {
  const {
    switchTaskModal,
    confirmDeleteModal,
    workspaceModal,
    manageMembersModal,
    leaveWorkspaceModal,
    signOutModal,
  } = useModalStore((state) => state.modals);

  return (
    <>
      {switchTaskModal.isVisible && <SwitchTaskModal />}
      {confirmDeleteModal.isVisible && <ConfirmDeleteModal />}
      {workspaceModal.isVisible && <WorkspaceModal />}
      {manageMembersModal.isVisible && <ManageMembersModal />}
      {leaveWorkspaceModal.isVisible && <LeaveWorkspaceModal />}
      {signOutModal.isVisible && <SignOutModal />}
    </>
  );
};

export default Modals;