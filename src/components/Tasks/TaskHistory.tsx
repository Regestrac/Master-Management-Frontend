import { useEffect, useRef, useState } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { getHistory } from 'src/services/history';

type Props = {}

type HistoryItemType = {
  ID: number;
  action: string;
  CreatedAt: string;
  before: string;
  after: string;
}

const TaskHistory = (_props: Props) => {
  const [history, setHistory] = useState<HistoryItemType[]>([]);

  const { id } = useParams();

  const historyFetched = useRef(false);

  useEffect(() => {
    if (id && !historyFetched.current) {
      getHistory(id).then((res) => {
        setHistory(res.data);
        toast.success(res?.message || 'History fetched successfully');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch history');
      });
      historyFetched.current = true; // Prevent fetching again
    }
  }, [id]);

  return (
    <div className='border-1 border-blue-300 p-3 rounded-2xl'>
      <h3 className='text-lg font-semibold'>History</h3>
      <ul className='space-y-2'>
        {history.map((item) => (
          <li key={item.ID} className='p-2 rounded-md flex gap-2'>
            <span className='text-sm text-text-light flex 1'>{dayjs(item.CreatedAt).format('DD/MM/YYYY hh:mm A')}</span>
            <span className='text-sm flex-2'>{item.action}</span>
            <div className='text-sm text-text font-medium flex-8'>
              {item.before ? (
                <>
                  {item.before}
                  &nbsp; &rarr; &nbsp;
                </>
              ) : null}
              {item.after}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskHistory;