import { useEffect, useState, type KeyboardEvent } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Users, ListChecks, Target } from 'lucide-react';

import { useProfileStore } from 'stores/profileStore';
import useModalStore from 'stores/modalStore';

// Temporary: fetch workspace name using route ID (stub)
const mockFetchWorkspace = async (id: string) => {
  await new Promise((res) => setTimeout(res, 300));
  return { id, name: `Workspace #${id}` };
};

// Temporary: rename workspace (stub)
const mockRenameWorkspace = async (id: string, name: string) => {
  await new Promise((res) => setTimeout(res, 300));
  return { id, name };
};

const WorkspaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const darkMode = useProfileStore((s) => s.data.theme) === 'dark';
  const [workspace, setWorkspace] = useState<{ id: string | undefined; name: string } | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [members, setMembers] = useState<{ id: number; name: string; role: 'Owner' | 'Admin' | 'Member'; avatarUrl?: string }[]>([
    { id: 1, name: 'You', role: 'Owner' },
    { id: 2, name: 'Alex Doe', role: 'Member' },
    { id: 3, name: 'Sam Lee', role: 'Member' },
    { id: 4, name: 'Jordan Smith', role: 'Member' },
    { id: 5, name: 'Taylor Kim', role: 'Member' },
    { id: 6, name: 'Morgan Lee', role: 'Member' },
  ]);
  const [tasks] = useState<{ id: number; title: string; status: 'Open' | 'In Progress' | 'Done' }[]>([
    { id: 101, title: 'Set up workspace rules', status: 'Open' },
    { id: 102, title: 'Invite teammates', status: 'In Progress' },
    { id: 103, title: 'Plan sprint backlog', status: 'Done' },
  ]);
  const [goals] = useState<{ id: number; title: string; status: 'Not Started' | 'In Progress' | 'Achieved' }[]>([
    { id: 201, title: 'Ship MVP', status: 'In Progress' },
    { id: 202, title: 'Reach 1K users', status: 'Not Started' },
    { id: 203, title: 'Improve onboarding NPS', status: 'Achieved' },
  ]);
  const [inviteCode] = useState<string>('WS-' + (id || '0000'));
  const updateVisibility = useModalStore((s) => s.updateVisibility);
  const [activeTab, setActiveTab] = useState<'tasks' | 'goals'>('tasks');

  const onTabsKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveTab((prev) => (prev === 'tasks' ? 'goals' : 'tasks'));
    }
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) { return parts[0].charAt(0).toUpperCase(); }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const currentUserId = 1; // mock current user
  const currentUserRole = members.find((m) => m.id === currentUserId)?.role || 'Member';
  const canManage = currentUserRole === 'Owner' || currentUserRole === 'Admin';

  const handleChangeRole = (memberId: number, role: 'Owner' | 'Admin' | 'Member') => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role } : m)));
  };

  const handleRemoveMember = (memberId: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  useEffect(() => {
    if (id) {
      mockFetchWorkspace(id).then(setWorkspace);
    }
  }, [id]);

  const startEditName = () => {
    if (!workspace) { return; }
    setNameInput(workspace.name);
    setIsEditingName(true);
  };

  const saveName = async () => {
    if (!id || !nameInput.trim() || !workspace) {
      setIsEditingName(false);
      return;
    }
    const updated = await mockRenameWorkspace(id, nameInput.trim());
    setWorkspace({ id: updated.id, name: updated.name });
    setIsEditingName(false);
  };

  return (
    <div className='p-8 space-y-8'>
      {/* Back */}
      <button
        type='button'
        className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:underline'
        onClick={() => navigate('/workspace')}
      >
        <ArrowLeft className='w-4 h-4' />
        {' '}
        Back
      </button>

      {/* Overview */}
      <section className={`rounded-xl border p-6 ${darkMode ? 'border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900' : 'border-gray-200 bg-gradient-to-b from-white to-gray-50'}`}>
        <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2'>
          <span className='sr-only'>Workspace ID</span>
          <span className='inline-flex items-center gap-1'>
            <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
            Active
          </span>
        </div>
        <div className='flex items-center justify-between gap-4'>
          <div className='min-w-0 flex-1'>
            {isEditingName ? (
              <input
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveName();
                  }
                  if (e.key === 'Escape') {
                    setIsEditingName(false);
                  }
                }}
                className={`text-2xl font-bold bg-transparent border-b outline-none ${darkMode ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
              />
            ) : (
              <h1
                className='text-2xl font-bold truncate cursor-text'
                onClick={startEditName}
                title='Click to rename'
              >
                {workspace ? workspace.name : 'Loading...'}
              </h1>
            )}
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Workspace ID:
              {id}
            </p>

          </div>
          {/* Members chips */}
          <div
            role='button'
            tabIndex={0}
            onClick={() => updateVisibility({
              modalType: 'manageMembersModal',
              isVisible: true,
              extraProps: {
                modalData: { members, canManage, onChangeRole: handleChangeRole, onRemoveMember: handleRemoveMember },
              },
            })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                updateVisibility({
                  modalType: 'manageMembersModal',
                  isVisible: true,
                  extraProps: {
                    modalData: { members, canManage, onChangeRole: handleChangeRole, onRemoveMember: handleRemoveMember },
                  },
                });
              }
            }}
            className='flex items-center gap-1 p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/40'
          >
            {members.slice(0, 5).map((m, idx) => {
              const isOverflowChip = members.length > 5 && idx === 4;
              if (isOverflowChip) {
                return (
                  <button
                    type='button'
                    onClick={() => updateVisibility({
                      modalType: 'manageMembersModal',
                      isVisible: true,
                      extraProps: {
                        modalData: {
                          members,
                          canManage,
                          onChangeRole: handleChangeRole,
                          onRemoveMember: handleRemoveMember,
                        },
                      },
                    })}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center shadow-sm ${darkMode ? 'border-gray-700 bg-gray-800 text-gray-300 hover:ring-2 hover:ring-emerald-400/30' : 'border-gray-200 bg-white text-gray-700 hover:ring-2 hover:ring-emerald-500/30'}`}
                    title='Manage members'
                  >
                    +
                    {members.length - 5}
                  </button>
                );
              }

              return (
                <div
                  key={m.id}
                  className={`w-9 h-9 rounded-full overflow-hidden border flex items-center justify-center ring-0 hover:ring-2 hover:ring-emerald-400/40 transition ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-200 bg-white text-gray-700'}`}
                  title={`${m.name} • ${m.role}`}
                >
                  {m.avatarUrl ? (
                    <img src={m.avatarUrl} alt={m.name} className='w-full h-full object-cover' />
                  ) : (
                    <span className='text-xs font-semibold'>{getInitials(m.name)}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className='flex items-center gap-2 shrink-0'>
            <Users className='w-5 h-5 hidden sm:block' />
            <div className='flex items-center gap-2'>
              <label htmlFor='invite' className='sr-only'>Invite code</label>
              <input
                id='invite'
                readOnly
                value={inviteCode}
                className={`h-9 w-28 sm:w-36 truncate rounded-lg border px-2 text-sm shadow-sm ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'}`}
                aria-label='Invite code'
              />
              <button
                type='button'
                onClick={() => navigator.clipboard.writeText(inviteCode)}
                className='h-9 px-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40'
                title='Copy invite code'
                aria-label='Copy invite code'
              >
                <Copy className='w-4 h-4' />
              </button>
              <button
                type='button'
                onClick={() => alert('Leave workspace – coming soon')}
                className='h-9 px-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/30'
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs: Tasks | Goals */}
      <section className={`rounded-xl border overflow-hidden ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div role='tablist' aria-label='Workspace content' className={`flex items-center relative ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
          <button
            role='tab'
            aria-selected={activeTab === 'tasks'}
            aria-controls='tab-panel-tasks'
            id='tab-tasks'
            type='button'
            onClick={() => setActiveTab('tasks')}
            onKeyDown={onTabsKeyDown}
            className={`px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 transition border-b-2 ${
              activeTab === 'tasks'
                ? darkMode
                  ? 'text-white bg-gray-800 border-emerald-400 font-semibold'
                  : 'text-gray-900 bg-white border-emerald-600 font-semibold'
                : darkMode
                  ? 'text-gray-300 hover:text-white border-transparent'
                  : 'text-gray-600 hover:text-gray-900 border-transparent'
            }`}
          >
            <span className='inline-flex items-center gap-2'>
              <ListChecks className='w-4 h-4' />
              Tasks
              <span className={`ml-2 inline-flex items-center justify-center min-w-5 h-5 rounded px-1 text-[11px] ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                {tasks.length}
              </span>
            </span>
          </button>
          <button
            role='tab'
            aria-selected={activeTab === 'goals'}
            aria-controls='tab-panel-goals'
            id='tab-goals'
            type='button'
            onClick={() => setActiveTab('goals')}
            onKeyDown={onTabsKeyDown}
            className={`px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 transition border-b-2 ${
              activeTab === 'goals'
                ? darkMode
                  ? 'text-white bg-gray-800 border-emerald-400 font-semibold'
                  : 'text-gray-900 bg-white border-emerald-600 font-semibold'
                : darkMode
                  ? 'text-gray-300 hover:text-white border-transparent'
                  : 'text-gray-600 hover:text-gray-900 border-transparent'
            }`}
          >
            <span className='inline-flex items-center gap-2'>
              <Target className='w-4 h-4' />
              Goals
              <span className={`ml-2 inline-flex items-center justify-center min-w-5 h-5 rounded px-1 text-[11px] ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                {goals.length}
              </span>
            </span>
          </button>
          <div className='flex-1' />
        </div>

        {/* Panels */}
        <div className='p-6'>
          {activeTab === 'tasks' ? (
            <div id='tab-panel-tasks' role='tabpanel' aria-labelledby='tab-tasks'>
              {/* Panel header */}
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-medium opacity-80'>All tasks</h3>
                <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{tasks.length}</span>
              </div>
              {tasks.length === 0 ? (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No tasks yet.</p>
              ) : (
                <ul className='space-y-3'>
                  {tasks.map((t) => (
                    <li key={t.id} className={`group flex items-center justify-between rounded-lg border px-4 py-3 shadow-sm hover:shadow ${darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-750' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                      <div className='flex items-center gap-3 min-w-0'>
                        <div className={`${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'} rounded-full w-7 h-7 flex items-center justify-center shrink-0`}>
                          <ListChecks className='w-4 h-4' />
                        </div>
                        <span className='font-medium truncate'>{t.title}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded transition ${t.status === 'Done'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : t.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {t.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div id='tab-panel-goals' role='tabpanel' aria-labelledby='tab-goals'>
              {/* Panel header */}
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-medium opacity-80'>All goals</h3>
                <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{goals.length}</span>
              </div>
              {goals.length === 0 ? (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No goals yet.</p>
              ) : (
                <ul className='space-y-3'>
                  {goals.map((g) => (
                    <li key={g.id} className={`group flex items-center justify-between rounded-lg border px-4 py-3 shadow-sm hover:shadow ${darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-750' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                      <div className='flex items-center gap-3 min-w-0'>
                        <div className={`${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'} rounded-full w-7 h-7 flex items-center justify-center shrink-0`}>
                          <Target className='w-4 h-4' />
                        </div>
                        <span className='font-medium truncate'>{g.title}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded transition ${g.status === 'Achieved'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : g.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {g.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default WorkspaceDetail;
