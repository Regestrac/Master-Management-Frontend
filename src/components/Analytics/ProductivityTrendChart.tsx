import { useEffect, useMemo, useRef, useState } from 'react';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useProfileStore } from 'stores/profileStore';

import { getProductivityChartData } from 'services/analytics';

const createChartPathString = (data: number[][]) => data.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
dayjs.extend(customParseFormat);

const dummyChartData = [[50, 190], [350, 190]]; // fallback flat line at 0h

// Helpers
type YUnit = 'hours' | 'minutes' | 'seconds';
const formatValue = (v: number, unit: YUnit) => {
  if (!Number.isFinite(v)) {
    return unit === 'hours' ? '0h' : unit === 'minutes' ? '0m' : '0s';
  }
  if (unit === 'hours') {
    const rounded = Math.round(v * 10) / 10; // 1 decimal for hours
    return `${rounded}h`;
  }
  const rounded = Math.round(v); // minutes/seconds as ints
  return `${rounded}${unit === 'minutes' ? 'm' : 's'}`;
};

const formatDateLabel = (isoDate: string) => {
  const d = new Date(isoDate);
  return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
};

const eachDayInclusive = (startISO: string, endISO: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startISO);
  const end = new Date(endISO);
  // normalize to UTC date only to compare consistently with API ISO dates
  const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const endUTC = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
  while (d.getTime() <= endUTC.getTime()) {
    dates.push(new Date(d).toISOString());
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return dates;
};

const ProductivityTrendChart = () => {
  const [chartData, setChartData] = useState<number[][]>(dummyChartData);
  const [xLabels, setXLabels] = useState<string[]>([]);
  const [maxHours, setMaxHours] = useState<number>(8); // generic max for Y scale
  const [yUnit, setYUnit] = useState<YUnit>('hours');
  const [peakText, setPeakText] = useState<string>('Peak: -');

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  const prevSearchParamsRef = useRef<string | null>(null);

  const [serarchParams] = useSearchParams();

  // Static chart layout (SVG viewBox 0..400 x 0..240)
  const CHART_LEFT = 50;
  const CHART_RIGHT = 410;
  const CHART_TOP = 10; // small padding from top
  const CHART_BOTTOM = 220; // align with current viewBox height
  const CHART_HEIGHT = CHART_BOTTOM - CHART_TOP; // 190

  const paramsRange = useMemo(() => {
    const startDate = serarchParams.get('startDate');
    const endDate = serarchParams.get('endDate');
    return { startDate: startDate || null, endDate: endDate || null };
  }, [serarchParams]);

  const yTicks = useMemo(() => {
    // 4 ticks: max, 75%, 50%, 25%
    const vals = [1, 0.75, 0.5, 0.25].map((p) => p * maxHours);
    return vals;
  }, [maxHours]);

  useEffect(() => {
    const currentParams = serarchParams?.toString() || '';
    if (prevSearchParamsRef.current === currentParams) {
      return;
    }
    prevSearchParamsRef.current = currentParams;

    getProductivityChartData(currentParams).then((data: any) => {
      // Support either shape:
      // 1) { daily: [{ date, focusTime(seconds) }, ...] }
      // 2) { sessions: [{ date, duration(seconds) }, ...] }
      let points: Array<{ date: string; seconds: number }>; // normalized per-day totals

      if (Array.isArray(data?.daily)) {
        points = data.daily.map((d: any) => ({ date: d.date, seconds: Number(d.focusTime || 0) }));
      } else if (Array.isArray(data?.sessions)) {
        points = data.sessions.map((s: any) => ({ date: s.date, seconds: Number(s.duration || 0) }));
      } else {
        points = [];
      }

      // Aggregate by date (in case sessions contains multiple entries per day)
      const dailyMap = new Map<string, number>();
      for (const p of points) {
        const dayISO = new Date(p.date);
        const key = new Date(Date.UTC(dayISO.getUTCFullYear(), dayISO.getUTCMonth(), dayISO.getUTCDate())).toISOString();
        dailyMap.set(key, (dailyMap.get(key) || 0) + (Number.isFinite(p.seconds) ? p.seconds : 0));
      }

      // Determine date range to render (URL params are in DD-MM-YYYY)
      let startISO = paramsRange.startDate || null;
      let endISO = paramsRange.endDate || null;

      // Try to parse URL params if present
      if (startISO && endISO) {
        const s = dayjs(startISO, 'DD-MM-YYYY', true);
        const e = dayjs(endISO, 'DD-MM-YYYY', true);
        if (s.isValid() && e.isValid()) {
          const sUTC = new Date(Date.UTC(s.year(), s.month(), s.date())).toISOString();
          const eUTC = new Date(Date.UTC(e.year(), e.month(), e.date())).toISOString();
          startISO = sUTC;
          endISO = eUTC;
        } else {
          startISO = null;
          endISO = null;
        }
      }

      if (!startISO || !endISO) {
        const keys = Array.from(dailyMap.keys()).sort();
        if (keys.length > 0) {
          startISO = startISO || keys[0];
          endISO = endISO || keys[keys.length - 1];
        }
      }

      if (!startISO || !endISO) {
        // Nothing to render
        setChartData(dummyChartData);
        setXLabels([]);
        return;
      }

      const allDays = eachDayInclusive(startISO, endISO);
      const secondsByDay = allDays.map((iso) => (dailyMap.get(iso) || 0));

      // Decide unit based on max seconds
      const maxSeconds = Math.max(...secondsByDay, 0);
      const unit: YUnit = maxSeconds >= 3600 ? 'hours' : (maxSeconds >= 60 ? 'minutes' : 'seconds');
      const divisor = unit === 'hours' ? 3600 : unit === 'minutes' ? 60 : 1;
      const valuesByDay = secondsByDay.map((s) => s / divisor);

      // Build coordinates
      const baseMin = unit === 'hours' ? 8 : 10; // avoid flattening for minutes/seconds
      const maxHoursCalc = Math.max(baseMin, Math.ceil(Math.max(...valuesByDay, 0)));
      const n = allDays.length;
      const dx = n > 1 ? (CHART_RIGHT - CHART_LEFT) / (n - 1) : 0;

      const coords: number[][] = valuesByDay.map((val, i) => {
        const x = CHART_LEFT + i * dx;
        const y = CHART_TOP + (1 - (val / maxHoursCalc)) * CHART_HEIGHT;
        return [x, y];
      });

      setChartData(coords.length ? coords : dummyChartData);
      const xLbls = allDays.map(formatDateLabel);
      setXLabels(xLbls);
      setMaxHours(maxHoursCalc);
      setYUnit(unit);

      // Peak day and value
      if (valuesByDay.length) {
        let maxIdx = 0;
        let maxVal = valuesByDay[0];
        for (let i = 1; i < valuesByDay.length; i += 1) {
          if (valuesByDay[i] > maxVal) {
            maxVal = valuesByDay[i];
            maxIdx = i;
          }
        }
        const peakISO = allDays[maxIdx];
        const weekday = new Date(peakISO).toLocaleDateString(undefined, { weekday: 'long' });
        setPeakText(`Peak: ${weekday} (${formatValue(maxVal, unit)})`);
      } else {
        setPeakText('Peak: -');
      }
    }).catch((error) => {
      toast.error(error?.error || 'Error fetching productivity chart data');
    });

    prevSearchParamsRef.current = serarchParams?.toString();
  }, [serarchParams, paramsRange.endDate, paramsRange.startDate, CHART_LEFT, CHART_RIGHT, CHART_TOP, CHART_HEIGHT]);

  return (
    <div className='lg:col-span-2'>
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h4 className='text-xl font-bold mb-1'>Productivity Trend</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Daily focus hours over time</p>
          </div>
          <div className='flex space-x-2'>
            <button className='px-3 py-1 bg-primary-100 text-primary-600 rounded-lg text-sm font-medium'>Hours</button>
            <button className={`px-3 py-1 rounded-lg text-sm font-medium ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Tasks</button>
          </div>
        </div>

        {/* Chart Placeholder - would use a real chart library like Chart.js or Recharts */}
        <div className='relative h-80'>
          <svg className='w-full h-full' viewBox='0 0 440 255'>
            <defs>
              <linearGradient id='chartGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                <stop offset='0%' stopColor='var(--color-primary-500)' stopOpacity='0.3' />
                <stop offset='100%' stopColor='var(--color-primary-500)' stopOpacity='0.05' />
              </linearGradient>
            </defs>

            {/* Grid lines (aligned with dynamic Y ticks) */}
            {yTicks.map((val, i) => {
              const y = CHART_TOP + (1 - (val / maxHours)) * CHART_HEIGHT;
              return (
                <line key={`grid-${i}`} x1={CHART_LEFT} y1={y} x2={CHART_RIGHT} y2={y} stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth='1' />
              );
            })}
            {[50, 110, 170, 230, 290, 350, 410].map((x) => (
              <line key={x} x1={x} y1={CHART_TOP} x2={x} y2={CHART_BOTTOM} stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth='1' />
            ))}

            {/* Chart area */}
            <path
              d={createChartPathString(chartData)}
              fill='url(#chartGradient)'
              stroke='none'
            />

            {/* Chart line */}
            <path
              d={createChartPathString(chartData)}
              fill='none'
              stroke='var(--color-primary-500)'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            />

            {/* Data points */}
            {chartData.map(([x, y], index) => (
              <circle key={index} cx={x} cy={y} r='4' fill='var(--color-primary-500)' stroke='white' strokeWidth='2' />
            ))}

            {/* Y-axis labels (dynamic) */}
            {yTicks.map((val, i) => {
              const y = CHART_TOP + (1 - (val / maxHours)) * CHART_HEIGHT;
              // +5 to nudge text visually aligned with grid line
              return (
                <text key={`ytick-${i}`} x='20' y={y + 5} fontSize={12} className={darkMode ? 'fill-gray-400' : 'fill-gray-600'}>
                  {formatValue(val, yUnit)}
                </text>
              );
            })}

            {/* X-axis labels (dynamic dates, rotated to avoid overlap) */}
            {xLabels.length > 0 && (
              xLabels.map((label, i) => {
                const n = xLabels.length;
                const dx = n > 1 ? (CHART_RIGHT - CHART_LEFT) / (n - 1) : 0;
                const x = CHART_LEFT + i * dx;
                const y = 230;
                return (
                  <text
                    key={`${label}-${i}`}
                    x={x}
                    y={y}
                    fontSize={11}
                    textAnchor='end'
                    transform={`rotate(-35, ${x}, ${y})`}
                    className={darkMode ? 'fill-gray-400' : 'fill-gray-600'}
                  >
                    {label}
                  </text>
                );
              })
            )}
          </svg>
        </div>

        <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex items-center space-x-4 text-sm'>
            <div className='flex items-center space-x-2'>
              <div className='w-3 h-3 bg-primary-500 rounded-full' />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Focus Hours</span>
            </div>
            <span className='font-medium'>{peakText}</span>
          </div>
          <span className='text-sm text-green-600 font-medium'>+18% vs last week</span>
        </div>
      </div>
    </div>
  );
};

export default ProductivityTrendChart;