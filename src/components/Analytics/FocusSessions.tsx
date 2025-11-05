import { useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { formatDuration } from 'helpers/utils';

import { useSettingsStore } from 'stores/settingsStore';

import { getFocusSessionInfo } from 'services/analytics';

type FocusSessionInfoType = {
  total_sessions: number;
  duration: number;
  efficency: number;
};

type SessionsData = {
  category: string;
  duration: number;
  efficiency?: number;
};

const FocusSessions = () => {
  const [focusSessionInfo, setFocusSessionInfo] = useState<FocusSessionInfoType | null>(null);
  const [sessionsData, setSessionsData] = useState<SessionsData[]>([]);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const previousSearchParamsRef = useRef<string>('');

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (previousSearchParamsRef.current !== searchParams.toString()) {
      getFocusSessionInfo(searchParams.toString()).then((res) => {
        setFocusSessionInfo(res?.data);

        // Calculate total duration in seconds for all sessions
        const sessions = res?.sessions || [];
        const totalSecs = sessions.reduce((total: number, session: SessionsData) => {
          return total + (session.duration || 0);
        }, 0);

        // Calculate efficiency percentage for each session
        const sessionsWithEfficiency = sessions.map((session: SessionsData) => {
          const efficiency = totalSecs > 0 ? (session.duration / totalSecs) * 100 : 0;

          return {
            ...session,
            efficiency: parseFloat(efficiency.toFixed(2)),
          };
        });

        setSessionsData(sessionsWithEfficiency);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch focus session info. Please try again.');
      });
      previousSearchParamsRef.current = searchParams.toString();
    }
  }, [searchParams]);

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='mb-6'>
        <h4 className='text-xl font-bold mb-1'>Focus Sessions</h4>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Deep work analysis</p>
      </div>

      <div className='space-y-4'>
        <div className='text-center'>
          <div className='text-3xl font-bold text-primary-500 mb-1'>
            {formatDuration(focusSessionInfo?.duration || 0)}
          </div>
          <div className='text-sm text-gray-500'>Total session duration</div>
        </div>

        <div className='grid grid-cols-2 gap-4 text-center'>
          <div>
            <div className='text-xl font-bold'>
              {focusSessionInfo?.total_sessions || 0}
            </div>
            <div className='text-xs text-gray-500'>Sessions</div>
          </div>
          <div>
            <div className='text-xl font-bold'>
              {focusSessionInfo?.efficency?.toFixed(1) || 0}
              %
            </div>
            <div className='text-xs text-gray-500'>Efficiency</div>
          </div>
        </div>

        <div className='space-y-2'>
          <h6 className='font-medium text-sm'>Session Breakdown</h6>
          {sessionsData?.map((session, index) => (
            <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
              <div className='flex items-center justify-between mb-1'>
                <span className='text-sm font-medium'>{session.category}</span>
                <span className='text-sm text-primary-500'>{formatDuration(session.duration)}</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className={`flex-1 h-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full`}>
                  <div
                    className='h-1 bg-primary-500 rounded-full transition-all duration-500 ease-in-out'
                    style={{
                      width: `${session.efficiency || 0}%`,
                      minWidth: '0.25rem', // Ensure small percentages are visible
                    }}
                  />
                </div>
                <span className='text-xs text-gray-400 text-right'>
                  {session.efficiency || 0}
                  %
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FocusSessions;