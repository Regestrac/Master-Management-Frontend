import React, { useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

import { formatDuration } from 'helpers/utils';

import { useSettingsStore } from 'stores/settingsStore';

import { getTimeInsights } from 'services/analytics';

const formatHour = (h: number): string => {
  const hour = ((h % 24) + 24) % 24;
  const suffix = hour < 12 ? 'AM' : 'PM';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(display).padStart(2, '0')}:00 ${suffix}`;
};

const dayName = (index: number): string => {
  const arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return arr[index] ?? '';
};

const TimelyInsights = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const previousSearchParamsRef = useRef<string | null>(null);

  const [searchParams] = useSearchParams();

  const hourlyRef = useRef<number[]>(Array(24).fill(0));
  const dailyRef = useRef<number[]>(Array(7).fill(0)); // index 0 = Sunday
  const maxHourRef = useRef<number>(0);
  const maxDayRef = useRef<number>(0);
  const peakHourRef = useRef<number | null>(null);
  const bestDayRef = useRef<number | null>(null);

  const [, setTick] = useState(0);

  useEffect(() => {
    if (previousSearchParamsRef.current !== searchParams.toString()) {
      getTimeInsights(searchParams.toString())
        .then((data) => {
          // Expected shape based on backend: { daily_distribution: {day: 0-6, duration: seconds}[], hourly_distribution: {hour: 0-23, duration: seconds}[] }
          const hourly = Array(24).fill(0);
          const daily = Array(7).fill(0);

          if (Array.isArray(data?.hourly_distribution)) {
            for (const item of data.hourly_distribution) {
              const h = Number(item?.hour);
              const d = Number(item?.duration);
              if (!Number.isNaN(h) && h >= 0 && h < 24) {
                hourly[h] = Number.isFinite(d) ? d : 0;
              }
            }
          }

          if (Array.isArray(data?.daily_distribution)) {
            for (const item of data.daily_distribution) {
              const day = Number(item?.day); // 0 = Sunday
              const dur = Number(item?.duration);
              if (!Number.isNaN(day) && day >= 0 && day < 7) {
                daily[day] = Number.isFinite(dur) ? dur : 0;
              }
            }
          }

          // Compute helpers
          const maxHour = Math.max(0, ...hourly);
          const maxDay = Math.max(0, ...daily);
          const peakHour = maxHour > 0 ? hourly.indexOf(maxHour) : null;
          const bestDay = maxDay > 0 ? daily.indexOf(maxDay) : null; // 0 = Sun

          hourlyRef.current = hourly;
          dailyRef.current = daily;
          maxHourRef.current = maxHour;
          maxDayRef.current = maxDay;
          peakHourRef.current = peakHour;
          bestDayRef.current = bestDay;

          // Trigger re-render
          setTick((v) => v + 1);
        })
        .catch((error) => {
          toast.error(error?.error || 'Failed to fetch time insights');
        });
      previousSearchParamsRef.current = searchParams.toString();
    }
  }, [searchParams]);

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='mb-6'>
        <h4 className='text-xl font-bold mb-1'>Time Insights</h4>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your productivity patterns</p>
      </div>

      {/* Peak Hours */}
      <div className='mb-6'>
        <h5 className='font-medium mb-3'>Peak Productivity Hours</h5>

        <div className='flex justify-between text-xs text-gray-500'>
          <span>12 AM</span>
          <span>4 AM</span>
          <span>8 AM</span>
          <span>11 AM</span>
        </div>
        <div className='grid grid-cols-12 gap-1 mb-2'>
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i;
            const value = hourlyRef.current[hour] || 0;
            const max = maxHourRef.current || 0;
            // Visual intensity: keep a minimum visibility for zeros
            const intensity = max > 0 ? 0.15 + 0.85 * (value / max) : 0.1;

            return (
              <React.Fragment key={i}>
                <div
                  id={`hour-${hour}`}
                  className='h-8 rounded-sm relative group cursor-pointer transition-all hover:scale-110'
                  style={{
                    backgroundColor: 'var(--color-primary-500)',
                    opacity: intensity,
                    border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB',
                  }}
                  data-tooltip-id={`hour-${hour}`}
                />
                <Tooltip id={`hour-${hour}`}>
                  <div className='text-xs rounded'>
                    {formatHour(hour)}
                    <br />
                    {formatDuration(value)}
                  </div>
                </Tooltip>
              </React.Fragment>
            );
          })}
        </div>
        <div className='flex justify-between text-xs text-gray-500'>
          <span>12 PM</span>
          <span>4 PM</span>
          <span>8 PM</span>
          <span>11 PM</span>
        </div>
      </div>

      {/* Weekly Pattern */}
      <div className='mb-6'>
        <h5 className='font-medium mb-3'>Weekly Pattern</h5>
        <div className='space-y-2'>
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => {
            // index here matches backend mapping: 0 = Sunday ... 6 = Saturday
            const seconds = dailyRef.current[index] || 0;
            const max = maxDayRef.current || 0;
            const pct = max > 0 ? Math.round((seconds / max) * 100) : 0;
            return (
              <div key={day} className='flex items-center justify-between'>
                <span className='text-sm w-20'>{day.slice(0, 3)}</span>
                <div className='flex-1 mx-3'>
                  <div className={`w-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                    <div
                      className='h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500'
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className='text-sm font-medium w-16 text-right' title={formatDuration(seconds)}>
                  {formatDuration(seconds)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-2 gap-4'>
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
          <div className='text-lg font-bold text-primary-500'>
            {peakHourRef.current !== null ? formatHour(peakHourRef.current) : '—'}
          </div>
          <div className='text-xs text-gray-500'>Peak Hour</div>
        </div>
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
          <div className='text-lg font-bold text-green-500'>
            {bestDayRef.current !== null ? dayName(bestDayRef.current) : '—'}
          </div>
          <div className='text-xs text-gray-500'>Best Day</div>
        </div>
      </div>
    </div>
  );
};

export default TimelyInsights;
