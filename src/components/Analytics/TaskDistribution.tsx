import { useEffect, useRef, useState } from 'react';

import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

import { generateRandomColor } from 'helpers/utils';

import { useProfileStore } from 'stores/profileStore';

import { getTaskDistributionData } from 'services/analytics';

type ApiResponseType = { category: string; count: string };

type DistributionItemType = {
  label: string;
  count: number;
  percentage: number;
  color: string;
};

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TaskDistribution = () => {
  const [items, setItems] = useState<DistributionItemType[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  const prevSearchParamsRef = useRef<string>('');

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const paramsString = searchParams.toString();
    if (paramsString !== prevSearchParamsRef.current) {
      setIsLoading(true);
      getTaskDistributionData(paramsString)
        .then((res) => {
          const data: ApiResponseType[] = res?.data || [];
          // Normalize API -> local
          const normalized = data.map((d) => ({
            label: d.category && d.category.trim() !== '' ? d.category : 'Uncategorized',
            count: Number(d.count) || 0,
          }));

          // Sort by count desc; always place 'Uncategorized' last
          const sorted = [...normalized].sort((a, b) => {
            const aUncat = a.label === 'Uncategorized';
            const bUncat = b.label === 'Uncategorized';
            if (aUncat && !bUncat) { return 1; }
            if (bUncat && !aUncat) { return -1; }
            return b.count - a.count;
          });

          const newTotal = sorted.reduce((acc, cur) => acc + cur.count, 0);

          const withMeta: DistributionItemType[] = sorted.map((n) => ({
            label: n.label,
            count: n.count,
            percentage: newTotal > 0 ? (n.count / newTotal) * 100 : 0,
            color: generateRandomColor(n.label),
          }));

          setItems(withMeta);
          setTotal(newTotal);
        })
        .catch((err) => {
          toast.error(err?.error || 'Failed to fetch task distribution data');
          setItems([]);
          setTotal(0);
        })
        .finally(() => {
          setIsLoading(false);
        });
      prevSearchParamsRef.current = paramsString;
    }
  }, [searchParams]);

  // Compute arcs for donut chart
  let accumulatedOffset = 0;
  const arcs = items.map((item) => {
    const length = (item.percentage / 100) * CIRCUMFERENCE;
    const dasharray = `${length} ${CIRCUMFERENCE - length}`;
    const dashoffset = -accumulatedOffset;
    accumulatedOffset += length;
    return { color: item.color, dasharray, dashoffset };
  });

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 px-4 border shadow-sm`}>
      <div className='mb-6 px-2'>
        <h4 className='text-xl font-bold mb-1'>Task Distribution</h4>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tasks by category this month</p>
      </div>

      <div className='flex items-center justify-center mb-6'>
        <div className='relative w-40 h-40'>
          <svg className='w-40 h-40 transform -rotate-90' viewBox='0 0 100 100'>
            {/* Background circle */}
            <circle cx='50' cy='50' r={RADIUS} stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth='10' fill='none' />
            {arcs.map((arc, idx) => (
              <circle
                key={idx}
                cx='50'
                cy='50'
                r={RADIUS}
                stroke={arc.color}
                strokeWidth='8'
                fill='none'
                strokeDasharray={arc.dasharray}
                strokeDashoffset={arc.dashoffset}
                strokeLinecap='round'
              />
            ))}
          </svg>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-center'>
              <div className='text-2xl font-bold'>{isLoading ? '—' : total}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Tasks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className='space-y-3 max-h-[180px] overflow-y-auto px-2 scrollbar-sm'>
        {isLoading && (
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</div>
        )}
        {!isLoading && items.length === 0 && (
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No data available</div>
        )}
        {!isLoading && items.map((item, index) => (
          <div key={index} className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-3 h-3 rounded-full' style={{ backgroundColor: item.color }} />
              <span className='text-sm font-medium'>{item.label}</span>
            </div>
            <div className='flex items-center space-x-2 text-sm'>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.count}</span>
              <span className='font-medium'>{`${item.percentage.toFixed(0)}%`}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDistribution;