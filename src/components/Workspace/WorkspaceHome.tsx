import { useState, useEffect, useRef, useMemo } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { PlusCircle, Users, AlertCircle } from 'lucide-react';

import { Workspace } from 'helpers/sharedTypes';
import { debounce } from 'helpers/utils';

import { useProfileStore } from 'stores/profileStore';
import useModalStore from 'stores/modalStore';

import { getWorkspaces } from 'services/workspace';

import WorkspaceSkeleton from './WorkspaceSkeleton';

// Mock API functions
const mockApi = {
  getWorkspaces: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      { id: 1, name: 'My Personal Workspace' },
      { id: 2, name: 'Team Alpha' },
    ];
  },
  createWorkspace: async (name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { id: Date.now(), name };
  },
  joinWorkspace: async (inviteCode: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (inviteCode === 'INVALID') {
      throw new Error('Invalid invite code');
    }
    return { id: Date.now(), name: `Workspace ${inviteCode}` };
  },
};

const WorkspaceHome = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const updateVisibility = useModalStore((state) => state.updateVisibility);

  const shouldFetchWorkspacesRef = useRef(true);
  const previousSearchKey = useRef('');

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const handleCreateOrJoinWorkspace = () => {
    updateVisibility({
      modalType: 'workspaceModal',
      isVisible: true,
      extraProps: {
        onSuccess: async (data?: { name?: string; inviteCode?: string }) => {
          if (!data) { return; }
          if (data.inviteCode) {
            const workspace = await mockApi.joinWorkspace(data.inviteCode);
            setWorkspaces((prev) => [...prev, workspace as any]);
          } else if (data.name) {
            const workspace = await mockApi.createWorkspace(data.name);
            setWorkspaces((prev) => [...prev, workspace as any]);
          }
        },
      },
    });
  };

  const fetchWorkspaces = useMemo(() => debounce((searchKey: string) => {
    setIsLoading(true);
    getWorkspaces(searchKey).then((res) => {
      setWorkspaces(res?.workspaces);
    }).catch((err) => {
      setError('Failed to load workspaces. ' + err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, 200), []);

  useEffect(() => {
    const searchKey = searchParams.get('searchKey') || '';
    if (shouldFetchWorkspacesRef.current) {
      fetchWorkspaces('');
      shouldFetchWorkspacesRef.current = false;
    }
    if (searchKey !== previousSearchKey.current) {
      fetchWorkspaces(searchKey);
      previousSearchKey.current = searchKey;
    }
  }, [searchParams, fetchWorkspaces]);

  return (
    <div className='p-8 space-y-8 h-[calc(100vh-165px)]'>
      <header className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold flex items-center gap-2'>
          <Users className='w-6 h-6' />
          Workspaces
        </h1>
        <button
          type='button'
          className='flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors disabled:opacity-50'
          onClick={handleCreateOrJoinWorkspace}
          disabled={isLoading}
        >
          <PlusCircle className='w-5 h-5' />
          <span>Create / Join</span>
        </button>
      </header>

      {isLoading ? (
        <WorkspaceSkeleton count={6} />
      ) : error ? (
        <div className='p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 flex items-start gap-2'>
          <AlertCircle className='w-5 h-5 mt-0.5 flex-shrink-0' />
          <span>{error}</span>
        </div>
      ) : workspaces?.length === 0 ? (
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          You are not part of any workspace yet. Use the button above to create or join one.
        </p>
      ) : (
        <ul className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {workspaces?.map((ws) => (
            <li
              key={ws.id}
              onClick={() => navigate(`/workspace/${ws.id}`)}
              className={`cursor-pointer p-6 rounded-xl border transition-colors ${darkMode
                ? 'border-gray-700 hover:bg-gray-700/50'
                : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <h3 className='font-medium text-lg'>{ws.name}</h3>
              <p className='text-sm mt-1 text-gray-500 dark:text-gray-400'>
                {ws.type === 'personal' ? 'Personal workspace' : 'Team workspace'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkspaceHome;