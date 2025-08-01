import useModalStore from 'stores/modalStore';

import SwitchTaskModal from 'components/Modals/SwitchTaskModal';

const Modals = () => {
  const { switchTaskModal } = useModalStore((state) => state.modals);

  return (
    <>
      {switchTaskModal.isVisible && <SwitchTaskModal />}
      { }
    </>
  );
};

export default Modals;