import { create } from 'zustand';

import { Member } from 'helpers/sharedTypes';

type WorkspaceStoreType = {
  members: Member[];
  setMembers: (_members: Member[]) => void;
};

const useWorkspaceStore = create<WorkspaceStoreType>()((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
}));

export default useWorkspaceStore;